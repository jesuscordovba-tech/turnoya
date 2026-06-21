import { describe, it, expect } from 'vitest'
import { generateTimeSlots } from '../time'

describe('generateTimeSlots', () => {
  it('generates slots from open to close', () => {
    const slots = generateTimeSlots({
      openTime: '09:00',
      closeTime: '12:00',
      serviceDuration: 30,
      slotInterval: 30,
      existingAppointments: [],
      paddingBefore: 0,
      paddingAfter: 0,
    })

    expect(slots).toHaveLength(6)
    expect(slots[0]).toEqual({ time: '09:00', available: true })
    expect(slots[5]).toEqual({ time: '11:30', available: true })
  })

  it('marks slots as unavailable when overlapping with appointments', () => {
    const slots = generateTimeSlots({
      openTime: '09:00',
      closeTime: '12:00',
      serviceDuration: 30,
      slotInterval: 30,
      existingAppointments: [{ start: '09:30', end: '10:00' }],
      paddingBefore: 0,
      paddingAfter: 0,
    })

    expect(slots.find((s) => s.time === '09:00')?.available).toBe(true)
    expect(slots.find((s) => s.time === '09:30')?.available).toBe(false)
    expect(slots.find((s) => s.time === '10:00')?.available).toBe(true)
  })

  it('handles padding before and after appointments', () => {
    const slots = generateTimeSlots({
      openTime: '09:00',
      closeTime: '11:00',
      serviceDuration: 30,
      slotInterval: 30,
      existingAppointments: [{ start: '10:00', end: '10:30' }],
      paddingBefore: 15,
      paddingAfter: 15,
    })

    const slot930 = slots.find((s) => s.time === '09:30')
    const slot1000 = slots.find((s) => s.time === '10:00')

    expect(slot930?.available).toBe(false)
    expect(slot1000?.available).toBe(false)
  })

  it('returns empty array when no time fits service duration', () => {
    const slots = generateTimeSlots({
      openTime: '09:00',
      closeTime: '09:15',
      serviceDuration: 30,
      slotInterval: 30,
      existingAppointments: [],
      paddingBefore: 0,
      paddingAfter: 0,
    })

    expect(slots).toHaveLength(0)
  })

  it('uses slot interval correctly', () => {
    const slots = generateTimeSlots({
      openTime: '09:00',
      closeTime: '10:00',
      serviceDuration: 15,
      slotInterval: 15,
      existingAppointments: [],
      paddingBefore: 0,
      paddingAfter: 0,
    })

    expect(slots).toHaveLength(4)
    expect(slots.map((s) => s.time)).toEqual(['09:00', '09:15', '09:30', '09:45'])
  })
})
