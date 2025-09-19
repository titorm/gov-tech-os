# turborepo-template

A Turborepo template for fullstack development with Vercel integration

## 🚀 Tech Stack

### Backend (API)
- **NestJS** + **Fastify** - High-performance Node.js framework
- **Drizzle ORM** + **PostgreSQL** - Type-safe relational database
- **MongoDB** + **Mongoose** - Document database for logs
- **Redis** - Caching with @nestjs/cache-manager
- **Socket.IO** - Real-time WebSocket communication
- **Helmet** - Security middleware
- **Throttler** - Rate limiting

### Frontend (Web)
- **React 18** + **TypeScript** - Modern UI framework
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Material Design 3** - Design system

### Mobile
- **React Native** + **Expo** - Cross-platform mobile
- **Expo Router** - File-based navigation
- **Material Design 3** - Consistent UI

### Deployment
- **Vercel** - Frontend deployment and CI/CD
- **Docker** - Containerization

## 📁 Project Structure

```
turborepo-template/
├── apps/
│   ├── api/          # NestJS backend (Fastify + Drizzle)
│   ├── web/          # React frontend (TanStack Router)
│   └── mobile/       # React Native + Expo
├── packages/
│   ├── ui/           # shadcn/ui + Material Design 3
│   ├── types/        # Shared TypeScript types
│   ├── utils/        # Shared utilities
│   └── config/       # Shared configurations
├── docs/             # Documentation
└── tools/            # Build tools and scripts
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 3. Start databases (Docker)
docker-compose -f docker-compose.dev.yml up -d

# 4. Push database schema
pnpm db:push --filter=api

# 5. Start development
pnpm dev
```

This will start:
- **API**: http://localhost:3001
- **Web**: http://localhost:3000
- **Mobile**: Expo DevTools

### Available Scripts

- `pnpm dev` - Start all apps
- `pnpm build` - Build for production
- `pnpm lint` - Lint all packages
- `pnpm type-check` - TypeScript validation
- `pnpm test` - Run tests
- `pnpm db:studio` - Open Drizzle Studio

## 🚀 Deployment

### Frontend (Vercel)
- Automatic deployments from main branch
- Environment variables configured in Vercel dashboard

### Backend
- Docker container ready
- Deploy to Railway, Render, or similar

## 📖 Documentation

- [API Documentation](./docs/api/README.md)
- [Database Schema](./docs/database/README.md)
- [UI Components](./docs/ui/README.md)
- [Deployment Guide](./docs/deployment/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
