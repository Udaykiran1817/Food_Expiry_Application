package com.expiration.scheduler;

import com.expiration.entity.Product;
import com.expiration.service.AlertService;
import com.expiration.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ExpirationScheduler {
    
    private static final Logger logger = LoggerFactory.getLogger(ExpirationScheduler.class);
    
    private final ProductService productService;
    private final AlertService alertService;
    
    @Autowired
    public ExpirationScheduler(ProductService productService, AlertService alertService) {
        this.productService = productService;
        this.alertService = alertService;
    }
    
    /**
     * Morning health check - Daily at 8:00 AM
     * Provides a comprehensive inventory health report
     */
    @Scheduled(cron = "0 0 8 * * ?")
    public void morningHealthCheck() {
        logger.info("🌅 Running morning inventory health check...");
        try {
            List<Product> tomorrowProducts = productService.getProductsExpiringTomorrow();
            List<Product> weekProducts = productService.getProductsExpiringWithinDays(7);
            List<Product> expiredProducts = productService.getExpiredProducts();
            
            logger.info("📊 DAILY INVENTORY HEALTH REPORT");
            logger.info("=" .repeat(60));
            logger.info("🔴 Products expiring tomorrow: {}", tomorrowProducts.size());
            logger.info("🟡 Products expiring this week: {}", weekProducts.size());
            logger.info("💀 Already expired products: {}", expiredProducts.size());
            logger.info("✅ Morning health check completed");
            logger.info("=" .repeat(60));
            
        } catch (Exception e) {
            logger.error("❌ Error in morning health check: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Seven-day expiration check - Daily at 9:00 AM
     * Monitors products expiring within the next 7 days
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void checkSevenDayExpiration() {
        logger.info("🕘 Running scheduled 7-day expiration check...");
        try {
            List<Product> products = productService.getProductsExpiringWithinDays(7);
            alertService.sendExpirationAlert(products, "SEVEN_DAYS");
            logger.info("✅ 7-day expiration check completed - {} products processed", products.size());
        } catch (Exception e) {
            logger.error("❌ Error in 7-day expiration check: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Tomorrow expiration check - Daily at 6:00 PM
     * Monitors products expiring the next day (urgent alerts)
     */
    @Scheduled(cron = "0 0 18 * * ?")
    public void checkTomorrowExpiration() {
        logger.info("🕕 Running scheduled tomorrow expiration check...");
        try {
            List<Product> products = productService.getProductsExpiringTomorrow();
            alertService.sendExpirationAlert(products, "TOMORROW");
            logger.info("✅ Tomorrow expiration check completed - {} products processed", products.size());
        } catch (Exception e) {
            logger.error("❌ Error in tomorrow expiration check: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Evening meal planning - Daily at 7:00 PM
     * Provides meal planning suggestions for the upcoming week
     */
    @Scheduled(cron = "0 0 19 * * ?")
    public void eveningMealPlanning() {
        logger.info("🍽️ Running evening meal planning session...");
        try {
            List<Product> weekProducts = productService.getProductsExpiringWithinDays(7);
            
            if (!weekProducts.isEmpty()) {
                logger.info("📅 WEEKLY MEAL PLANNING SUGGESTIONS");
                logger.info("=" .repeat(60));
                logger.info("🥘 Products to use this week: {}", weekProducts.size());
                
                // Group products by days until expiration
                weekProducts.forEach(product -> {
                    long daysLeft = java.time.temporal.ChronoUnit.DAYS.between(
                            java.time.LocalDate.now(), product.getExpirationDate());
                    logger.info("   Day {}: Use {} ({})", daysLeft + 1, product.getName(), product.getCategory());
                });
                
                logger.info("💡 Consider batch cooking and meal prep for efficiency");
                logger.info("=" .repeat(60));
            } else {
                logger.info("✅ No products expiring this week - great inventory management!");
            }
            
        } catch (Exception e) {
            logger.error("❌ Error in evening meal planning: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Test scheduler - Every 2 minutes for demonstration
     * Remove or adjust for production use
     */
    @Scheduled(fixedRate = 120000) // 2 minutes
    public void testExpirationCheck() {
        logger.debug("🔄 Running test expiration checks with recipe suggestions...");
        try {
            List<Product> tomorrowProducts = productService.getProductsExpiringTomorrow();
            List<Product> weekProducts = productService.getProductsExpiringWithinDays(7);
            
            if (!tomorrowProducts.isEmpty() || !weekProducts.isEmpty()) {
                if (!tomorrowProducts.isEmpty()) {
                    alertService.sendExpirationAlert(tomorrowProducts, "TOMORROW");
                }
                if (!weekProducts.isEmpty()) {
                    alertService.sendExpirationAlert(weekProducts, "SEVEN_DAYS");
                }
            } else {
                logger.debug("ℹ️  No products expiring soon - all inventory is healthy! ✅");
            }
        } catch (Exception e) {
            logger.error("❌ Error in test expiration check: {}", e.getMessage(), e);
        }
    }
}