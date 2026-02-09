/**
 * Estrutura de SEO metadata
 */
export type SEOMetadata = {
  metaTitle?: string       // Título para SEO (se diferente do título)
  metaDescription?: string // Descrição para SEO
  keywords: string[]       // Palavras-chave
  ogImage?: string         // Open Graph image URL
  canonicalUrl?: string    // URL canônica
}