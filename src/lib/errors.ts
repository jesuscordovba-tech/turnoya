export class AppError extends Error {
  code: string | undefined
  status: number | undefined

  constructor(
    message: string,
    code?: string,
    status?: number,
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflicto con el recurso solicitado') {
    super(message, 'CONFLICT', 409)
    this.name = 'ConflictError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION', 400)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export function handleSupabaseError(error: unknown): AppError {
  if (error instanceof AppError) return error

  const sbError = error as { code?: string; message?: string; details?: string }

  if (sbError?.code === '23505') {
    return new ConflictError('Este registro ya existe')
  }
  if (sbError?.code === '23503') {
    return new AppError('Referencia inválida', 'FOREIGN_KEY', 400)
  }
  if (sbError?.code === '42P01') {
    return new AppError('Error de configuración', 'CONFIG', 500)
  }

  return new AppError(sbError?.message || 'Error inesperado', 'UNKNOWN', 500)
}
