/**
 * Slug Value Object (Type-Driven Design)
 * 
 * Branded type que representa um slug válido para URLs.
 * 
 * Invariantes garantidas após criação via smart constructor:
 * - Sempre lowercase
 * - Apenas letras, números e hífens
 * - Sem espaços
 * - Sem caracteres especiais
 * - Tamanho mínimo: 3 caracteres
 * - Tamanho máximo: 200 caracteres
 * - Não começa nem termina com hífen
 * 
 * Uma vez criado, o tipo garante que é válido.
 * Impossível criar Slug inválido que compile.
 */

import { Result, Ok, Err } from '../../../shared/types/result.type.js'
import { ValidationError, validationError } from '../types/domain-error.type.js'

/**
 * Brand symbol (phantom type - só existe em compile time)
 */
declare const SlugTag: unique symbol

/**
 * Slug - Branded Type
 * 
 * É uma string em runtime, mas TypeScript trata como tipo distinto.
 * Não pode ser criado diretamente, apenas via createSlug().
 */
export type Slug = string & { readonly [SlugTag]: 'Slug' }

/**
 * Normaliza uma string para formato de slug
 * 
 * Pure function - sem side effects
 */
const normalizeSlug = (input: string): string => {
  return input
    .toLowerCase()                    // lowercase
    .trim()                           // remove espaços nas pontas
    .normalize('NFD')                 // decompose caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '')  // remove diacríticos
    .replace(/\s+/g, '-')             // espaços → hífens
    .replace(/[^a-z0-9-]/g, '')       // remove caracteres especiais
    .replace(/-+/g, '-')              // múltiplos hífens → um hífen
    .replace(/^-+/, '')               // remove hífens do início
    .replace(/-+$/, '')               // remove hífens do final
}

/**
 * Valida estrutura de um slug já normalizado
 * 
 * Executa apenas validações estruturais.
 * Não realiza normalização.
 */
const validateSlug = (normalized: string): Result<void, ValidationError> => {
  // Validação: tamanho mínimo
  if (normalized.length < 3) {
    return Err(
      validationError(
        `Slug too short: "${normalized}" (minimum 3 characters)`,
        { normalized, minLength: 3 }
      )
    )
  }

  // Validação: tamanho máximo
  if (normalized.length > 200) {
    return Err(
      validationError(
        `Slug too long: ${normalized.length} characters (maximum 200)`,
        { normalized, length: normalized.length, maxLength: 200 }
      )
    )
  }

  return Ok(undefined)
}

/**
 * Smart constructor para Slug
 * 
 * Valida e normaliza input, retornando Result.
 * Única forma de criar um Slug.
 * 
 * Uso:
 * ```ts
 * const result = createSlug('Hello World!')
 * if (result.ok) {
 *   const slug: Slug = result.value  // "hello-world"
 * }
 * ```
 */
export const createSlug = (input: string): Result<Slug, ValidationError> => {
  // Validação: não pode ser vazio
  if (!input || input.trim().length === 0) {
    return Err(validationError('Slug cannot be empty'))
  }

  // Normalização
  const normalized = normalizeSlug(input)

  const validation = validateSlug(normalized)

  if (!validation.ok) {
    return validation
  }

  // Cast seguro - sabemos que é válido
  return Ok(normalized as Slug)
}

/**
 * Cria Slug sem validação
 * 
 * UNSAFE - use apenas quando tiver absoluta certeza que é válido.
 * Útil para deserialização de banco ou testes.
 * 
 * @internal
 */
export const unsafeSlug = (value: string): Slug => value as Slug

/**
 * Type guard - verifica se string é Slug válido
 * 
 * Útil para narrowing em runtime.
 */
export const isSlug = (value: string): value is Slug => {
  const normalized = normalizeSlug(value)
  const result = validateSlug(normalized)
  return result.ok
}