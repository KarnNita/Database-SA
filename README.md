# Medical Management System API

A comprehensive RESTful API for managing medical facilities, built with [Elysia](https://elysiajs.com/) framework and Bun runtime. This system provides complete management capabilities for patients, staff, medical records, equipment, and financial operations.

## 🏥 Features

### Core Modules
- **👥 Patient Management** - Patient registration, appointment scheduling, course tracking
- **👨‍⚕️ Staff Management** - Staff registration, role-based access, authentication
- **📋 Medical Records** - Treatment records, doctor-patient appointments, medical history
- **🏥 Equipment Management** - Medical equipment inventory, stock tracking
- **💰 Financial Records** - Income/expense tracking, treatment costs, billing
- **📋 Requisitions** - Equipment usage requests and approval workflow
- **📦 Stock Management** - Equipment stock-in records, inventory control
- **💊 Treatment Types** - Treatment categories and pricing management

### Technical Features
- **📚 API Documentation** - Interactive Swagger/OpenAPI documentation
- **🐳 Docker Support** - Containerized deployment with docker-compose
- **🔒 Authentication** - Staff login system with role-based access
- **🗄️ Database Migrations** - Prisma-powered PostgreSQL database management
- **⚡ High Performance** - Built on Bun runtime for exceptional speed
- **🌐 CORS Support** - Cross-origin resource sharing enabled

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (v1.1.33 or higher)
- [Docker](https://docker.com/) and Docker Compose (for containerized deployment)
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Database-SA
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/medical_db"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   bunx prisma generate
   
   # Run migrations
   bunx prisma migrate deploy
   
   # Or sync database schema
   bunx prisma db push
   ```

5. **Start Development Server**
   ```bash
   bun run dev
   ```

The API will be available at `http://localhost:3000`

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build
```bash
# Build image
docker build -t medical-api .

# Run container
docker run -p 3000:3000 -e DATABASE_URL="your_db_url" medical-api
```

## 📖 API Documentation

Interactive API documentation is available at: `http://localhost:3000/docs`

### Main Endpoints

#### 👥 Patient Management (`/patient`)
- `GET /patient/getPatientList` - List all patients
- `GET /patient/searchbyID/:patient_id` - Get patient by ID
- `GET /patient/searchbyName/:name_surname` - Search patients by name
- `GET /patient/searchbyAppointmentDate/:appointment_date` - Find patients by appointment date
- `POST /patient/addPatient` - Register new patient
- `POST /patient/editPatient` - Update patient information
- `POST /patient/editAppoinmentDate` - Update appointment date
- `POST /patient/countByDate` - Count patients by appointment date

#### 👨‍⚕️ Staff Management (`/staff`)
- `GET /staff/getStaffList` - List all staff members
- `GET /staff/searchbyID/:staff_id` - Get staff by ID
- `GET /staff/searchbyName/:staff_name` - Search staff by name
- `GET /staff/searchbyUsername/:username` - Search staff by username
- `GET /staff/login/:username/:password` - Staff authentication
- `POST /staff/addStaff` - Register new staff member
- `POST /staff/editStaff` - Update staff information

#### 📋 Medical Records (`/medicalrecords`)
- Medical appointment management
- Treatment cost tracking
- Doctor-patient relationship records

#### 🏥 Equipment Management (`/equipment`)
- Equipment inventory management
- Price and quantity tracking

#### 💰 Financial Records (`/financialrecords`)
- Income and expense tracking
- Staff-based financial operations

#### 📋 Requisitions (`/requisition`)
- Equipment usage requests
- Approval workflow management

#### 📦 Stock Management (`/stockinrecord`)
- Equipment stock-in tracking
- Inventory updates

#### 💊 Treatment Types (`/treatmenttype`)
- Treatment category management
- Pricing configuration

## 🗄️ Database Schema

The system uses PostgreSQL with Prisma ORM. Key entities include:

- **Patient** - Patient information, appointments, course tracking
- **Staff** - Staff members with roles (Doctor, Staff, etc.)
- **MedicalRecords** - Treatment records linking patients, staff, and treatments
- **Equipment** - Medical equipment inventory
- **FinancialRecords** - Financial transactions and tracking
- **Requisition** - Equipment usage requests
- **StockInRecord** - Equipment stock-in history
- **TreatmentType** - Treatment categories and pricing

### Database Relationships
- Patients have multiple medical records
- Staff can be doctors or administrative staff
- Medical records link patients, doctors, staff, and treatments
- Equipment tracking through requisitions and stock records
- Financial records tied to staff operations

## 🛠️ Development

### Project Structure
```
Database-SA/
├── src/
│   ├── index.ts          # Main application entry point
│   ├── auth.ts           # Authentication middleware
│   ├── cors.ts           # CORS configuration
│   ├── db.ts             # Database connection
│   ├── patient.ts        # Patient management routes
│   ├── staff.ts          # Staff management routes
│   ├── medicalRecords.ts # Medical records routes
│   ├── equipment.ts      # Equipment management routes
│   ├── financialRecords.ts # Financial tracking routes
│   ├── requisition.ts    # Requisition management routes
│   ├── stockInRecord.ts  # Stock management routes
│   └── treatmentType.ts  # Treatment type routes
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── docker-compose.yml    # Docker configuration
├── Dockerfile           # Container build instructions
└── package.json         # Dependencies and scripts
```

### Available Scripts
- `bun run dev` - Start development server with hot reload
- `bunx prisma generate` - Generate Prisma client
- `bunx prisma migrate dev` - Run database migrations
- `bunx prisma studio` - Open Prisma Studio (database GUI)

### Adding New Features
1. Create new route files in `src/`
2. Add database models to `prisma/schema.prisma`
3. Import and register routes in `src/index.ts`
4. Update Swagger documentation tags
5. Run migrations: `bunx prisma migrate dev`

## ⚡ Performance

Built on Bun runtime for exceptional performance:
- Fast startup times
- Low memory usage
- High throughput API responses
- Efficient database queries with Prisma

## 🔒 Security Features

- Input validation with Elysia's type system
- Parameterized database queries preventing SQL injection
- Role-based access control for staff
- CORS configuration for cross-origin requests

## 🧪 Testing

```bash
# Run tests (when implemented)
bun test

# Database testing
bunx prisma studio
```

## 📊 Monitoring

The API includes built-in logging and can be monitored through:
- Application logs via console output
- Database query monitoring through Prisma
- Docker container logs via `docker-compose logs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/docs`
- Review the database schema in `prisma/schema.prisma`
- Examine route implementations in the `src/` directory

## 🔄 Version History

- **v1.0.50** - Current release
  - Full medical management system
  - Complete CRUD operations for all entities
  - Docker containerization
  - Swagger documentation

---

Built with ❤️ using [Elysia](https://elysiajs.com/) and [Bun](https://bun.sh/)