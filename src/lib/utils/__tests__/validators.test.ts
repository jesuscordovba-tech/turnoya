import { describe, it, expect } from 'vitest'
import { clientFormSchema, serviceSchema, loginSchema } from '../validators'

describe('clientFormSchema', () => {
  it('accepts valid client data', () => {
    const result = clientFormSchema.safeParse({
      name: 'Juan Pérez',
      phone: '+50760001234',
    })

    expect(result.success).toBe(true)
  })

  it('rejects short name', () => {
    const result = clientFormSchema.safeParse({
      name: 'J',
      phone: '+50760001234',
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid Panama phone', () => {
    const result = clientFormSchema.safeParse({
      name: 'Juan',
      phone: '+507123',
    })

    expect(result.success).toBe(false)
  })
})

describe('serviceSchema', () => {
  it('accepts valid service data', () => {
    const result = serviceSchema.safeParse({
      name: 'Corte de cabello',
      duration: 30,
      price: 15,
    })

    expect(result.success).toBe(true)
  })

  it('rejects duration less than 15', () => {
    const result = serviceSchema.safeParse({
      name: 'Corte',
      duration: 5,
      price: 10,
    })

    expect(result.success).toBe(false)
  })

  it('rejects negative price', () => {
    const result = serviceSchema.safeParse({
      name: 'Corte',
      duration: 30,
      price: -5,
    })

    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'notanemail',
      password: '123456',
    })

    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123',
    })

    expect(result.success).toBe(false)
  })
})
