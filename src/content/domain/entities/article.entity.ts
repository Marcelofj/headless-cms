/**
 * Article Entity (Type-Driven Design)
 * 
 * Entidade central do CMS que representa um artigo completo.
 * 
 * Usa genéricos para preservar tipos específicos:
 * - Article<'news'> → NewsMetadata + NewsContent
 * - Article<'tutorial'> → TutorialMetadata + TutorialContent
 * 
 * Invariantes garantidas:
 * - Slug sempre válido
 * - Status consistente com dados
 * - Metadata e content corretos para o tipo
 * - IDs branded (type-safe)
 * - Timestamps obrigatórios
 */

import type { ArticleId, AuthorId, CategoryId, TagId, MediaId } from '../types/ids.type.js'
import type { ArticleType } from '../types/article.type.js'
import type { ArticleMetadata } from '../types/article-metadata.type.js'
import type { ArticleContent } from '../types/article-content.type.js'
import type { ArticleStatus } from '../types/article-status.type.js'
import type { SEOMetadata } from '../types/seo-metadata.type.js'
import type { Slug } from '../value-objects/slug.value-object.js'

/**
 * Article Entity - Genérica por tipo de conteúdo
 * 
 * T extends ArticleType preserva o tipo específico através de lookup maps.
 * 
 * Exemplo:
 * ```ts
 * const tutorial: Article<'tutorial'> = {
 *   id: createArticleId('123'),
 *   type: 'tutorial',
 *   metadata: {
 *     difficulty: 'intermediate',  // ← TutorialMetadata
 *     estimatedDuration: 45,
 *     prerequisites: [],
 *     learningOutcomes: []
 *   },
 *   content: {
 *     introduction: '...',  // ← TutorialContent
 *     sections: [],
 *   },
 *   // ...
 * }
 * ```
 */
export type Article<T extends ArticleType> = {
  readonly id: ArticleId
  readonly type: T
  readonly slug: Slug
  readonly title: string
  readonly subtitle?: string
  readonly metadata: ArticleMetadata[T]
  readonly content: ArticleContent[T]
  readonly authors: readonly AuthorId[]
  readonly categories: readonly CategoryId[]
  readonly tags: readonly TagId[]
  readonly status: ArticleStatus
  readonly currentVersion: number
  readonly featuredImage?: MediaId
  readonly seo: SEOMetadata
  readonly createdAt: Date
  readonly updatedAt: Date
}

/**
 * Dados necessários para criar um novo artigo
 * 
 * Campos gerados automaticamente não são necessários:
 * - id (gerado)
 * - currentVersion (sempre 1)
 * - createdAt (Date.now())
 * - updatedAt (Date.now())
 * - status (sempre draft inicial)
 */
export type CreateArticleData<T extends ArticleType> = {
  readonly type: T
  readonly slug: Slug
  readonly title: string
  readonly subtitle?: string
  readonly metadata: ArticleMetadata[T]
  readonly content: ArticleContent[T]
  readonly authors: readonly AuthorId[]
  readonly categories?: readonly CategoryId[]
  readonly tags?: readonly TagId[]
  readonly featuredImage?: MediaId
  readonly seo?: Partial<SEOMetadata>
}

/**
 * Dados para atualizar um artigo existente
 * 
 * Todos os campos são opcionais exceto aqueles que não podem mudar:
 * - id (imutável)
 * - type (imutável)
 * - createdAt (imutável)
 */
export type UpdateArticleData<T extends ArticleType> = {
  readonly title?: string
  readonly subtitle?: string
  readonly slug?: Slug
  readonly metadata?: Partial<ArticleMetadata[T]>
  readonly content?: Partial<ArticleContent[T]>
  readonly categories?: readonly CategoryId[]
  readonly tags?: readonly TagId[]
  readonly featuredImage?: MediaId
  readonly seo?: Partial<SEOMetadata>
}

/**
 * Helper: cria um artigo em estado draft inicial
 * 
 * Gera automaticamente:
 * - currentVersion = 1
 * - status = draft
 * - timestamps
 * 
 * Uso:
 * ```ts
 * const article = createDraftArticle({
 *   id: createArticleId('123'),
 *   type: 'tutorial',
 *   slug: createSlug('typescript-basics').value,
 *   title: 'TypeScript Basics',
 *   metadata: { ... },
 *   content: { ... },
 *   authors: [authorId],
 *   seo: { keywords: ['typescript'] }
 * })
 * ```
 */
export const createDraftArticle = <T extends ArticleType>(
  data: CreateArticleData<T> & { id: ArticleId }
): Article<T> => {
  const now = new Date()

  return {
    id: data.id,
    type: data.type,
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle,
    metadata: data.metadata,
    content: data.content,
    authors: data.authors,
    categories: data.categories ?? [],
    tags: data.tags ?? [],
    status: {
      status: 'draft',
      editableBy: [...data.authors]
    },
    currentVersion: 1,
    featuredImage: data.featuredImage,
    seo: {
      keywords: [],
      ...data.seo
    },
    createdAt: now,
    updatedAt: now
  }
}

/**
 * Helper: verifica se artigo pode ser editado
 * 
 * Apenas artigos em draft podem ser editados
 */
export const isEditable = (article: Article<ArticleType>): boolean => article.status.status === 'draft'

/**
 * Helper: verifica se artigo está publicado
 */
export const isPublished = (article: Article<ArticleType>): boolean => article.status.status === 'published'

/**
 * Helper: verifica se artigo está arquivado
 */
export const isArchived = (article: Article<ArticleType>): boolean => article.status.status === 'archived'

/**
 * Helper: obtém URL do artigo se publicado
 */
export const getPublishedUrl = (
  article: Article<ArticleType>
): string | null => {
  if (article.status.status === 'published') {
    return article.status.url
  }
  return null
}

/**
 * Helper: obtém data de publicação se publicado
 */
export const getPublishedDate = (
  article: Article<ArticleType>
): Date | null => {
  if (article.status.status === 'published') {
    return article.status.publishedAt
  }
  return null
}

/**
 * Helper: verifica se autor pode editar o artigo
 */
export const canAuthorEdit = (
  article: Article<ArticleType>,
  authorId: AuthorId
): boolean => {
  if (article.status.status !== 'draft') {
    return false
  }

  return article.status.editableBy.includes(authorId)
}