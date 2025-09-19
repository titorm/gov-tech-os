# turborepo-template Documentation

Welcome to the comprehensive documentation for turborepo-template, a modern full-stack application built with the latest technologies.

## 📚 Documentation Structure

### API Documentation
- [API Overview](./api/README.md) - Complete API documentation
- [Authentication](./api/authentication.md) - JWT authentication system
- [Endpoints](./api/endpoints.md) - All REST API endpoints
- [WebSocket](./api/websocket.md) - Real-time communication
- [Rate Limiting](./api/rate-limiting.md) - API rate limiting configuration

### Database Documentation
- [Database Overview](./database/README.md) - Database architecture
- [PostgreSQL Schema](./database/postgres.md) - Drizzle ORM schemas
- [MongoDB Collections](./database/mongodb.md) - Document database structure
- [Redis Configuration](./database/redis.md) - Caching setup
- [Migrations](./database/migrations.md) - Database migration guide

### UI Documentation
- [UI Components](./ui/README.md) - Component library overview
- [Material Design 3](./ui/material-design.md) - Design system implementation
- [shadcn/ui Integration](./ui/shadcn.md) - Component usage guide
- [Theme Configuration](./ui/theming.md) - Customization guide
- [Icons](./ui/icons.md) - Material Symbols usage

### Development Documentation
- [Getting Started](./development/README.md) - Quick start guide
- [Project Structure](./development/structure.md) - Codebase organization
- [Development Workflow](./development/workflow.md) - Best practices
- [Testing](./development/testing.md) - Testing strategies
- [Troubleshooting](./development/troubleshooting.md) - Common issues

### Deployment Documentation
- [Deployment Overview](./deployment/README.md) - Deployment strategies
- [Docker Setup](./deployment/docker.md) - Containerization
- [Vercel Deployment](./deployment/vercel.md) - Frontend deployment
- [Environment Variables](./deployment/environment.md) - Configuration
- [CI/CD Pipeline](./deployment/ci-cd.md) - Automated deployment

## 🚀 Quick Links

- **Local Development**: [Getting Started Guide](./development/README.md)
- **API Reference**: [Complete API Documentation](./api/README.md)
- **Component Library**: [UI Components Guide](./ui/README.md)
- **Database Setup**: [Database Documentation](./database/README.md)
- **Deployment**: [Production Deployment Guide](./deployment/README.md)

## 📋 Technology Stack

### Backend
- **NestJS** - Node.js framework with TypeScript
- **Fastify** - High-performance HTTP server
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Primary relational database
- **MongoDB** - Document database for logs
- **Redis** - Caching and session storage
- **Socket.IO** - Real-time WebSocket communication

### Frontend
- **React 18** - UI library with hooks and concurrent features
- **TanStack Router** - Type-safe client-side routing
- **TanStack Query** - Server state management
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **Material Design 3** - Modern design system

### Mobile
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **Expo Router** - File-based navigation
- **React Native Paper** - Material Design 3 components

### DevOps & Tooling
- **Turborepo** - Monorepo build system
- **Docker** - Containerization platform
- **GitHub Actions** - CI/CD automation
- **Vercel** - Frontend deployment platform
- **ESLint & Prettier** - Code quality and formatting
- **TypeScript** - Type safety across the stack

## 🎯 Getting Started

1. **Prerequisites**: Ensure you have Node.js 18+, pnpm 8+, and Docker installed
2. **Clone Repository**: `git clone <repository-url>`
3. **Install Dependencies**: `pnpm install`
4. **Setup Environment**: Copy `.env.example` to `.env` and configure
5. **Start Databases**: `docker-compose -f docker-compose.dev.yml up -d`
6. **Run Migrations**: `pnpm db:push --filter=api`
7. **Start Development**: `pnpm dev`

For detailed setup instructions, see the [Development Guide](./development/README.md).

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and follow our development workflow:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run `pnpm lint` and `pnpm test`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

## 🆘 Support

If you need help or have questions:

- Check the [Troubleshooting Guide](./development/troubleshooting.md)
- Review the [FAQ](./development/faq.md)
- Open an issue on GitHub
- Contact the development team

---

**Last Updated**: turborepo-template Documentation v1.0.0
