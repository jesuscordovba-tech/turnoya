import type { VercelRequest, VercelResponse } from '@vercel/node'

interface ServiceInfo {
  name: string
  duration: number
  price: number
}

interface NotificationBody {
  businessPhone: string
  clientName: string
  services: ServiceInfo[]
  date: string
  time: string
  clientPhone: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID

  if (!token || !phoneId) {
    return res.status(501).json({ error: 'WhatsApp no configurado' })
  }

  const body = req.body as NotificationBody

  if (!body.businessPhone || !body.clientName || !body.services?.length) {
    return res.status(400).json({ error: 'Faltan campos requeridos' })
  }

  const serviceList = body.services.map((s) => `• ${s.name} (${s.duration}min)`).join('\n')
  const totalDuration = body.services.reduce((sum, s) => sum + s.duration, 0)
  const totalPrice = body.services.reduce((sum, s) => sum + Number(s.price), 0)

  const messageText = [
    '✂️ *Nueva reserva*',
    '',
    `*Cliente:* ${body.clientName}`,
    `*Teléfono:* ${body.clientPhone}`,
    `*Servicios:*`,
    serviceList,
    `*Duración total:* ${totalDuration} min`,
    `*Fecha:* ${body.date}`,
    `*Hora:* ${body.time}`,
    `*Total:* \$${totalPrice.toFixed(2)}`,
    '',
    'Para confirmar, respondé: *CONFIRMAR*',
    'Para cancelar, respondé: *CANCELAR*',
    '',
    `O entrá al dashboard: https://turnoya-omega.vercel.app/dashboard`,
  ].join('\n')

  try {
    const to = body.businessPhone
      .replace(/^\+/, '')
      .replace(/^(\d{7,8})$/, '507$1')

    const response = await fetch(
      `https://graph.facebook.com/v22.0/${phoneId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: messageText },
        }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('WhatsApp API error:', JSON.stringify(data))
      return res.status(500).json({ error: 'Error al enviar mensaje' })
    }

    return res.json({ success: true })
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error)
    return res.status(500).json({ error: 'Error interno' })
  }
}
