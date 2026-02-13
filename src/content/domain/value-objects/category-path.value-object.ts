/**
 * CategoryPath Value Object (Type-Driven Design)
 * 
 * Branded type que representa um caminho hierárquico de categorias.
 * 
 * Invariantes garantidas após criação via smart constructor:
 * - Sempre começa com /
 * - Formato: /segment1/segment2/segment3
 * - Cada segmento é um slug válido (lowercase, hífens)
 * - Sem // duplicados
 * - Não termina com / (exceto raiz)
 * - Máximo 5 níveis de profundidade
 * - Máximo 200 caracteres total
 * 
 * Exemplos válidos:
 * - /tech
 * - /tech/programming
 * - /tech/programming/typescript
 * 
 * Uma vez criado, o tipo garante que é válido.
 */

import { Result, Ok, Err } from '../../../shared/types/result.type.js'
import { ValidationError, validationError } from '../types/domain-error.type.js'

/**
 * Brand symbol (phantom type - só existe em compile time)
 */
declare const CategoryPathTag: unique symbol

/**
 * CategoryPath - Branded Type
 * 
 * É uma string em runtime, mas TypeScript trata como tipo distinto.
 * Não pode ser criado diretamente, apenas via createCategoryPath().
 */
export type CategoryPath = string & { readonly [CategoryPathTag]: 'CategoryPath' }

/**
 * Normaliza um segmento de path (slug)
 */
const normalizeSegment = (segment: string): string => {
  return segment
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Valida um segmento individual
 */
const isValidSegment = (segment: string): boolean => {
  if (segment.length < 1) return false
  if (segment.length > 50) return false
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(segment)
}

/**
 * Valida e constrói um CategoryPath a partir de segmentos.
 * 
 * Função interna compartilhada pelos smart constructors.
 */
const buildCategoryPath = (
  segments: string[]
): Result<CategoryPath, ValidationError> => {

  if (segments.length === 0) {
    return Err(validationError('CategoryPath cannot be empty'))
  }

  if (segments.length > 5) {
    return Err(
      validationError(
        `CategoryPath too deep: ${segments.length} levels (maximum 5)`,
        { segments, depth: segments.length, maxDepth: 5 }
      )
    )
  }

  const normalizedSegments: string[] = []

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]

    if (!segment) {
      return Err(
        validationError(
          `Empty segment at position ${i + 1}`,
          { position: i + 1 }
        )
      )
    }

    const normalized = normalizeSegment(segment)

    if (!isValidSegment(normalized)) {
      return Err(
        validationError(
          `Invalid segment at position ${i + 1}: "${segment}"`,
          {
            segment,
            normalized,
            position: i + 1
          }
        )
      )
    }

    normalizedSegments.push(normalized)
  }

  const path = '/' + normalizedSegments.join('/')

  if (path.length > 200) {
    return Err(
      validationError(
        `CategoryPath too long: ${path.length} characters (maximum 200)`,
        { path, length: path.length, maxLength: 200 }
      )
    )
  }

  return Ok(path as CategoryPath)
}

/**
 * Smart constructor para CategoryPath a partir de string
 * 
 * Uso:
 * ```ts
 * const result = createCategoryPathFromString('/tech/programming')
 * 
 * if (result.ok) {
 *   const path: CategoryPath = result.value
 * }
 * ```
 */
export const createCategoryPathFromString = (
  input: string
): Result<CategoryPath, ValidationError> => {

  const cleaned = input.replace(/^\/+/, '').replace(/\/+$/, '')

  if (cleaned === '') {
    return Ok('/' as CategoryPath)
  }

  const segments = cleaned.split('/').filter(s => s.length > 0)

  return buildCategoryPath(segments)
}

/**
 * Smart constructor para CategoryPath a partir de array de segmentos
 * 
 * Uso:
 * ```ts
 * const result = createCategoryPathFromSegments(['tech', 'programming'])
 * 
 * if (result.ok) {
 *   const path: CategoryPath = result.value
 * }
 * ```
 */
export const createCategoryPathFromSegments = (
  segments: string[]
): Result<CategoryPath, ValidationError> => {

  const filtered = segments.filter(s => s.length > 0)

  return buildCategoryPath(filtered)
}

/**
 * Cria CategoryPath sem validação
 * 
 * UNSAFE - use apenas quando tiver absoluta certeza que é válido.
 * Útil para deserialização de banco ou testes.
 * 
 * @internal
 */
export const unsafeCategoryPath = (value: string): CategoryPath =>
  value as CategoryPath

/**
 * Type guard - verifica se string é CategoryPath válido
 */
export const isCategoryPath = (value: string): value is CategoryPath => {
  const result = createCategoryPathFromString(value)
  return result.ok
}

/**
 * Extrai segmentos de um CategoryPath
 */
export const getSegments = (path: CategoryPath): string[] => {
  if (path === '/') return []
  return path.slice(1).split('/')
}

/**
 * Retorna o nível/profundidade do path
 */
export const getLevel = (path: CategoryPath): number => {
  if (path === '/') return 0
  return getSegments(path).length
}

/**
 * Retorna o path pai
 */
export const getParentPath = (path: CategoryPath): CategoryPath | null => {
  if (path === '/') return null

  const segments = getSegments(path)

  if (segments.length === 1) {
    return '/' as CategoryPath
  }

  return ('/' + segments.slice(0, -1).join('/')) as CategoryPath
}

/**
 * Verifica se um path é ancestral de outro
 */
export const isAncestorOf = (
  ancestor: CategoryPath,
  descendant: CategoryPath
): boolean => {
  if (ancestor === descendant) return false
  if (ancestor === '/') return true

  return descendant.startsWith(ancestor + '/')
}