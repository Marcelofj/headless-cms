# Headless CMS – Type-Driven Content Management System

> A production-ready headless CMS built with TypeScript, focusing on type safety, clean architecture, and extensibility.

---

## 📖 Overview

This is a **complete headless CMS** built from the ground up using **type-driven design** principles. The system provides a robust backend API for managing content (articles, authors, media, taxonomies) with full support for:

### Core Features

- ✅ **Editorial workflows** – Complete state machine: draft → review → publish → archive
- ✅ **Role-based access control** – Four roles: writer, editor, publisher, admin
- ✅ **Content versioning** – Automatic snapshots, rollback capability, full audit trail
- ✅ **Media management** – Images and videos with metadata extraction
- ✅ **Advanced search** – Full-text search, filters, pagination
- ✅ **JWT authentication** – Access + refresh tokens, stateless
- ✅ **Observability** – Structured logging, metrics, correlation IDs

### Why "Headless"?

The backend exposes **only a REST API**. There's no coupled frontend, no templates, no server-side rendering. 

**Any client can consume the API:**
- 🌐 Web (React, Vue, Next.js)
- 📱 Mobile (iOS, Android)
- 📺 Smart TVs
- 🎮 Game consoles
- 🤖 IoT devices

---

## 🎯 Project Goals

This project is a **study program** designed to teach:

### Learning Objectives

1. **Type-driven design** 
   - Let TypeScript prevent bugs at compile time
   - Make illegal states unrepresentable
   - Use types as design tools

2. **Clean Architecture**
   - Domain / Application / Infrastructure separation
   - Dependency inversion
   - Testable, maintainable code

3. **Real-world patterns**
   - Repository pattern
   - Service layer
   - Domain policies
   - Value objects

4. **Production practices**
   - Authentication & authorization
   - Content versioning
   - Observability (logging, metrics)
   - Error handling

5. **API design**
   - RESTful endpoints
   - DTOs and validation
   - HTTP semantics
   - Error responses

### Target Audience

**Intermediate to advanced TypeScript developers** who want to build serious backend systems with proper architecture and type safety.

---

## 🏗️ Architecture

### Clean Architecture (Uncle Bob)

Seguimos as 4 camadas concêntricas da Clean Architecture:

```
┌─────────────────────────────────────────┐
│   Frameworks & Drivers (Camada 4)      │  ← Express, Postgres, S3
└─────────────────────────────────────────┘
              ↓ depende
┌─────────────────────────────────────────┐
│   Interface Adapters (Camada 3)        │  ← Controllers, Repositories
│   Infrastructure/API, Infrastructure/   │     (HTTP → App, App → DB)
│   Persistence, Infrastructure/Storage   │
└─────────────────────────────────────────┘
              ↓ depende
┌─────────────────────────────────────────┐
│  Application Business Rules (Camada 2) │  ← Services, Use Cases
│         content/application/            │
└─────────────────────────────────────────┘
              ↓ depende
┌─────────────────────────────────────────┐
│ Enterprise Business Rules (Camada 1)   │  ← Entities, Types, Policies
│           content/domain/               │     (NÚCLEO PURO)
└─────────────────────────────────────────┘
```

### Key Principles

- **Domain is pure** – Zero dependencies, no frameworks
- **Application defines ports** – Infrastructure implements them
- **HTTP is infrastructure** – Controllers adapt HTTP to Application
- **Type-driven** – Lookup maps, discriminated unions, exhaustive type checking
- **No `any`** – 100% type safety
- **Composition root** – Only `main.ts` wires everything together
- **Dependency Rule** – Source code dependencies point only inward

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (ESM support)
- **PostgreSQL** 16+
- **pnpm** (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/headless-cms.git
cd headless-cms

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
pnpm migrate

# Start development server
pnpm dev
```

The API will be available at `http://localhost:3000`.

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** – Deep dive into design decisions, types, and patterns
- **[CONTENT.md](./CONTENT.md)** – Complete 14-day study program (day-by-day guide)
- **[API.md](./API.md)** – API documentation (endpoints, examples, authentication)

---

## 🧩 Core Concepts

### 1. Type-Driven Design

Everything is typed. **No runtime validation needed** because types prevent invalid states:

```typescript
// Article status is a discriminated union
type ArticleStatus =
  | { status: 'draft'; editableBy: AuthorId[] }
  | { status: 'reviewing'; reviewer: AuthorId; submittedAt: Date }
  | { status: 'published'; publishedAt: Date; url: string }
  | { status: 'archived'; archivedAt: Date; reason: string }

// ✅ Impossible to have publishedAt on a draft at compile time!
// ✅ TypeScript forces you to check status before accessing fields
function getPublishDate(status: ArticleStatus): Date | null {
  if (status.status === 'published') {
    return status.publishedAt  // ← TS knows this exists!
  }
  return null
}
```

---

### 2. Content Types with Lookup Maps

Different article types have **different metadata and content structures**:

```typescript
type ContentType = 'news' | 'opinion' | 'tutorial' | 'review'

// Lookup maps define structure per type
type ArticleMetadata = {
  'news': { 
    source: string
    location?: string 
  }
  'opinion': { 
    authorBio: string
    stance: 'for' | 'against' | 'neutral'
  }
  'tutorial': { 
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    duration: number  // minutes
  }
  'review': { 
    rating: number
    productUrl?: string
  }
}

// Usage (fully type-safe):
type ArticleEntity<T extends ContentType> = {
  type: T
  metadata: ArticleMetadata[T]  // ← Automatically correct type!
  content: ArticleContent[T]
}

// Example:
const tutorial: ArticleEntity<'tutorial'> = {
  type: 'tutorial',
  metadata: {
    difficulty: 'intermediate',  // ✅ Type-safe
    duration: 30
    // rating: 5  ← ❌ TypeScript error! Not allowed for tutorials
  },
  // ...
}
```

---

### 3. Editorial Workflows

Articles transition through states with **proper authorization checks**:

```
┌─────────┐                                                      
│  draft  │ ◄──────────────────────────────────────┐            
└─────────┘                                         │            
     │                                              │            
     │ submitForReview() [author or editor]       │            
     ↓                                              │            
┌──────────────┐                                   │            
│ reviewing │                                   │            
└──────────────┘                                   │            
     │                                              │            
     ├─→ approveReview() [publisher+]             │            
     │         ↓                                    │            
     │   ┌─────────────┐                          │            
     │   │  published  │                          │            
     │   └─────────────┘                          │            
     │         │                                    │            
     │         │ archive() [editor+]               │            
     │         ↓                                    │            
     │   ┌──────────┐      restore() [admin]      │            
     │   │ archived │ ─────────────────────────────┘            
     │   └──────────┘                                           
     │                                                           
     └─→ rejectReview() [editor]                               
            ↓                                                    
      (back to draft)                                           
```

Each transition **requires specific permissions** (enforced by policies).

---

### 4. Versioning

Every content change creates an **immutable snapshot**:

```typescript
type ArticleVersionEntity<T extends ContentType> = {
  id: string
  articleId: string
  version: number
  snapshot: ArticleEntity<T>  // ← Complete state at that moment
  changedBy: AuthorId
  createdAt: Date
}

// Example history:
// v1: Initial draft
// v2: Added introduction section
// v3: Fixed typos
// v4: Published (snapshot of published state)
// v5: Updated statistics
```

**Rollback** = restore snapshot + create new version (no data loss).

---

### 5. Role-Based Access Control

```typescript
type AuthorRole = 'writer' | 'editor' | 'publisher' | 'admin'

type Permission =
  | 'article:create'
  | 'article:edit:own'      // Edit your own articles
  | 'article:edit:any'      // Edit anyone's articles
  | 'article:publish'
  | 'article:delete'
  | 'author:manage'

// Role → Permission mapping:
// writer:    create, edit:own
// editor:    + edit:any, approve reviews
// publisher: + publish
// admin:     all permissions
```

**Policies check permissions before operations:**

```typescript
function canPublish(author: AuthorEntity, article: ArticleEntity): boolean {
  return author.permissions.includes('article:publish')
}

// Used in service:
async publishArticle(articleId: string, publisherId: string) {
  const author = await authorRepo.findById(publisherId)
  const article = await articleRepo.findById(articleId)
  
  if (!canPublish(author, article)) {
    throw new UnauthorizedError('Cannot publish article')
  }
  
  // ... proceed with publish
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Language** | TypeScript 5.3+ (strict mode, ESM) |
| **Runtime** | Node.js 20+ |
| **HTTP** | Express (or Fastify) |
| **Database** | PostgreSQL 16+ |
| **ORM** | Drizzle (or Prisma) |
| **Validation** | Zod |
| **Auth** | JWT (jsonwebtoken) |
| **Logging** | Pino (structured JSON logs) |
| **Testing** | Vitest |
| **Containerization** | Docker + docker-compose |

---

## 📡 API Examples

### Authentication

```bash
# Register a new author
POST /api/auth/register
{
  "email": "jane@example.com",
  "name": "Jane Doe",
  "password": "secure123",
  "role": "writer"
}

# Login
POST /api/auth/login
{
  "email": "jane@example.com",
  "password": "secure123"
}
# Response: { "accessToken": "...", "refreshToken": "..." }
```

### Articles

```bash
# Create article (requires auth)
POST /api/articles
Authorization: Bearer <token>
{
  "type": "tutorial",
  "title": "Introduction to TypeScript",
  "content": { /* tutorial-specific structure */ },
  "categoryIds": ["cat-123"],
  "tagIds": ["tag-456", "tag-789"]
}

# Get article by slug
GET /api/articles/introduction-to-typescript

# Search articles
GET /api/articles?q=typescript&category=programming&status=published&sort=-publishedAt&limit=20

# Publish article (requires publisher role)
POST /api/articles/:id/publish
Authorization: Bearer <token>
```

### Media

```bash
# Upload image
POST /api/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Response:
{
  "id": "media-123",
  "url": "https://cdn.example.com/images/photo.jpg",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "size": 245678
  }
}
```

See **[API.md](./API.md)** for complete documentation.

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test:unit          # Domain logic (fast)
pnpm test:integration   # Services + repositories (needs DB)
pnpm test:e2e           # API endpoints (full stack)

# Coverage report
pnpm test:coverage
```

**Test structure:**

```
tests/
├── unit/          ← Value objects, policies, pure functions
├── integration/   ← Services, repositories (test DB)
└── e2e/           ← API endpoints (full HTTP requests)
```

---

## 🐳 Docker

```bash
# Development with hot reload
docker-compose up dev

# Production build
docker-compose up prod

# Run migrations
docker-compose run api pnpm migrate
```

**Services:**

- `api` – Node.js application
- `postgres` – Database
- `redis` (optional) – Caching/sessions

---

## 📁 Project Structure

```
src/
├── content/
│   ├── domain/              ← Camada 1: Enterprise Business Rules
│   │   ├── entities/        ← Entities puras
│   │   ├── types/           ← Types e contratos
│   │   ├── value-objects/   ← Value objects
│   │   └── policies/        ← Regras de negócio
│   │
│   ├── application/         ← Camada 2: Application Business Rules
│   │   ├── services/        ← Use cases
│   │   ├── queries/         ← Query builders
│   │   └── ports/           ← Interfaces para Infrastructure
│   │
│   └── infrastructure/      ← Camadas 3 + 4: Adapters & Drivers
│       ├── api/             ← HTTP adapters (Controllers, Routes)
│       ├── persistence/     ← Database adapters (Repositories)
│       ├── storage/         ← Storage adapters (S3, Local)
│       └── observability/   ← Logging, Metrics
│
└── main.ts                  ← Composition root (DI)
```

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for detailed breakdown.

---

## 🎓 Learning Path

This project is designed as a **14-day study program**. Follow **[CONTENT.md](./CONTENT.md)** for:

- Day 1: Architecture & types
- Day 2: Article entity
- Day 3: Authors & permissions
- Day 4: Taxonomies
- Day 5: Versioning
- Day 6: Repositories
- Day 7: Application services
- Day 8: Media management
- Day 9: REST API
- Day 10: Authentication
- Day 11: Search & queries
- Day 12: PostgreSQL
- Day 13: Observability
- Day 14: Tests & deploy

Each day builds on the previous one, introducing new concepts progressively.

---

## 🚧 Roadmap

### ✅ Completed (Core System)

- Type-driven domain model
- Editorial workflows
- RBAC (role-based access control)
- Content versioning
- Media management
- REST API
- JWT authentication
- PostgreSQL persistence
- Structured logging
- Test suite

### 🔜 Future Extensions

- [ ] **GraphQL API** (alternative to REST)
- [ ] **Webhooks** (notify external systems on events)
- [ ] **Comment system** (with moderation)
- [ ] **Multi-language support** (i18n)
- [ ] **Real-time collaboration** (WebSockets)
- [ ] **Advanced SEO** (automation, schema.org)
- [ ] **Email notifications** (workflow triggers)
- [ ] **Analytics** (track views, engagement)
- [ ] **CDN integration** (Cloudinary, S3)
- [ ] **Admin UI** (React/Vue dashboard)

---

## 🤝 Contributing

This is a learning project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the existing architecture patterns
4. Write tests
5. Submit a pull request

**Guidelines:**

- Follow type-driven design principles
- No `any` types
- Update documentation
- Add tests for new features

---

## 📄 License

MIT License – See [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

This project is inspired by:

- **Domain-Driven Design** (Eric Evans)
- **Clean Architecture** (Robert C. Martin)
- **Type-Driven Development** (Edwin Brady)
- Real-world production CMS systems (Contentful, Strapi, Sanity)

---

## 📞 Contact

**Questions?** Open an issue or discussion on GitHub.

**Learning together?** Share your progress and learnings!

---

**Happy coding!** 🚀

> Remember: Types are not just for catching bugs – they're design tools that make illegal states unrepresentable.
