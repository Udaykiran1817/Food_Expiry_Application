# Product Expiration Monitor

A comprehensive Spring Boot application that monitors product expiration dates and sends automated alerts using cron jobs.

## Features

- **Product Management**: Full CRUD operations for products with expiration dates
- **Automated Monitoring**: Two cron jobs that monitor product expiration
- **Alert System**: Comprehensive alert system for different expiration timelines
- **REST API**: Complete REST API with proper validation and error handling
- **Database Integration**: Uses H2 in-memory database with JPA/Hibernate
- **Best Practices**: Follows Spring Boot best practices with DTOs, custom exceptions, and proper separation of concerns

## Cron Jobs

### 1. Seven-Day Expiration Monitor
- **Schedule**: Daily at 9:00 AM (`0 0 9 * * ?`)
- **Purpose**: Monitors products expiring within the next 7 days
- **Alert Type**: Warning level alerts for inventory planning

### 2. Tomorrow Expiration Monitor  
- **Schedule**: Daily at 6:00 PM (`0 0 18 * * ?`)
- **Purpose**: Monitors products expiring the next day
- **Alert Type**: Urgent alerts requiring immediate action

### 3. Test Scheduler (Development Only)
- **Schedule**: Every 2 minutes for testing purposes
- **Purpose**: Allows immediate testing of the monitoring system
- **Note**: Remove or adjust for production use

## Project Structure

```
src/main/java/com/expiration/
├── ProductExpirationMonitorApplication.java  # Main application class
├── entity/
│   └── Product.java                          # Product entity
├── repository/
│   └── ProductRepository.java                # Data access layer
├── dto/
│   ├── ProductCreateDTO.java                 # Product creation DTO
│   ├── ProductResponseDTO.java               # Product response DTO
│   └── ExpirationAlertDTO.java               # Alert DTO
├── service/
│   ├── ProductService.java                   # Business logic
│   └── AlertService.java                     # Alert management
├── controller/
│   └── ProductController.java                # REST endpoints
├── scheduler/
│   └── ExpirationScheduler.java              # Cron job implementation
├── exception/
│   ├── ProductNotFoundException.java         # Custom exception
│   └── GlobalExceptionHandler.java           # Global error handling
└── config/
    ├── SchedulingConfig.java                 # Scheduling configuration
    └── DataInitializer.java                  # Dummy data setup
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/search?name={name}` - Search products by name

### Expiration Monitoring
- `GET /api/products/expiring-in-days/{days}` - Get products expiring in specified days
- `GET /api/products/expiring-tomorrow` - Get products expiring tomorrow

## Running the Application

1. **Prerequisites**: Java 17+ and Maven
2. **Run**: `mvn spring-boot:run`
3. **Access**: http://localhost:8080
4. **H2 Console**: http://localhost:8080/h2-console
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: `password`

## Sample Data

The application automatically creates 20+ dummy products with various expiration dates:
- Products expiring tomorrow (immediate alerts)
- Products expiring within 7 days (planning alerts)
- Products with longer shelf life
- Already expired products for testing

## Configuration

### Cron Expression Format
```
 ┌───────────── second (0-59)
 │ ┌───────────── minute (0-59)
 │ │ ┌───────────── hour (0-23)
 │ │ │ ┌───────────── day of the month (1-31)
 │ │ │ │ ┌───────────── month (1-12)
 │ │ │ │ │ ┌───────────── day of the week (0-7)
 │ │ │ │ │ │
 * * * * * *
```

### Customizing Schedules
Modify cron expressions in `ExpirationScheduler.java`:
- Change `@Scheduled(cron = "0 0 9 * * ?")` for different 7-day check times
- Change `@Scheduled(cron = "0 0 18 * * ?")` for different tomorrow check times

## Alert System

The alert system currently logs to console and simulates email notifications. For production use:

1. **Email Integration**: Configure SMTP settings in `application.yml`
2. **SMS Integration**: Add SMS service provider
3. **Push Notifications**: Integrate with push notification services
4. **Database Logging**: Store alert history in database

## Monitoring and Logging

- **Logging**: Uses SLF4J with Logback
- **Log Levels**: 
  - INFO: General application flow
  - WARN: 7-day expiration alerts
  - ERROR: Tomorrow expiration alerts (urgent)
  - DEBUG: Detailed operation logs

## Production Deployment

For production deployment:

1. Replace H2 with production database (PostgreSQL/MySQL)
2. Configure email/SMS services
3. Adjust cron schedules for business hours
4. Remove test scheduler
5. Configure proper logging levels
6. Set up monitoring and health checks

## Testing

The application includes comprehensive dummy data for testing both cron jobs immediately. The test scheduler runs every 2 minutes to demonstrate functionality.

## Error Handling

- **Global Exception Handler**: Centralized error handling
- **Validation**: Bean validation on DTOs
- **Custom Exceptions**: Specific business logic exceptions
- **Graceful Degradation**: Schedulers continue running even if individual jobs fail