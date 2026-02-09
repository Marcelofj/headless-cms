import type { AuthorId } from './ids.type.js'

/**
 * Status de um artigo como discriminated union.
 * 
 * Cada status carrega dados específicos:
 * - draft: quem pode editar
 * - reviewing: quem está revisando, quando foi submetido
 * - published: quando foi publicado, URL final
 * - archived: quando foi arquivado, motivo
 * 
 * Impossível ter estados inconsistentes (ex: publishedAt em draft).
 */
export type ArticleStatus =
  | {
    status: 'draft'
    editableBy: AuthorId[]  // Autores que podem editar
  }
  | {
    status: 'reviewing'
    reviewer: AuthorId       // Quem está revisando
    submittedAt: Date        // Quando foi submetido para review
    submittedBy: AuthorId    // Quem submeteu
  }
  | {
    status: 'published'
    publishedAt: Date        // Quando foi publicado
    publishedBy: AuthorId    // Quem publicou
    url: string              // URL final (ex: /tech/my-article)
  }
  | {
    status: 'archived'
    archivedAt: Date         // Quando foi arquivado
    archivedBy: AuthorId     // Quem arquivou
    reason: string           // Motivo do arquivamento
    previousStatus: 'draft' | 'published'  // De onde veio
  }

/**
 * Type guard para verificar se artigo está em draft
 */
export function isDraft(
  status: ArticleStatus
): status is Extract<ArticleStatus, { status: 'draft' }> {
  return status.status === 'draft'
}

/**
 * Type guard para verificar se artigo está em review
 */
export function isUnderReview(
  status: ArticleStatus
): status is Extract<ArticleStatus, { status: 'reviewing' }> {
  return status.status === 'reviewing'
}

/**
 * Type guard para verificar se artigo está publicado
 */
export function isPublished(
  status: ArticleStatus
): status is Extract<ArticleStatus, { status: 'published' }> {
  return status.status === 'published'
}

/**
 * Type guard para verificar se artigo está arquivado
 */
export function isArchived(
  status: ArticleStatus
): status is Extract<ArticleStatus, { status: 'archived' }> {
  return status.status === 'archived'
}

/**
 * Retorna a data de publicação se o artigo estiver publicado
 */
export function getPublishedDate(status: ArticleStatus): Date | null {
  if (isPublished(status)) {
    return status.publishedAt  // ← TypeScript sabe que existe!
  }
  return null
}