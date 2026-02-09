/**
 * Union Type.
 * Tipos de conteúdo suportados pelo CMS.
 * 
 * Cada tipo tem estrutura específica de metadata e content.
 * Novos tipos devem ser adicionados aqui E nos lookup maps correspondentes.
 */
export type ContentType =
  | 'news'      // Notícias factuais
  | 'opinion'   // Artigos de opinião
  | 'tutorial'  // Guias e tutoriais
  | 'review'    // Reviews de produtos/serviços