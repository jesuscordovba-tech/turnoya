import { z } from 'zod'

export const clientFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z
    .string()
    .regex(/^\+507\d{8}$/, 'El teléfono debe ser +507XXXXXXXX'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  notes: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

export const serviceSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  description: z.string().max(500).optional(),
  duration: z.number().int().min(15, 'Mínimo 15 minutos').max(480, 'Máximo 8 horas'),
  price: z.number().min(0, 'El precio no puede ser negativo').max(9999.99),
})

export const businessSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(200),
  description: z.string().max(2000).optional(),
  phone: z.string().regex(/^\+507\d{8}$/, 'Teléfono debe ser +507XXXXXXXX'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().max(500).optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const registerSchema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
    businessName: z.string().min(2, 'El nombre del negocio es requerido'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type ClientFormData = z.infer<typeof clientFormSchema>
export type ServiceFormData = z.infer<typeof serviceSchema>
export type BusinessFormData = z.infer<typeof businessSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
