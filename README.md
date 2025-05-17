<div align="center">
  <h1>Nexus Core Platform</h1>
  <p>
    <strong>Unified Mobility Management Platform</strong>
  </p>
  <p>
    <a href="https://github.com/nexus-org/nexus-core/actions/workflows/ci-cd.yml">
      <img src="https://github.com/nexus-org/nexus-core/actions/workflows/ci-cd.yml/badge.svg" alt="CI/CD Status" />
    </a>
    <a href="https://codecov.io/gh/nexus-org/nexus-core">
      <img src="https://codecov.io/gh/nexus-org/nexus-core/branch/main/graph/badge.svg" alt="Code Coverage" />
    </a>
    <a href="https://github.com/nexus-org/nexus-core/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/nexus-org/nexus-core" alt="License" />
    </a>
    <a href="https://github.com/nexus-org/nexus-core">
      <img src="https://img.shields.io/github/stars/nexus-org/nexus-core?style=social" alt="GitHub Stars" />
    </a>
  </p>
</div>

## 🚀 Overview

Nexus Core is a unified mobility management platform that provides a central infrastructure for various mobility services including:

- 🚗 Vehicle sharing (Carshare)
- 🤖 Autonomous vehicles (Robotaxi)
- 🚚 Fleet management
- 🔧 Maintenance scheduling
- 👥 User management
- 📅 Booking and reservations
- 🎨 White-label theming
- 🧠 AI/ML predictive capabilities
- 🔌 OEM integrations
- ⚡ Edge computing framework

## 🏗️ Architecture

The Nexus Core Platform uses a modern, modular architecture with a monorepo structure:

```
nexus-core/
  .github/               # GitHub workflows and issue templates
  .husky/                # Git hooks
  .vscode/               # VS Code settings
  apps/                  # Application packages
    web/                 # Main web application (Next.js)
    admin/              # Admin dashboard (Next.js)
    api/                # API server (Node.js/Express)
    
  packages/             # Shared packages
    auth/                # Authentication and security services
    api-client/          # Type-safe API client
    ui-components/       # Reusable UI components
    theme/               # Design system and theming
    types/               # Shared TypeScript types
    utils/               # Utility functions
    config/             # Shared configurations
    
  prisma/              # Database schema and migrations
  public/               # Static assets
  scripts/              # Utility scripts
  .env.example          # Environment variables template
  package.json          # Project configuration
  tsconfig.json         # TypeScript configuration
  .eslintrc.js          # ESLint configuration
  .prettierrc.js        # Prettier configuration
  jest.config.js        # Jest configuration
  next.config.js        # Next.js configuration
  turbo.json           # Turborepo configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later (or pnpm/yarn)
- PostgreSQL 14+ (or Docker)
- Redis (for caching and queues)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/nexus-org/nexus-core.git
   cd nexus-core
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   # Start PostgreSQL and Redis (using Docker)
   docker-compose up -d postgres redis
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   # Start the Next.js development server
   npm run dev
   
   # Or start in development mode with hot reloading
   npm run dev:js
   ```

6. **Open your browser**
   The application will be available at [http://localhost:3000](http://localhost:3000)

## 🛠 Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm test` - Run tests
- `npm run lint` - Lint the codebase
- `npm run format` - Format the codebase
- `npm run type-check` - Run TypeScript type checking
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed the database
- `npm run setup` - Run the setup wizard

### Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_NAME="Nexus Core"
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nexus_core?schema=public"

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (optional)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@nexus-core.example.com
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e
```

## 🚀 Deployment

### Prerequisites

- Vercel account (for frontend)
- AWS/GCP/Azure account (for infrastructure)
- Docker and Docker Compose
- Kubernetes (for production)

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set up production environment variables**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

3. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

4. **Set up CI/CD**
   The repository includes GitHub Actions workflows for automated testing and deployment.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue or join our [Discord community](https://discord.gg/nexus-core).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- And all our amazing contributors! 🎉

## Implementation Status

The platform is being implemented in phases:

### Phase 1: Core Infrastructure ✅
- Authentication and user management
- API gateway architecture
- Core database models

### Phase 2: Shared Services ✅
- Fleet management service
- Booking and reservation system
- Payment processing service
- Maintenance scheduling system

### Phase 3: Vertical Applications ✅
- White-label theming system
- Shared UI component library
- Vertical-specific extensions
- API integration across all verticals
- AI/ML predictive engine
- OEM Integration layer
- Real-time analytics dashboard
- Edge computing framework

## Packages

### Auth Package

The Auth package provides a unified authentication system for all Nexus applications:

- JWT-based authentication
- Multi-factor authentication support
- Role-based access control
- Security middleware for Next.js applications

### API Client Package

The API client package provides a standardized way to communicate with backend APIs:

- Type-safe API client
- Support for authentication tokens
- Request and response interceptors
- Error handling
- Specialized clients for vehicle, booking, and other services

### UI Components Package

The UI Components package provides shared React components:

- Common UI elements (buttons, cards, inputs)
- Theme-aware components
- Vehicle-specific components (vehicle cards, maps)
- Form components with validation

### Theme Config Package

The Theme Config package provides a white-label theming system:

- Theme schema definition
- Default themes for different verticals
- Theme utilities
- Tailwind integration

### Predictive Engine Package

The Predictive Engine package provides AI/ML capabilities:

- Demand forecasting models
- Maintenance prediction algorithms
- Dynamic pricing optimization
- Route optimization
- TensorFlow.js integration

### OEM Integration Package

The OEM Integration package provides vehicle manufacturer integrations:

- Common interface for all vehicle manufacturers
- Adapter pattern for each OEM
- Vehicle telemetry access
- Remote vehicle commands
- Diagnostic data retrieval

### Analytics Dashboard Package

The Analytics Dashboard package provides data visualization:

- Real-time fleet monitoring
- Usage and revenue charts
- Demand heatmaps
- Maintenance predictions
- KPI tracking components

### Edge Framework Package

The Edge Framework package enables offline-first capabilities:

- Data synchronization
- Offline storage with IndexedDB
- Conflict resolution
- Background sync with service workers
- Network status monitoring

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Build packages:

```bash
npm run build
```

3. Run the dev server:

```bash
npm run dev
```

## Development Workflow

1. Work on shared packages in the `packages/` directory
2. Use the packages in the applications in the `apps/` directory
3. Run tests for all packages:

```bash
npm run test
```

## Deployment Guide

### Railway Deployment

Railway is a platform that provides an easy way to deploy your Next.js application.

#### Prerequisites

1. A Railway account
2. The Railway CLI installed on your machine

#### Steps to Deploy

1. Log in to Railway from your terminal:
   ```bash
   railway login
   ```

2. Create a new project:
   ```bash
   railway init
   ```

3. Deploy your application:
   ```bash
   railway up
   ```

4. Set up environment variables in the Railway dashboard:
   - `NODE_ENV` = production
   - `NEXT_TELEMETRY_DISABLED` = 1
   - `NEXTAUTH_URL` = your-railway-url (e.g., https://lattis-nexus-production.up.railway.app)
   - `NEXTAUTH_SECRET` = your-secret-key

### Docker Deployment

You can also deploy the application using Docker.

#### Prerequisites

1. Docker installed on your machine
2. Docker Compose installed (optional, for local development)

#### Build and Run Locally

```bash
# Build the Docker image
docker build -t lattis-nexus .

# Run the container
docker run -p 3000:3000 -e NEXTAUTH_URL=http://localhost:3000 -e NEXTAUTH_SECRET=your-secret-key lattis-nexus
```

#### Using Docker Compose

For local development with Docker Compose:

```bash
docker-compose up
```

## API Documentation

API documentation is available at `/api/docs` when running the development server.

## License

Copyright (c) 2025 Lattis Inc. All rights reserved. 