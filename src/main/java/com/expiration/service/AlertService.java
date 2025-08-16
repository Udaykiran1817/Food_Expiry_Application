package com.expiration.service;

import com.expiration.dto.ExpirationAlertDTO;
import com.expiration.dto.RecipeDTO;
import com.expiration.entity.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {
    
    private static final Logger logger = LoggerFactory.getLogger(AlertService.class);
    
    private final RecipeService recipeService;
    private final List<ExpirationAlertDTO> alertHistory;
    
    @Autowired
    public AlertService(RecipeService recipeService) {
        this.recipeService = recipeService;
        this.alertHistory = new ArrayList<>();
    }
    
    /**
     * Send expiration alert with recipe suggestions
     */
    public ExpirationAlertDTO sendExpirationAlert(List<Product> products, String alertType) {
        if (products.isEmpty()) {
            logger.info("ℹ️  No products found for {} alert", alertType);
            return null;
        }
        
        // Convert products to alert info
        List<ExpirationAlertDTO.ProductAlertInfo> productAlertInfos = products.stream()
                .map(this::convertToAlertInfo)
                .collect(Collectors.toList());
        
        // Get recipe suggestions
        List<String> productNames = products.stream()
                .map(Product::getName)
                .collect(Collectors.toList());
        List<RecipeDTO> recipes = recipeService.getRecipesForProducts(productNames);
        
        // Calculate total value at risk
        BigDecimal totalValue = products.stream()
                .map(p -> p.getPrice().multiply(BigDecimal.valueOf(p.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Create alert DTO
        ExpirationAlertDTO alert = new ExpirationAlertDTO(alertType, productAlertInfos, recipes, totalValue);
        
        // Log detailed console alert
        logDetailedAlert(products, alertType, recipes, totalValue);
        
        // Store in history
        alertHistory.add(alert);
        
        // Keep only last 100 alerts
        if (alertHistory.size() > 100) {
            alertHistory.remove(0);
        }
        
        return alert;
    }
    
    /**
     * Get alert history
     */
    public List<ExpirationAlertDTO> getAlertHistory(int limit) {
        return alertHistory.stream()
                .skip(Math.max(0, alertHistory.size() - limit))
                .collect(Collectors.toList());
    }
    
    /**
     * Get alert statistics
     */
    public AlertStatistics getAlertStatistics() {
        long totalAlerts = alertHistory.size();
        BigDecimal totalValueAtRisk = alertHistory.stream()
                .map(ExpirationAlertDTO::getTotalValueAtRisk)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new AlertStatistics(totalAlerts, totalValueAtRisk);
    }
    
    private ExpirationAlertDTO.ProductAlertInfo convertToAlertInfo(Product product) {
        long daysUntilExpiration = ChronoUnit.DAYS.between(LocalDate.now(), product.getExpirationDate());
        return new ExpirationAlertDTO.ProductAlertInfo(
                product.getId(),
                product.getName(),
                product.getCategory(),
                product.getExpirationDate(),
                product.getQuantity(),
                product.getPrice(),
                daysUntilExpiration
        );
    }
    
    private void logDetailedAlert(List<Product> products, String alertType, List<RecipeDTO> recipes, BigDecimal totalValue) {
        String alertEmoji = "TOMORROW".equals(alertType) ? "🚨" : "⚠️";
        String alertLevel = "TOMORROW".equals(alertType) ? "URGENT" : "WARNING";
        
        logger.warn("\n{} {} EXPIRATION ALERT", alertEmoji, alertLevel);
        logger.warn("=" .repeat(80));
        logger.warn("📊 Found {} product(s) {}", products.size(), 
                   "TOMORROW".equals(alertType) ? "expiring tomorrow" : "expiring within 7 days");
        logger.warn("💰 Total value at risk: ${}", totalValue);
        logger.warn("📧 Alert sent at: {}", java.time.LocalDateTime.now());
        logger.warn("");
        
        // Product details
        logger.warn("📦 AFFECTED PRODUCTS:");
        logger.warn("-" .repeat(80));
        
        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);
            long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), product.getExpirationDate());
            String statusEmoji = daysLeft < 0 ? "💀" : daysLeft == 0 ? "🔴" : daysLeft == 1 ? "🟠" : "🟡";
            BigDecimal totalProductValue = product.getPrice().multiply(BigDecimal.valueOf(product.getQuantity()));
            
            logger.warn("{}. {} {} ({})", i + 1, statusEmoji, product.getName(), product.getCategory());
            logger.warn("   📅 Expires: {} ({} day{})", product.getExpirationDate(), daysLeft, daysLeft != 1 ? "s" : "");
            logger.warn("   📦 Quantity: {} units | 💵 Value: ${}", product.getQuantity(), totalProductValue);
            logger.warn("");
        }
        
        // Recipe suggestions
        if (!recipes.isEmpty()) {
            logger.warn("🍳 RECIPE SUGGESTIONS:");
            logger.warn("-" .repeat(80));
            
            for (int i = 0; i < recipes.size(); i++) {
                RecipeDTO recipe = recipes.get(i);
                logger.warn("{}. {} ({}) - {}", i + 1, recipe.getName(), recipe.getDifficulty(), recipe.getCookTime());
                logger.warn("   📝 {}", recipe.getDescription());
                if (recipe.getForProduct() != null) {
                    logger.warn("   🥘 For: {}", recipe.getForProduct());
                }
                logger.warn("   🛒 Ingredients: {}", String.join(", ", recipe.getIngredients()));
                logger.warn("");
            }
        }
        
        // Action recommendations
        logger.warn("💡 RECOMMENDED ACTIONS:");
        logger.warn("-" .repeat(80));
        if ("TOMORROW".equals(alertType)) {
            logger.warn("🔥 IMMEDIATE ACTION REQUIRED:");
            logger.warn("   • Use products in today's meals");
            logger.warn("   • Prepare recipes using these ingredients");
            logger.warn("   • Consider donating if quantities are large");
            logger.warn("   • Remove expired items from inventory");
        } else {
            logger.warn("📋 PLAN AHEAD:");
            logger.warn("   • Schedule meals using these products");
            logger.warn("   • Check if products can be frozen");
            logger.warn("   • Consider bulk cooking and meal prep");
            logger.warn("   • Review ordering patterns to reduce waste");
        }
        
        logger.warn("=" .repeat(80));
        logger.warn("⏰ Alert generated at: {}", java.time.LocalDateTime.now());
        logger.warn("");
    }
    
    // Inner class for alert statistics
    public static class AlertStatistics {
        private final long totalAlerts;
        private final BigDecimal totalValueAtRisk;
        
        public AlertStatistics(long totalAlerts, BigDecimal totalValueAtRisk) {
            this.totalAlerts = totalAlerts;
            this.totalValueAtRisk = totalValueAtRisk;
        }
        
        public long getTotalAlerts() {
            return totalAlerts;
        }
        
        public BigDecimal getTotalValueAtRisk() {
            return totalValueAtRisk;
        }
    }
}