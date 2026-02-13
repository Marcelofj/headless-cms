/**
 * Article Transitions (Type-Driven Design)
 * 
 * Define as transições válidas entre estados de um artigo.
 * 
 * Type-safety garante que apenas transições válidas podem ser
 * representadas em compile time.
 * 
 * Baseado nas regras de negócio em RULES.md:
 * - draft → reviewing (submeter para revisão)
 * - reviewing → published (aprovar)
 * - reviewing → draft (rejeitar)
 * - draft → archived (arquivar rascunho)
 * - published → archived (arquivar publicado)
 * 
 * Transições inválidas são impossíveis de representar.
 */

import type { AuthorId } from './ids.type.js'
import type { ArticleStatus } from './article-status.type.js'

/**
 * Transição: Draft → Reviewing
 * 
 * Autor submete artigo para revisão.
 */
export type SubmitForReview = {
  readonly from: Extract<ArticleStatus, { status: 'draft' }>
  readonly to: Extract<ArticleStatus, { status: 'reviewing' }>
  readonly submittedBy: AuthorId
  readonly reviewer: AuthorId
  readonly submittedAt: Date
}

/**
 * Transição: Reviewing → Published
 * 
 * Revisor/Editor aprova e publica o artigo.
 */
export type ApproveAndPublish = {
  readonly from: Extract<ArticleStatus, { status: 'reviewing' }>
  readonly to: Extract<ArticleStatus, { status: 'published' }>
  readonly publishedBy: AuthorId
  readonly publishedAt: Date
  readonly url: string
}

/**
 * Transição: Reviewing → Draft
 * 
 * Revisor rejeita, retorna para rascunho.
 */
export type RejectReview = {
  readonly from: Extract<ArticleStatus, { status: 'reviewing' }>
  readonly to: Extract<ArticleStatus, { status: 'draft' }>
  readonly rejectedBy: AuthorId
  readonly rejectedAt: Date
  readonly reason: string
  readonly editableBy: AuthorId[]
}

/**
 * Transição: Draft → Archived
 * 
 * Arquiva um rascunho (nunca foi publicado).
 */
export type ArchiveDraft = {
  readonly from: Extract<ArticleStatus, { status: 'draft' }>
  readonly to: Extract<ArticleStatus, { status: 'archived' }>
  readonly archivedBy: AuthorId
  readonly archivedAt: Date
  readonly reason: string
}

/**
 * Transição: Published → Archived
 * 
 * Arquiva um artigo publicado (remove de circulação).
 */
export type ArchivePublished = {
  readonly from: Extract<ArticleStatus, { status: 'published' }>
  readonly to: Extract<ArticleStatus, { status: 'archived' }>
  readonly archivedBy: AuthorId
  readonly archivedAt: Date
  readonly reason: string
}

/**
 * Union de todas as transições válidas
 * 
 * Apenas estas transições podem existir no sistema.
 * Tentar criar outras transições resulta em erro de compilação.
 */
export type ArticleTransition =
  | SubmitForReview
  | ApproveAndPublish
  | RejectReview
  | ArchiveDraft
  | ArchivePublished

/**
 * Type guard: verifica se é transição de submissão
 */
export const isSubmitForReview = (
  transition: ArticleTransition
): transition is SubmitForReview => {
  return transition.from.status === 'draft' && transition.to.status === 'reviewing'
}

/**
 * Type guard: verifica se é transição de aprovação
 */
export const isApproveAndPublish = (
  transition: ArticleTransition
): transition is ApproveAndPublish => {
  return transition.from.status === 'reviewing' && transition.to.status === 'published'
}

/**
 * Type guard: verifica se é transição de rejeição
 */
export const isRejectReview = (
  transition: ArticleTransition
): transition is RejectReview => {
  return transition.from.status === 'reviewing' && transition.to.status === 'draft'
}

/**
 * Type guard: verifica se é arquivamento de draft
 */
export const isArchiveDraft = (
  transition: ArticleTransition
): transition is ArchiveDraft => {
  return transition.from.status === 'draft' && transition.to.status === 'archived'
}

/**
 * Type guard: verifica se é arquivamento de publicado
 */
export const isArchivePublished = (
  transition: ArticleTransition
): transition is ArchivePublished => {
  return transition.from.status === 'published' && transition.to.status === 'archived'
}