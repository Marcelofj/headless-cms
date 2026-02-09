/**
 * Branded types para IDs.
 * 
 * Previne misturar IDs de diferentes entidades em compile time.
 * Ex: não é possível passar um AuthorId onde se espera ArticleId.
 */

// Tag symbol (não existe em runtime, apenas em tipos)
declare const tag: unique symbol

/**
 * Helper type para criar branded strings
 */
type Tag<T, TTag> = T & { readonly [tag]: TTag }

/**
 * ID de artigo (branded string)
 */
export type ArticleId = Tag<string, 'ArticleId'>

/**
 * ID de autor (branded string)
 */
export type AuthorId = Tag<string, 'AuthorId'>

/**
 * ID de categoria (branded string)
 */
export type CategoryId = Tag<string, 'CategoryId'>

/**
 * ID de tag (branded string)
 */
export type TagId = Tag<string, 'TagId'>

/**
 * ID de media (branded string)
 */
export type MediaId = Tag<string, 'MediaId'>

/**
 * ID de versão (branded string)
 */
export type VersionId = Tag<string, 'VersionId'>

/**
 * Cria um ArticleId a partir de string (cast seguro)
 */
export function createArticleId(id: string): ArticleId {
  return id as ArticleId
}

/**
 * Cria um AuthorId a partir de string (cast seguro)
 */
export function createAuthorId(id: string): AuthorId {
  return id as AuthorId
}

/**
 * Cria um CategoryId a partir de string (cast seguro)
 */
export function createCategoryId(id: string): CategoryId {
  return id as CategoryId
}

/**
 * Cria um TagId a partir de string (cast seguro)
 */
export function createTagId(id: string): TagId {
  return id as TagId
}

/**
 * Cria um MediaId a partir de string (cast seguro)
 */
export function createMediaId(id: string): MediaId {
  return id as MediaId
}

/**
 * Cria um VersionId a partir de string (cast seguro)
 */
export function createVersionId(id: string): VersionId {
  return id as VersionId
}