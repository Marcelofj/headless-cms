/**
 * Main entry point - Dia 1
 * 
 * Demonstra o uso dos tipos criados.
 * Ainda não há lógica real, apenas exemplos de type-safety.
 */

import type {
  Article,
  ArticleByType,
  ArticleStatus
} from './content/domain/types/index.js'

import {
  createArticleId,
  createAuthorId,
  isPublished,
  getPublishedDate
} from './content/domain/types/index.js'

// ============================================================================
// Exemplo 1: Criar um artigo de tutorial com tipos corretos
// ============================================================================

console.log('=== Exemplo 1: Tutorial Article ===\n')

const tutorialArticle: Article<'tutorial'> = {
  id: createArticleId('tutorial-123'),
  type: 'tutorial',

  // Metadata específica de tutorial (TypeScript valida isso!)
  metadata: {
    difficulty: 'intermediate',
    estimatedDuration: 45,
    prerequisites: ['TypeScript básico', 'Node.js'],
    learningOutcomes: [
      'Entender type-driven design',
      'Usar lookup maps',
      'Criar discriminated unions'
    ]
  },

  // Content específica de tutorial
  content: {
    introduction: 'Neste tutorial, vamos aprender type-driven design...',
    sections: [
      {
        title: 'O que é Type-Driven Design?',
        body: 'Type-driven design significa usar o sistema de tipos...',
        code: 'type Article<T> = { type: T; metadata: Metadata[T] }',
        codeLanguage: 'typescript'
      },
      {
        title: 'Lookup Maps',
        body: 'Lookup maps permitem mapear tipos para estruturas...'
      }
    ],
    conclusion: 'Agora você entende os conceitos básicos!'
  }
}

console.log('Tutorial article criado:')
console.log({
  id: tutorialArticle.id,
  type: tutorialArticle.type,
  difficulty: tutorialArticle.metadata.difficulty,
  estimatedDuration: tutorialArticle.metadata.estimatedDuration,
  sectionsCount: tutorialArticle.content.sections.length
})
console.log()

// ============================================================================
// Exemplo 2: Criar um artigo de notícia
// ============================================================================

console.log('=== Exemplo 2: News Article ===\n')

const newsArticle: Article<'news'> = {
  id: createArticleId('news-456'),
  type: 'news',

  // Metadata específica de news
  metadata: {
    source: 'Reuters',
    location: 'São Paulo, Brasil',
    breaking: true,
    verifiedAt: new Date('2024-02-05')
  },

  // Content específica de news
  content: {
    lead: 'Governo anuncia nova medida econômica...',
    body: 'Em coletiva realizada hoje, o ministro da economia informou...',
    quotes: [
      {
        text: 'Esta é uma medida importante para o país',
        author: 'Ministro da Economia',
        role: 'Ministro'
      }
    ]
  }
}

console.log('News article criado:')
console.log({
  id: newsArticle.id,
  type: newsArticle.type,
  source: newsArticle.metadata.source,
  breaking: newsArticle.metadata.breaking
})
console.log()

// ============================================================================
// Exemplo 3: Discriminated union em ação
// ============================================================================

console.log('=== Exemplo 3: Discriminated Union (ArticleStatus) ===\n')

const draftStatus: ArticleStatus = {
  status: 'draft',
  editableBy: [createAuthorId('author-1'), createAuthorId('author-2')]
}

const publishedStatus: ArticleStatus = {
  status: 'published',
  publishedAt: new Date('2024-02-01'),
  publishedBy: createAuthorId('publisher-1'),
  url: '/tutorials/type-driven-design'
}

// Type guard funciona!
if (isPublished(publishedStatus)) {
  console.log('Article is published at:', publishedStatus.publishedAt)
  console.log('URL:', publishedStatus.url)
  // TypeScript sabe que publishedAt e url existem aqui!
}
console.log()

// Helper function também funciona
const publishDate = getPublishedDate(publishedStatus)
console.log('Publish date via helper:', publishDate)
console.log()

const draftPublishDate = getPublishedDate(draftStatus)
console.log('Draft publish date (should be null):', draftPublishDate)
console.log()

// ============================================================================
// Exemplo 4: Genéricos preservam tipos
// ============================================================================

console.log('=== Exemplo 4: Generics ===\n')

function getArticleType<T extends Article<'tutorial' | 'news'>>(article: T): T['type'] {
  return article.type
}

const tutorialType = getArticleType(tutorialArticle)
console.log('Tutorial type extracted:', tutorialType)

const newsType = getArticleType(newsArticle)
console.log('News type extracted:', newsType)
console.log()

// ============================================================================
// Exemplo 5: Type safety previne erros (COMENTADOS - não compilariam)
// ============================================================================

console.log('=== Exemplo 5: Type Safety (errors commented out) ===\n')

/*
// ❌ ERRO 1: Tutorial não pode ter 'source' (isso é de News)
const invalidTutorial: TutorialArticle = {
  id: createArticleId('123'),
  type: 'tutorial',
  metadata: {
    source: 'Reuters',  // ← ERRO! Property 'source' does not exist on type 'TutorialMetadata'
    difficulty: 'beginner',
    estimatedDuration: 30,
    prerequisites: [],
    learningOutcomes: [],
  },
  content: {
    introduction: '...',
    sections: [],
  },
}

// ❌ ERRO 2: Tipo incompatível
const mixedArticle: TutorialArticle = {
  id: createArticleId('123'),
  type: 'news',  // ← ERRO! Type '"news"' is not assignable to type '"tutorial"'
  metadata: {
    difficulty: 'beginner',
    estimatedDuration: 30,
    prerequisites: [],
    learningOutcomes: [],
  },
  content: {
    introduction: '...',
    sections: [],
  },
}

// ❌ ERRO 3: Branded types previnem mistura
function getArticle(id: ArticleId) {
  console.log('Getting article:', id)
}

const authorId = createAuthorId('author-789')
getArticle(authorId)  // ← ERRO! Argument of type 'AuthorId' is not assignable to parameter of type 'ArticleId'

// ❌ ERRO 4: Não pode acessar publishedAt em draft
if (draftStatus.status === 'draft') {
  console.log(draftStatus.publishedAt)  // ← ERRO! Property 'publishedAt' does not exist on type '{ status: "draft"; editableBy: AuthorId[]; }'
}
*/

console.log('Type safety examples are commented out (would cause compile errors)')
console.log()

// ============================================================================
// Exemplo 6: Array de artigos (união de tipos)
// ============================================================================

console.log('=== Exemplo 6: Array of Different Article Types ===\n')

const articles: ArticleByType[] = [tutorialArticle, newsArticle]

articles.forEach(article => {
  console.log(`Article ${article.id} is of type: ${article.type}`)
  // Type narrowing baseado em 'type'
  if (article.type === 'tutorial') {
    // TypeScript sabe que é TutorialArticle aqui
    console.log(`  Difficulty: ${article.metadata.difficulty}`)
    console.log(`  Duration: ${article.metadata.estimatedDuration} minutes`)
  } else if (article.type === 'news') {
    // TypeScript sabe que é NewsArticle aqui
    console.log(`  Source: ${article.metadata.source}`)
    console.log(`  Breaking: ${article.metadata.breaking}`)
  }
})
console.log()

// ============================================================================
// Final
// ============================================================================

console.log('=== 🎉 Dia 1 completo! ===\n')
console.log('Tipos funcionando perfeitamente:')
console.log('✅ ArticleType (union type)')
console.log('✅ Tagged IDs (branded types)')
console.log('✅ ArticleStatus (discriminated union)')
console.log('✅ ArticleMetadata (lookup map)')
console.log('✅ ArticleContent (lookup map)')
console.log('✅ Article<T> (generic type)')
console.log('✅ Type guards (isDraft, isPublished, etc)')
console.log('✅ Type narrowing (automático)')
console.log()
console.log('Zero runtime overhead - tudo em compile time! 🚀')