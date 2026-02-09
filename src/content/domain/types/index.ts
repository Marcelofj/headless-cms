/**
 * Barrel export de todos os tipos do domínio.
 * 
 * Facilita imports:
 *   import { ContentType, Article, ArticleStatus } from '@/content/domain/types'
 * 
 * Em vez de múltiplos imports individuais.
 */

// Content Type
export type { ContentType } from './content-type.type.js'

// IDs
export type {
  ArticleId,
  AuthorId,
  CategoryId,
  TagId,
  MediaId,
  VersionId,
} from './ids.type.js'

export {
  createArticleId,
  createAuthorId,
  createCategoryId,
  createTagId,
  createMediaId,
  createVersionId,
} from './ids.type.js'

// Article Status
export type { ArticleStatus } from './article-status.type.js'
export {
  isDraft,
  isUnderReview,
  isPublished,
  isArchived,
  getPublishedDate,
} from './article-status.type.js'

// Metadata
export type {
  ArticleMetadata,
  NewsMetadata,
  OpinionMetadata,
  TutorialMetadata,
  ReviewMetadata,
  MetadataForType,
} from './article-metadata.type.js'

// Content
export type {
  ArticleContent,
  NewsContent,
  OpinionContent,
  TutorialContent,
  TutorialSection,
  ReviewContent,
  ContentForType,
} from './article-content.type.js'

// Article
export type {
  Article,
  SEOMetadata,
  NewsArticle,
  OpinionArticle,
  TutorialArticle,
  ReviewArticle,
  AnyArticle,
} from './article.type.js'