import { createDraftArticle, isPublished, getPublishedUrl } from './content/domain/entities/article.entity.js'
import type { ArticleType } from './content/domain/types/article.type.js'
import type { Article } from './content/domain/entities/article.entity.js'
import type { ArticleByType } from './content/domain/types/article-by-type.type.js'
import { createArticleId } from './content/domain/types/ids.type.js'
import { createSlug } from './content/domain/value-objects/slug.value-object.js'

// ============================================================================
// Exemplo 1: Criar um artigo de tutorial com tipos corretos
// ============================================================================

console.log('=== Exemplo 1: Artigo de Tutorial ===\n')

const slugTutoResult = createSlug('Advanced TypeScript')

if (!slugTutoResult.ok) {
  throw new Error(slugTutoResult.error.message)
}

const tutorial = createDraftArticle({
  id: createArticleId('a1'),
  type: 'tutorial',
  slug: slugTutoResult.value,
  title: 'Advanced TypeScript',
  metadata: {
    difficulty: 'advanced',
    estimatedDuration: 60,
    prerequisites: ['JavaScript Avançado', 'TypeScript Avançado'],
    learningOutcomes: []
  },
  content: {
    introduction: 'Deep dive...',
    sections: []
  },
  authors: []
})

console.log(tutorial)
console.log('\n')

// ============================================================================
// Exemplo 2: Criar um artigo de notícia
// ============================================================================

console.log('=== Exemplo 2: Artigo de Notícias ===\n')

const slugTNewsResult = createSlug('New Release Announced')

if (!slugTNewsResult.ok) {
  throw new Error(slugTNewsResult.error.message)
}

const news = createDraftArticle({
  id: createArticleId('a2'),
  type: 'news',
  slug: slugTNewsResult.value,
  title: 'New Release Announced',
  metadata: {
    source: 'Official Blog',
    breaking: true
  },
  content: {
    lead: 'Version 2.0 released',
    body: 'Version 2.0 released...'
  },
  authors: []
})

console.log(news)
console.log('\n')

// ============================================================================
// Exemplo 3: Trabalhando com coleção heterogênea
// ============================================================================

console.log('=== Exemplo 3: Coleção Heterogênea ===\n')

const articles: ArticleByType[] = [tutorial, news]

console.log(JSON.stringify(articles, null, 2))
console.log('\n')

// ============================================================================
// Exemplo 4: Narrowing por discriminante
// ============================================================================

console.log('=== Exemplo 4: Narrowing por Discriminante ===\n')


for (const article of articles) {
  switch (article.type) {
    case 'tutorial':
      console.log(article.metadata.difficulty)
      break

    case 'news':
      console.log(article.metadata.source)
      break
  }
}

console.log('\n')

// ============================================================================
// Exemplo 5: Uso de helpers de domínio
// ============================================================================

console.log('=== Exemplo 5: Uso de helpers de domínio ===\n')

articles.forEach(article => {
  if (isPublished(article)) {
    console.log('Publicado em:', getPublishedUrl(article))
  } else {
    console.log('Ainda não publicado:', article.title)
  }
})

console.log('\n')

// ============================================================================
// Exemplo 6: Exemplo de função genérica por tipo
// ============================================================================

console.log('=== Exemplo 6: Exemplo de função genérica por tipo ===\n')

const logArticle = <T extends ArticleType>(article: Article<T>) => {
  console.log('Tipo:', article.type)
  console.log('Título:', article.title)
}

logArticle(tutorial)
logArticle(news)
