/**
 * Domain Errors (Type-Driven Design)
 * 
 * Erros de domínio como discriminated union.
 * Representa violações de regras de negócio.
 * 
 * Diferente de erros técnicos (network, database, etc).
 * 
 * Observabilidade (stack trace, context) é responsabilidade
 * da camada de Infrastructure/Observability (Dia 13).
 */

/**
 * Tipos possíveis de erro de domínio
 */
export type DomainErrorType =
  | 'ValidationError'
  | 'NotFoundError'
  | 'ConflictError'
  | 'UnauthorizedError'

/**
 * Erro base - todos os erros de domínio têm type e message
 */
export type BaseDomainError = {
  readonly type: DomainErrorType
  readonly message: string
}

/**
 * Erro de validação
 * 
 * Usado quando dados não atendem invariantes do domínio.
 */
export type ValidationError = BaseDomainError & {
  readonly type: 'ValidationError'
  readonly context?: Record<string, unknown>
}

/**
 * Erro de entidade não encontrada
 */
export type NotFoundError = BaseDomainError & {
  readonly type: 'NotFoundError'
  readonly entityType: string
  readonly entityId: string
}

/**
 * Erro de conflito (ex: slug duplicado)
 */
export type ConflictError = BaseDomainError & {
  readonly type: 'ConflictError'
  readonly field: string
  readonly value: unknown
}

/**
 * Erro de autorização
 */
export type UnauthorizedError = BaseDomainError & {
  readonly type: 'UnauthorizedError'
  readonly userId?: string
  readonly requiredPermission?: string
}

/**
 * Union de todos os erros de domínio
 * 
 * Discriminated union permite exhaustiveness checking.
 */
export type DomainError =
  | ValidationError
  | NotFoundError
  | ConflictError
  | UnauthorizedError

/**
 * Type guards para cada tipo de erro
 */
export const isValidationError = (error: DomainError): error is ValidationError => error.type === 'ValidationError'

export const isNotFoundError = (error: DomainError): error is NotFoundError => error.type === 'NotFoundError'

export const isConflictError = (error: DomainError): error is ConflictError => error.type === 'ConflictError'

export const isUnauthorizedError = (error: DomainError): error is UnauthorizedError => error.type === 'UnauthorizedError'

/**
 * Helper: cria ValidationError
 */
export const validationError = (
  message?: string,
  context?: Record<string, unknown>
): ValidationError => ({
  type: 'ValidationError',
  message: message || 'validationError',
  context
})

/**
* Helper: cria NotFoundError
*/
export const notFoundError = (
  entityType: string,
  entityId: string,
  message?: string): NotFoundError => ({
    type: 'NotFoundError',
    entityType,
    entityId,
    message: message || `${entityType} with id ${entityId} not found`
  })

/**
* Helper: cria ConflictError
*/
export const conflictError = (
  field: string,
  value: unknown,
  message?: string): ConflictError => ({
    type: 'ConflictError',
    field,
    value,
    message: message || `Conflict on field ${field}`
  })

/**
 * Helper: cria UnauthorizedError
 */
export const unauthorizedError = (
  userId?: string,
  requiredPermission?: string,
  message?: string
): UnauthorizedError => ({
  type: 'UnauthorizedError',
  userId,
  requiredPermission,
  message: message || 'Unauthorized'
})