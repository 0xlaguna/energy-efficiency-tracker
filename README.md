# Energy Efficiency Tracker

An application for tracking and analyzing building energy efficiency metrics. Built with FastAPI, Next.js, MongoDB, and Redis, featuring efficient calculations, data visualization, and performance analytics.

## 🚀 Features

### Core Functionality
- **Energy Efficiency Calculations** - Calculate savings, costs, and performance metrics
- **Building Management** - Track multiple buildings with detailed analytics
- **Period-based Analysis** - Support for business hours, weekends, peak/off-peak periods
- **Performance Grading** - A-F grading system based on efficiency improvements
- **Data Visualization** - Interactive charts and graphs for insights

### Advanced Features
- **Pagination** - Efficient handling of large datasets
- **Caching** - Redis-powered caching for improved performance
- **Authentication** - JWT-based secure API access
- **Responsive Design** - Mobile-first UI with Tailwind CSS
- **Type Safety** - Full TypeScript implementation
- **Form Validation** - Zod schema validation for data integrity

## 📸 Screenshots

### Buildings Management
![Buildings Overview](screenshots/Buildings.png)
*Main buildings table with search, pagination, and building management features*

### Calculation Form
![Add Calculation](screenshots/Add%20Calculation.png)
*Dynamic form for adding new energy efficiency calculations with multiple periods*

### Building Details - Summary
![Building Calculation Summary](screenshots/Building%20Calculation%20Summary.png)
*Building overview showing key performance metrics and efficiency summary*

### Building Details - Latest Calculation
![Building Latest Calculation](screenshots/Building%20Latest%20Calculation.png)
*Detailed view of the most recent calculation with period breakdown*

### Building Details - History
![Building Calculation History](screenshots/Building%20Calculation%20History.png)
*Historical view of all calculations for a specific building*

### Building Details - Charts
![Building Calculation Charts](screenshots/Building%20Calculation%20Charts.png)
*Data visualization showing efficiency improvements and cost savings*

## 🏗️ Architecture

### Backend (FastAPI)
```
backend/
├── app/
│   ├── api/                    # API routes and middleware
│   │   ├── routes/
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── users/         # User management
│   │   │   └── efficiency/    # Efficiency calculations
│   │   └── middleware/        # Auth middleware
│   ├── application/           # Business logic layer
│   │   └── services/         # Service implementations
│   ├── domain/               # Domain entities and ports
│   │   ├── entities/         # Pydantic models
│   │   └── ports/            # Repository interfaces
│   └── infrastructure/       # External integrations
│       ├── repositories/     # MongoDB implementations
│       ├── services/         # External services
│       └── database.py       # Database configuration
```

### Frontend (Next.js)
```
frontend/
├── app/                      # Next.js app router
│   ├── dashboard/            # Main dashboard pages
│   └── auth/               # Authentication pages
├── components/               # Reusable UI components
│   ├── efficiency/          # Efficiency-specific components
│   └── ui/                  # Base UI components (Shadcn)
├── hooks/                   # Custom React hooks
│   └── data/               # Data fetching hooks
├── lib/                     # Utility functions
└── types/                   # TypeScript definitions
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for Python APIs
- **MongoDB** - NoSQL database for flexible data storage
- **Redis** - In-memory caching for performance optimization
- **Pydantic** - Data validation and serialization
- **JWT** - JSON Web Tokens for authentication
- **Python 3.13+** - Latest Python features and performance

### Frontend
- **Next.js 15** - React framework with app router
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - High-quality component library
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation
- **Recharts** - Data visualization library

### Infrastructure
- **Docker** - Containerization for consistent deployments
- **Docker Compose** - Multi-service orchestration
- **MongoDB 8.0** - Latest MongoDB with health checks
- **Redis 8.0** - High-performance caching layer

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 22 (for local development)
- Python 3.13+ (for local development)
- uv (Python package manager) - [Install uv](https://docs.astral.sh/uv/getting-started/installation/)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd energy-efficiency-tracker
   ```

2. **Start all services**
   ```bash
   ./scripts/dev.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development

#### Backend Setup
```bash
cd backend
uv venv
source .venv/bin/activate
uv sync
cd app
fastapi run main.py
```

**Note:** If you don't have `uv` installed, install it first:
```bash
# Install uv (recommended method)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or using pip
pip install uv
```

#### Frontend Setup
```bash
cd frontend
pnpm install
pnpm run dev
```

## 📊 Performance Optimizations

### Backend Optimizations
- **MongoDB Aggregation Pipelines** - Server-side data processing
- **Redis Caching** - Distributed caching with TTL
- **Database Indexing** - Compound and partial indexes for fast queries
- **Connection Pooling** - Efficient database connections
- **uv Package Manager** - Fast Python dependency management

### Frontend Optimizations
- **React Query Caching** - Intelligent data caching and invalidation
- **Code Splitting** - Dynamic imports for smaller bundles
- **Image Optimization** - Next.js automatic image optimization
- **Lazy Loading** - Components loaded on demand
- **Memoization** - React.memo for expensive components

### Database Optimizations
```javascript
// Compound indexes for common queries
db.efficiency_calculations.createIndex([
  { "building_id": 1, "created_at": -1 }
])

// Partial indexes for high-performance calculations
db.efficiency_calculations.createIndex(
  { "building_id": 1, "summary.performance_grade": 1 },
  { partialFilterExpression: { "summary.performance_grade": { $in: ["A", "B"] } } }
)
```

## 🔧 Configuration

### Environment Variables (running the script ./scripts/dev.sh pretty much runs everything)

#### Backend
```bash
MONGODB_URL=mongodb://localhost:27017
REDIS_URL=redis://localhost:6379/0
API_DEBUG=true
JWT_SECRET_KEY=your-secret-key
```

#### Frontend
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

### Docker Configuration
- **Health Checks** - Automatic service health monitoring
- **Volume Persistence** - Data persistence across container restarts
- **Network Isolation** - Secure inter-service communication
- **Resource Limits** - Optimized resource allocation

## 📈 API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Efficiency Calculations
- `POST /api/efficiency/calculate` - Calculate efficiency metrics
- `GET /api/efficiency/building/{id}` - Get building calculations
- `GET /api/efficiency/building/{id}/summary` - Get building summary
- `GET /api/efficiency/buildings` - Get all buildings (paginated)

### Health Check
- `GET /api/health` - Service health status

## 🎨 UI Components

### Dashboard Features
- **Buildings Table** - Paginated list with search and filtering
- **Efficiency Form** - Dynamic form with period management
- **Building Details** - Comprehensive building analytics
- **Data Visualization** - Interactive charts and graphs
- **Performance Metrics** - Real-time KPI dashboard

### Form Features
- **Dynamic Periods** - Add/remove operational periods
- **Validation** - Real-time form validation with Zod
- **Auto-save** - Form state persistence
- **Error Handling** - User-friendly error messages

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Comprehensive data validation
- **CORS Configuration** - Cross-origin request security
- **Rate Limiting** - API request rate limiting
- **Data Sanitization** - XSS and injection protection

## 📊 Monitoring & Logging

### Structured Logging
- **Structured Logs** - JSON-formatted logs with context
- **Request Tracing** - End-to-end request tracking
- **Error Monitoring** - Comprehensive error tracking
- **Performance Metrics** - Response time monitoring

### Health Monitoring
- **Database Health** - MongoDB connection monitoring
- **Cache Health** - Redis connection monitoring
- **Service Health** - API endpoint health checks
- **Dependency Health** - External service monitoring


**Built by Maykol Laguna**
