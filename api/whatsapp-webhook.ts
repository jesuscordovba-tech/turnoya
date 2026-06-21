import type { VercelRequest, VercelResponse } from '@vercel/node'

function supabaseFetch(path: string, options?: RequestInit) {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return null

  return fetch(`${url}${path}`, {
    ...options,
    headers: {
      ...options?.headers,
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
  })
}

async function sendReply(to: string, text: string) {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID

  if (!token || !phoneId) return

  await fetch(`https://graph.facebook.com/v22.0/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  })
}

function normalizePhone(phone: string): string {
  return phone.replace(/^\+/, '').replace(/^(\d{7,8})$/, '507$1')
}

const STATUS_MAP: Record<string, string> = {
  confirmar: 'confirmed',
  cancelar: 'cancelled',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return res.status(200).send(challenge)
    }

    return res.status(403).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const messages = req.body?.entry?.[0]?.changes?.[0]?.value?.messages

  if (!messages) {
    return res.status(200).json({ success: true })
  }

  for (const msg of messages) {
    if (msg.type !== 'text') continue

    const text = msg.text.body.trim().toLowerCase()
    const from = msg.from as string
    const newStatus = STATUS_MAP[text]

    console.log(`WhatsApp reply from ${from}: "${text}"`)

    if (!newStatus) continue

    const fromNormalized = normalizePhone(from)

    const bizRes = await supabaseFetch(
      `/rest/v1/businesses?select=id&or=(phone.eq.${fromNormalized},phone.eq.${from})`,
    )

    if (!bizRes) {
      await sendReply(from, '❌ Error de configuración del servidor.')
      continue
    }

    const businesses = await bizRes.json()
    const business = businesses?.[0]

    if (!business) {
      await sendReply(from, '❌ No se encontró tu negocio. Verificá tu número en el dashboard.')
      continue
    }

    const now = new Date().toISOString()
    const apptRes = await supabaseFetch(
      `/rest/v1/appointments?select=id,client_name&business_id=eq.${business.id}&status=eq.pending&start_time=gte.${now}&order=created_at.desc&limit=5`,
    )

    if (!apptRes) {
      await sendReply(from, '❌ Error de configuración del servidor.')
      continue
    }

    const appointments = await apptRes.json()

    if (!appointments?.length) {
      await sendReply(from, '✅ No hay reservas pendientes por confirmar.')
      continue
    }

    const ids = appointments.map((a: { id: string }) => a.id)
    const idList = ids.map((id: string) => `"${id}"`).join(',')

    const updRes = await supabaseFetch(
      `/rest/v1/appointments?id=in.(${idList})`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
        headers: { Prefer: 'return=minimal' },
      },
    )

    if (!updRes || !updRes.ok) {
      await sendReply(from, '❌ Error al actualizar las reservas.')
      continue
    }

    const names = appointments.map((a: { client_name: string }) => a.client_name).join(', ')
    const replyMsg =
      newStatus === 'confirmed'
        ? `✅ Reserva confirmada: ${names}`
        : `❌ Reserva cancelada: ${names}`

    await sendReply(from, replyMsg)
  }

  return res.status(200).json({ success: true })
}
