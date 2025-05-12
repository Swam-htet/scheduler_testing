# Express.js Scheduler with MySQL and Docker

A robust scheduling system built with Express.js, MySQL, and Docker. This application allows you to create, manage, and monitor scheduled tasks using cron expressions.

## Features

- 🕒 Schedule tasks using cron expressions
- 📊 MySQL database for persistent storage
- 🐳 Docker containerization
- 📝 Comprehensive logging system
- 🔄 Automatic database connection retry
- 🛡️ Input validation
- 📡 RESTful API endpoints
- 📈 Request/Response logging

## Prerequisites

- Docker
- Docker Compose
- Node.js (for local development)

## Project Structure

```
.
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── logger.js
│   ├── middleware/
│   │   └── requestLogger.js
│   ├── models/
│   │   └── scheduler.js
│   ├── routes/
│   │   └── schedulerRoutes.js
│   ├── services/
│   │   └── schedulerService.js
│   ├── utils/
│   │   └── dbConnection.js
│   └── index.js
├── db/
│   └── migrations/
│       └── 01_create_scheduler_table.sql
├── logs/
├── .env.example
├── .gitignore
├── api.http
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-name>
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=mysql
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
DB_ROOT_PASSWORD=rootpassword

# Application Configuration
PORT=3000
LOG_LEVEL=info
```

4. Start the application:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Schedules

- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/:id` - Get schedule by ID
- `POST /api/schedules` - Create new schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Example Request

```http
POST /api/schedules
Content-Type: application/json

{
    "name": "Every Minute Task",
    "cronTime": "* * * * *",
    "isActive": true,
    "task": "minuteTask"
}
```

## Testing the API

The project includes an `api.http` file for testing the API endpoints. You can use it with VS Code's REST Client extension or similar tools.

1. Install REST Client extension in VS Code
2. Open `api.http`
3. Click "Send Request" above any request

## Logging

The application uses Winston logger with the following features:

- Console logging with colors
- Daily rotating log files
- Separate error logs
- Request/Response logging
- Performance monitoring

Logs are stored in the `logs` directory:

- `application-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only

## Database Schema

```sql
CREATE TABLE scheduler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cronTime VARCHAR(255) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    task VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Development

### Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the application:

```bash
npm run dev
```

### Docker Development

1. Build and start containers:

```bash
docker-compose up --build
```

2. View logs:

```bash
docker-compose logs -f
```

## Error Handling

The application includes comprehensive error handling:

- Database connection retry mechanism
- Input validation
- Error logging
- Graceful error responses

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
