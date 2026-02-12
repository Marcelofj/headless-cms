import { Article, ArticleType } from './article.type.js'

/**
 * Lookup-to-Union Type.
 * 
 * Constrói dinamicamente uma união de todos os artigos concretos
 * a partir do mapeamento entre ArticleType e Article<T>.
 * 
 * Equivale semanticamente a:
 *   | Article<'news'>
 *   | Article<'opinion'>
 *   | Article<'tutorial'>
 *   | Article<'review'>
 *   | ... (qualquer novo ArticleType futuro)
 * 
 * Esse tipo é essencial para:
 * - Iteração sobre coleções heterogêneas de artigos
 * - Type narrowing baseado na propriedade discriminante `type`
 * - Garantir correlação correta entre `type`, `metadata` e `content`
 * 
 * Novos ArticleType adicionados automaticamente passam a integrar
 * essa união, sem necessidade de manutenção manual.
 */
export type ArticleByType = {
  [K in ArticleType]: Article<K>
}[ArticleType]