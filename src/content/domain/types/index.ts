/**
 * Barrel export de todos os tipos do domínio.
 * 
 * Facilita imports:
 *   import { ArticleType, ArticleStatus } from '@/content/domain/types'
 * 
 * Em vez de múltiplos imports individuais.
 */

// Lookup-to-Union
export type { ArticleByType } from './article-by-type.type.js'

// IDs
export type {
  ArticleId,
  AuthorId,
  CategoryId,
  TagId,
  MediaId,
  VersionId
} from './ids.type.js'

export {
  createArticleId,
  createAuthorId,
  createCategoryId,
  createTagId,
  createMediaId,
  createVersionId
} from './ids.type.js'

// Article Status
export type { ArticleStatus } from './article-status.type.js'
export {
  isDraft,
  isUnderReview,
  isPublished,
  isArchived,
  getPublishedDate
} from './article-status.type.js'

// Metadata
export type {
  ArticleMetadata,
  NewsMetadata,
  OpinionMetadata,
  TutorialMetadata,
  ReviewMetadata,
  MetadataForType
} from './article-metadata.type.js'

// Content
export type {
  ArticleContent,
  NewsContent,
  OpinionContent,
  TutorialContent,
  TutorialSection,
  ReviewContent,
  ContentForType
} from './article-content.type.js'

// Article
export type {
  ArticleType,
} from './article.type.js'

// SEO
export type { SEOMetadata } from './seo-metadata.type.js'

// Transitions
export type {
  SubmitForReview,
  ApproveAndPublish,
  RejectReview,
  ArchiveDraft,
  ArchivePublished,
} from './article-transitions.type.js'

export {
  isSubmitForReview,
  isApproveAndPublish,
  isRejectReview,
  isArchiveDraft,
  isArchivePublished
} from './article-transitions.type.js'

// Errors
export type {
  DomainErrorType,
  BaseDomainError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  DomainError,
} from './domain-error.type.js'

export {
  isValidationError,
  isNotFoundError,
  isConflictError,
  isUnauthorizedError,
  validationError,
  notFoundError,
  conflictError,
  unauthorizedError
} from './domain-error.type.js'