import type { ArticleId } from './ids.type.js'
import type { ArticleMetadata } from './article-metadata.type.js'
import type { ArticleContent } from './article-content.type.js'
import type { SEOMetadata } from './seo-metadata.type.js'

/**
 * Union Type.
 * Tipos de conteúdo suportados pelo CMS.
 * 
 * Cada tipo tem estrutura específica de metadata e content.
 * Novos tipos devem ser adicionados aqui E nos lookup maps correspondentes.
 */
export type ArticleType =
  | 'news'      // Notícias factuais
  | 'opinion'   // Artigos de opinião
  | 'tutorial'  // Guias e tutoriais
  | 'review'    // Reviews de produtos/serviços


/**
 * Tipo Article genérico.
 * 
 * T extends ArticleType preserva o tipo específico, garantindo que:
 * - metadata é do tipo correto (ArticleMetadata[T])
 * - content é da estrutura correta (ArticleContent[T])
 * 
 * Exemplo:
 *   Article<'tutorial'> → metadata é TutorialMetadata, content é TutorialContent
 */
export type Article<T extends ArticleType> = {
  id: ArticleId
  type: T

  // Lookup maps garantem tipos corretos
  metadata: ArticleMetadata[T]
  content: ArticleContent[T]
  seo?: SEOMetadata
}