export interface TimeSlot {
  time: string
  available: boolean
}

interface GenerateSlotsInput {
  openTime: string
  closeTime: string
  serviceDuration: number
  slotInterval: number
  existingAppointments: Array<{ start: string; end: string }>
  paddingBefore: number
  paddingAfter: number
}

function parseTime(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function addMinutes(time: number, minutes: number): number {
  return time + minutes
}

export function generateTimeSlots(input: GenerateSlotsInput): TimeSlot[] {
  const {
    openTime,
    closeTime,
    serviceDuration,
    slotInterval,
    existingAppointments,
    paddingBefore,
    paddingAfter,
  } = input

  const slots: TimeSlot[] = []

  const busyPeriods = existingAppointments.map((a) => ({
    start: addMinutes(parseTime(a.start), -paddingBefore),
    end: addMinutes(parseTime(a.end), paddingAfter),
  }))

  let current = parseTime(openTime)
  const end = parseTime(closeTime)

  while (addMinutes(current, serviceDuration) <= end) {
    const slotEnd = addMinutes(current, serviceDuration)
    const isAvailable = !busyPeriods.some(
      (bp) => current < bp.end && slotEnd > bp.start,
    )

    slots.push({
      time: formatMinutes(current),
      available: isAvailable,
    })

    current = addMinutes(current, slotInterval)
  }

  return slots
}
