import type { ContentType } from './content-type.type.js'
import type { ArticleId } from './ids.type.js'
import type { ArticleMetadata } from './article-metadata.type.js'
import type { ArticleContent } from './article-content.type.js'
import type { SEOMetadata } from './seo-metadata.type.js'

/**
 * Tipo Article genérico.
 * 
 * T extends ContentType preserva o tipo específico, garantindo que:
 * - metadata é do tipo correto (ArticleMetadata[T])
 * - content é da estrutura correta (ArticleContent[T])
 * 
 * Exemplo:
 *   Article<'tutorial'> → metadata é TutorialMetadata, content é TutorialContent
 */
export type Article<T extends ContentType = ContentType> = {
  id: ArticleId
  type: T

  // Lookup maps garantem tipos corretos
  metadata: ArticleMetadata[T]
  content: ArticleContent[T]
  seo?: SEOMetadata
}

/**
 * Helper types para casos específicos
 */
export type NewsArticle = Article<'news'>
export type OpinionArticle = Article<'opinion'>
export type TutorialArticle = Article<'tutorial'>
export type ReviewArticle = Article<'review'>

/**
 * Union type de todos os tipos de artigos
 */
export type AnyArticle =
  | NewsArticle
  | OpinionArticle
  | TutorialArticle
  | ReviewArticle