package com.expiration.config;

import com.expiration.entity.Product;
import com.expiration.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    private final ProductRepository productRepository;
    
    @Autowired
    public DataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            logger.info("🔄 Initializing database with dummy data...");
            initializeDummyData();
            logger.info("✅ Database initialized with {} products", productRepository.count());
        } else {
            logger.info("📊 Database already contains {} products", productRepository.count());
        }
    }
    
    private void initializeDummyData() {
        LocalDate today = LocalDate.now();
        
        List<Product> dummyProducts = Arrays.asList(
                // Products expiring tomorrow (urgent alerts)
                new Product("Fresh Milk", "Dairy", today.plusDays(1), 50, new BigDecimal("3.99")),
                new Product("Ground Beef", "Meat", today.plusDays(1), 10, new BigDecimal("6.99")),
                new Product("Salmon Fillet", "Seafood", today.plusDays(1), 8, new BigDecimal("12.99")),
                
                // Products expiring day after tomorrow
                new Product("Whole Wheat Bread", "Bakery", today.plusDays(2), 30, new BigDecimal("2.49")),
                new Product("Fresh Lettuce", "Vegetables", today.plusDays(2), 40, new BigDecimal("1.99")),
                new Product("Strawberries", "Fruits", today.plusDays(2), 20, new BigDecimal("5.99")),
                
                // Products expiring within 7 days (planning alerts)
                new Product("Greek Yogurt", "Dairy", today.plusDays(3), 25, new BigDecimal("1.99")),
                new Product("Aged Cheddar Cheese", "Dairy", today.plusDays(4), 15, new BigDecimal("5.99")),
                new Product("Gala Apples", "Fruits", today.plusDays(5), 100, new BigDecimal("4.99")),
                new Product("Ripe Bananas", "Fruits", today.plusDays(5), 80, new BigDecimal("2.99")),
                new Product("Chicken Breast", "Meat", today.plusDays(6), 20, new BigDecimal("8.99")),
                new Product("Roma Tomatoes", "Vegetables", today.plusDays(6), 60, new BigDecimal("3.49")),
                new Product("Large Eggs", "Dairy", today.plusDays(7), 24, new BigDecimal("3.49")),
                new Product("Fresh Spinach", "Vegetables", today.plusDays(7), 30, new BigDecimal("2.99")),
                new Product("Pork Chops", "Meat", today.plusDays(7), 12, new BigDecimal("7.99")),
                new Product("Bell Peppers", "Vegetables", today.plusDays(7), 25, new BigDecimal("3.99")),
                
                // Products with longer shelf life (good inventory)
                new Product("Orange Juice", "Beverages", today.plusDays(14), 35, new BigDecimal("4.49")),
                new Product("Whole Grain Pasta", "Pantry", today.plusDays(30), 100, new BigDecimal("1.99")),
                new Product("Basmati Rice", "Pantry", today.plusDays(365), 50, new BigDecimal("3.99")),
                new Product("Olive Oil", "Pantry", today.plusDays(180), 12, new BigDecimal("8.99")),
                
                // Some expired products for testing
                new Product("Expired Yogurt", "Dairy", today.minusDays(2), 5, new BigDecimal("1.99")),
                new Product("Old Bread", "Bakery", today.minusDays(1), 8, new BigDecimal("2.49"))
        );
        
        productRepository.saveAll(dummyProducts);
        
        // Log summary of created data
        logger.info("📦 Created dummy products:");
        logger.info("   🔴 Products expiring tomorrow: {}", 
                   productRepository.findProductsExpiringTomorrow(today.plusDays(1)).size());
        logger.info("   🟡 Products expiring within 7 days: {}", 
                   productRepository.findProductsExpiringWithinDays(today, today.plusDays(7)).size());
        logger.info("   💀 Already expired products: {}", 
                   productRepository.findExpiredProducts(today).size());
        logger.info("   ✅ Products with good shelf life: {}", 
                   dummyProducts.size() - productRepository.findProductsExpiringWithinDays(today, today.plusDays(7)).size());
    }
}