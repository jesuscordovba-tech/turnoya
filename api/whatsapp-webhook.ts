import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return null
  }

  return createClient(url, key)
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
  return phone
    .replace(/^\+/, '')
    .replace(/^(\d{7,8})$/, '507$1')
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

    console.log(`WhatsApp reply from ${from}: "${text}"`)

    if (text !== 'confirmar' && text !== 'cancelar') continue

    const action = text === 'confirmar' ? 'confirmed' : 'cancelled'

    const supabase = getSupabase()

    if (!supabase) {
      console.error('Supabase not configured')
      await sendReply(from, '❌ Error de configuración del servidor.')
      continue
    }

    const fromNormalized = normalizePhone(from)

    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .or(`phone.eq.${fromNormalized},phone.eq.${from}`)
      .maybeSingle()

    if (!business) {
      console.error(`No business found for phone ${from} / ${fromNormalized}`)
      await sendReply(from, '❌ No se encontró tu negocio. Verificá tu número en el dashboard.')
      continue
    }

    const { data: appointments } = await supabase
      .from('appointments')
      .select('id, client_name, start_time')
      .eq('business_id', business.id)
      .eq('status', 'pending')
      .gte('start_time', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(5)

    if (!appointments?.length) {
      await sendReply(from, '✅ No hay reservas pendientes por confirmar.')
      continue
    }

    const ids = appointments.map((a) => a.id)

    const { error } = await supabase
      .from('appointments')
      .update({ status: action === 'confirmed' ? 'confirmed' : 'cancelled' })
      .in('id', ids)

    if (error) {
      console.error('Error updating appointments:', error)
      await sendReply(from, '❌ Error al actualizar las reservas.')
      continue
    }

    const names = appointments.map((a) => a.client_name).join(', ')
    const replyMsg =
      action === 'confirmed'
        ? `✅ Reserva confirmada: ${names}`
        : `❌ Reserva cancelada: ${names}`

    await sendReply(from, replyMsg)
  }

  return res.status(200).json({ success: true })
}
