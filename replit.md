# Renewable Energy Data Platform

## Overview

This is a full-stack web application for managing and visualizing renewable energy project data. The platform provides a comprehensive dashboard for tracking energy projects, their capacity, locations, and operational status. It features role-based authentication, data visualization, and CRUD operations for project management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom energy-themed color palette
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **API Design**: RESTful API with role-based access control
- **Middleware**: Custom authentication and admin authorization middleware

### Data Storage
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Defined in `shared/schema.ts` with automatic TypeScript type generation
- **Migrations**: Managed through Drizzle Kit

### Key Components

#### Database Schema
- **Users Table**: Stores user credentials, roles (admin/user), and profile information
- **Projects Table**: Contains renewable energy project data including capacity, location, status, and coordinates
- **Relationships**: User roles determine access permissions for project operations

#### Authentication System
- JWT token-based authentication
- Role-based access control (admin/user)
- Session management with local storage
- Protected routes and API endpoints

#### Data Visualization
- Chart.js integration for capacity trends and distribution charts
- Real-time statistics dashboard
- Project filtering and sorting capabilities
- Responsive data tables with pagination

#### Project Management
- CRUD operations for renewable energy projects
- Advanced filtering by energy type, status, location
- Search functionality across project data
- Admin-only project creation and deletion

## Data Flow

1. **Authentication Flow**:
   - User login credentials validated against database
   - JWT token generated and stored in localStorage
   - Token included in all API requests via Authorization header
   - Role-based UI elements shown/hidden based on user permissions

2. **Project Data Flow**:
   - Projects fetched from database with filtering/pagination
   - Data transformed for visualization components
   - Real-time updates through TanStack Query invalidation
   - Statistics calculated server-side and cached

3. **API Request Flow**:
   - Client requests include JWT token for authentication
   - Server middleware validates token and extracts user info
   - Database operations performed with proper authorization checks
   - Responses formatted and returned to client

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI components
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing
- **zod**: Runtime type validation

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production

### External APIs
- **NREL API**: National Renewable Energy Laboratory data integration
- **Chart.js**: Data visualization library loaded via CDN

## Deployment Strategy

### Build Process
- **Development**: `npm run dev` - runs TypeScript server with hot reload
- **Production Build**: `npm run build` - creates optimized client bundle and server bundle
- **Type Checking**: `npm run check` - validates TypeScript across entire project

### Database Management
- **Schema Deployment**: `npm run db:push` - applies schema changes to database
- **Environment Variables**: `DATABASE_URL` required for database connection
- **Migration Strategy**: Uses Drizzle Kit for schema versioning

### Production Deployment
- Static assets served from `dist/public`
- Server bundle runs from `dist/index.js`
- Environment variables for database connection and JWT secrets
- Supports both development and production environments

### Architecture Decisions

1. **Monorepo Structure**: Shared types and schema between client and server for type safety
2. **Memory Storage Fallback**: In-memory storage implementation for development/testing
3. **Role-Based Access**: Admin/user roles with different capabilities
4. **Client-Side Routing**: Wouter chosen for minimal bundle size
5. **Type Safety**: Full TypeScript coverage with shared schema validation
6. **Responsive Design**: Mobile-first approach with Tailwind CSS
7. **Error Handling**: Comprehensive error boundaries and toast notifications

The application follows modern web development best practices with a focus on type safety, performance, and maintainability.