import type { ArticleType } from './article.type.js'
import type { MediaId } from './ids.type.js'

/**
 * Conteúdo de notícia
 */
export type NewsContent = {
  lead: string             // Parágrafo de abertura (lead/lede)
  body: string             // Corpo principal (markdown ou HTML)
  quotes?: Array<{         // Citações importantes
    text: string
    author: string
    role?: string          // Ex: "CEO da Empresa X"
  }>
  relatedArticles?: string[]  // IDs de artigos relacionados
}

/**
 * Conteúdo de artigo de opinião
 */
export type OpinionContent = {
  thesis: string           // Tese principal
  body: string             // Argumentação
  counterarguments?: string  // Contra-argumentos considerados
  conclusion: string       // Conclusão
}

/**
 * Seção de um tutorial
 */
export type TutorialSection = {
  title: string
  body: string             // Explicação
  code?: string            // Código de exemplo
  codeLanguage?: string    // Ex: "typescript", "javascript"
  images?: MediaId[]       // Imagens explicativas
}

/**
 * Conteúdo de tutorial
 */
export type TutorialContent = {
  introduction: string     // Introdução
  sections: TutorialSection[]
  conclusion?: string      // Conclusão
  additionalResources?: Array<{
    title: string
    url: string
    type: 'documentation' | 'video' | 'article' | 'tool'
  }>
}

/**
 * Conteúdo de review
 */
export type ReviewContent = {
  summary: string          // Resumo executivo
  detailedAnalysis: string // Análise detalhada
  testingMethodology?: string  // Como foi testado
  comparison?: string      // Comparação com alternativas
  images?: MediaId[]       // Fotos do produto
  videoReview?: MediaId    // Vídeo review
}

/**
 * Lookup map: ArticleType → Content
 * 
 * Uso: ArticleContent[T] onde T extends ArticleType
 * 
 * Garante que cada tipo de conteúdo tenha a estrutura correta.
 */
export type ArticleContent = {
  'news': NewsContent
  'opinion': OpinionContent
  'tutorial': TutorialContent
  'review': ReviewContent
}

/**
 * Helper type: extrai o tipo de content para um ArticleType específico
 */
export type ContentForType<T extends ArticleType> = ArticleContent[T]