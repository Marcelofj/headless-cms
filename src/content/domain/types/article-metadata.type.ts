import type { ContentType } from './content-type.type.js'

/**
 * Metadata específica para notícias
 */
export type NewsMetadata = {
  source: string           // Ex: "Reuters", "AP News"
  location?: string        // Ex: "São Paulo, Brazil"
  breaking: boolean        // Se é notícia urgente
  verifiedAt?: Date        // Quando foi verificada
}

/**
 * Metadata específica para artigos de opinião
 */
export type OpinionMetadata = {
  authorBio: string        // Bio curta do autor
  stance: 'for' | 'against' | 'neutral'  // Posição sobre o tema
  disclaimer?: string      // Disclaimer (ex: conflito de interesse)
}

/**
 * Metadata específica para tutoriais
 */
export type TutorialMetadata = {
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: number  // Minutos
  prerequisites: string[]    // Ex: ["JavaScript básico", "Node.js instalado"]
  learningOutcomes: string[] // O que o leitor vai aprender
}

/**
 * Metadata específica para reviews
 */
export type ReviewMetadata = {
  rating: number           // 1-5
  productName: string      // Nome do produto/serviço
  productUrl?: string      // Link para o produto
  pros: string[]           // Pontos positivos
  cons: string[]           // Pontos negativos
  verdict: string          // Veredicto final
}

/**
 * Lookup map: ContentType → Metadata
 * 
 * Uso: ArticleMetadata[T] onde T extends ContentType
 * 
 * Garante que cada tipo de conteúdo tenha a metadata correta.
 */
export type ArticleMetadata = {
  'news': NewsMetadata
  'opinion': OpinionMetadata
  'tutorial': TutorialMetadata
  'review': ReviewMetadata
}

/**
 * Helper type: extrai o tipo de metadata para um ContentType específico
 */
export type MetadataForType<T extends ContentType> = ArticleMetadata[T]