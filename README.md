# Product Expiration Monitor - Spring Boot Edition

A comprehensive Spring Boot application that monitors product expiration dates and sends automated alerts using cron jobs with recipe suggestions.

## Features

- **Product Management**: Full CRUD operations for products with expiration dates
- **Automated Monitoring**: Multiple cron jobs that monitor product expiration at different intervals
- **Smart Alert System**: Comprehensive alert system with recipe suggestions for expiring products
- **REST API**: Complete REST API with proper validation and error handling
- **Database Integration**: Uses H2 in-memory database with JPA/Hibernate
- **Recipe Integration**: 50+ recipes with smart matching for expiring products
- **Best Practices**: Follows Spring Boot best practices with DTOs, custom exceptions, and proper separation of concerns

## Cron Jobs

### 1. Morning Health Check
- **Schedule**: Daily at 8:00 AM (`0 0 8 * * ?`)
- **Purpose**: Comprehensive inventory health report
- **Features**: Summary of products expiring tomorrow, this week, and already expired

### 2. Seven-Day Expiration Monitor
- **Schedule**: Daily at 9:00 AM (`0 0 9 * * ?`)
- **Purpose**: Monitors products expiring within the next 7 days
- **Alert Type**: Warning level alerts with meal planning suggestions

### 3. Tomorrow Expiration Monitor  
- **Schedule**: Daily at 6:00 PM (`0 0 18 * * ?`)
- **Purpose**: Monitors products expiring the next day
- **Alert Type**: Urgent alerts with immediate recipe suggestions

### 4. Evening Meal Planning
- **Schedule**: Daily at 7:00 PM (`0 0 19 * * ?`)
- **Purpose**: Weekly meal planning suggestions using expiring products
- **Features**: Organized meal schedule for the upcoming week

### 5. Test Scheduler (Development Only)
- **Schedule**: Every 2 minutes for testing purposes
- **Purpose**: Allows immediate testing of the monitoring system
- **Note**: Remove or adjust for production use

## Project Structure

```
src/main/java/com/expiration/
├── ProductExpirationMonitorApplication.java  # Main application class
├── entity/
│   └── Product.java                          # Product entity with validation
├── repository/
│   └── ProductRepository.java                # Data access layer with custom queries
├── dto/
│   ├── ProductCreateDTO.java                 # Product creation DTO
│   ├── ProductResponseDTO.java               # Product response DTO
│   ├── ExpirationAlertDTO.java               # Alert DTO with recipe suggestions
│   └── RecipeDTO.java                        # Recipe data transfer object
├── service/
│   ├── ProductService.java                   # Business logic for products
│   ├── AlertService.java                     # Alert management with recipes
│   └── RecipeService.java                    # Recipe suggestion engine
├── controller/
│   └── ProductController.java                # REST endpoints
├── scheduler/
│   └── ExpirationScheduler.java              # Comprehensive cron job implementation
├── exception/
│   ├── ProductNotFoundException.java         # Custom exception
│   └── GlobalExceptionHandler.java           # Global error handling
└── config/
    ├── SchedulingConfig.java                 # Scheduling configuration
    └── DataInitializer.java                  # Comprehensive dummy data setup
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

### Recipe System
- `GET /api/recipes/{productName}` - Get recipe suggestions for specific product

### Alert Management
- `GET /api/alerts/history` - Get alert history
- `GET /api/alerts/stats` - Get alert statistics
- `POST /api/alerts/check` - Trigger manual alert check

## Running the Application

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher

### Local Development
1. **Clone the repository**
2. **Navigate to project directory**
3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```
4. **Access the application**:
   - Frontend: http://localhost:3000
   - H2 Console: http://localhost:3000/h2-console
     - JDBC URL: `jdbc:h2:mem:testdb`
     - Username: `sa`
     - Password: `password`

### Building for Production
```bash
mvn clean package
java -jar target/product-expiration-monitor-0.0.1-SNAPSHOT.jar
```

## Sample Data

The application automatically creates 20+ comprehensive dummy products:
- **Urgent Products**: Items expiring tomorrow (immediate alerts)
- **Planning Products**: Items expiring within 7 days (planning alerts)
- **Good Inventory**: Products with longer shelf life
- **Expired Products**: Already expired items for testing
- **Diverse Categories**: Dairy, Meat, Vegetables, Fruits, Bakery, Seafood, Pantry items

## Recipe System

### Features
- **50+ Recipes**: Comprehensive database covering all food categories
- **Smart Matching**: Intelligent product-to-recipe matching
- **Category Fallbacks**: Category-based suggestions when direct matches aren't found
- **Recipe Details**: Each recipe includes:
  - Name and description
  - Ingredients list
  - Cooking time
  - Difficulty level
  - Product association

### Recipe Categories
- **Dairy**: Milk, cheese, yogurt recipes
- **Meat**: Chicken, beef, pork dishes
- **Vegetables**: Fresh vegetable preparations
- **Fruits**: Fruit-based recipes and desserts
- **Bakery**: Bread-based recipes
- **Pantry**: Long-shelf-life ingredient recipes

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
- Morning health check: `@Scheduled(cron = "0 0 8 * * ?")`
- 7-day check: `@Scheduled(cron = "0 0 9 * * ?")`
- Tomorrow check: `@Scheduled(cron = "0 0 18 * * ?")`
- Evening planning: `@Scheduled(cron = "0 0 19 * * ?")`

## Alert System

### Features
- **Multi-level Alerts**: Different urgency levels with appropriate messaging
- **Recipe Integration**: Automatic recipe suggestions for expiring products
- **Rich Console Output**: Colorful, formatted console alerts with emojis
- **Alert History**: Complete tracking of all sent alerts
- **Statistics**: Alert frequency and value-at-risk analytics

### Alert Types
1. **URGENT (Tomorrow)**: Red alerts for products expiring next day
2. **WARNING (7-Day)**: Yellow alerts for products expiring within week
3. **INFO**: General inventory information

## Frontend Features

### Modern UI Components
- **Responsive Dashboard**: Works on all device sizes
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Interactive Tables**: Sortable, filterable product listings
- **Modal Forms**: Smooth add/edit product functionality
- **Toast Notifications**: Real-time user feedback
- **Recipe Integration**: Recipe suggestion buttons for expiring products

### Design Elements
- **Glass Morphism**: Modern translucent design elements
- **Color-coded Status**: Visual indicators for product status
- **Micro-interactions**: Hover effects and smooth transitions
- **Professional Typography**: Clean, readable font hierarchy

## Production Deployment

### Database Configuration
Replace H2 with production database in `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/expiration_monitor
    username: your_username
    password: your_password
  jpa:
    hibernate:
      ddl-auto: validate
```

### Email Configuration
Configure SMTP settings for real email alerts:
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

### Production Checklist
1. Replace H2 with production database
2. Configure email/SMS services
3. Adjust cron schedules for business hours
4. Remove or modify test scheduler
5. Configure proper logging levels
6. Set up monitoring and health checks
7. Configure security settings
8. Set up backup strategies

## Monitoring and Logging

### Log Levels
- **INFO**: General application flow and health checks
- **WARN**: 7-day expiration alerts and warnings
- **ERROR**: Tomorrow expiration alerts (urgent) and system errors
- **DEBUG**: Detailed operation logs and test scheduler output

### Health Monitoring
- **Health Check Endpoint**: `/api/health`
- **Alert Statistics**: `/api/alerts/stats`
- **System Metrics**: Built-in Spring Boot Actuator support

## Testing

### Immediate Testing
- Test scheduler runs every 2 minutes for immediate verification
- Comprehensive dummy data covers all scenarios
- Manual alert trigger endpoint for on-demand testing

### Test Scenarios
- Products expiring tomorrow (urgent alerts)
- Products expiring within 7 days (planning alerts)
- Already expired products
- Recipe suggestion accuracy
- Alert history tracking

## Error Handling

### Global Exception Handling
- **ProductNotFoundException**: 404 responses for missing products
- **Validation Errors**: Detailed field-level validation messages
- **Generic Exceptions**: Graceful error responses
- **Runtime Errors**: Comprehensive error logging

### Validation Features
- **Bean Validation**: Comprehensive input validation on DTOs
- **Custom Constraints**: Business logic validation
- **Error Messages**: User-friendly error descriptions

## Security Considerations

### Current Implementation
- CORS enabled for frontend integration
- Input validation on all endpoints
- SQL injection prevention through JPA

### Production Security
- Add Spring Security for authentication
- Implement rate limiting
- Add HTTPS configuration
- Secure database credentials
- Add API key authentication

## Performance Optimization

### Current Features
- **Connection Pooling**: Efficient database connections
- **Lazy Loading**: Optimized JPA queries
- **Caching**: Consider adding Redis for production
- **Async Processing**: Scheduled tasks run independently

### Scaling Considerations
- Add database indexing for large datasets
- Implement caching layer
- Consider microservices architecture
- Add load balancing for high availability

This Spring Boot application provides a production-ready foundation for product expiration monitoring with comprehensive alerting and recipe suggestion capabilities.