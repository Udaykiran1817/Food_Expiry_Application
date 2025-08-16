package com.expiration.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ExpirationAlertDTO {
    private String alertType;
    private LocalDateTime timestamp;
    private List<ProductAlertInfo> products;
    private List<RecipeDTO> suggestedRecipes;
    private BigDecimal totalValueAtRisk;
    private String message;
    
    // Constructors
    public ExpirationAlertDTO() {}
    
    public ExpirationAlertDTO(String alertType, List<ProductAlertInfo> products, 
                             List<RecipeDTO> suggestedRecipes, BigDecimal totalValueAtRisk) {
        this.alertType = alertType;
        this.timestamp = LocalDateTime.now();
        this.products = products;
        this.suggestedRecipes = suggestedRecipes;
        this.totalValueAtRisk = totalValueAtRisk;
        this.message = generateMessage();
    }
    
    private String generateMessage() {
        int productCount = products != null ? products.size() : 0;
        if ("TOMORROW".equals(alertType)) {
            return String.format("🚨 URGENT: %d product(s) expiring tomorrow! Total value at risk: $%.2f", 
                                productCount, totalValueAtRisk);
        } else if ("SEVEN_DAYS".equals(alertType)) {
            return String.format("⚠️ WARNING: %d product(s) expiring within 7 days. Total value at risk: $%.2f", 
                                productCount, totalValueAtRisk);
        }
        return String.format("📦 %d product(s) require attention", productCount);
    }
    
    // Inner class for product alert information
    public static class ProductAlertInfo {
        private Long id;
        private String name;
        private String category;
        private LocalDate expirationDate;
        private Integer quantity;
        private BigDecimal price;
        private Long daysUntilExpiration;
        
        public ProductAlertInfo() {}
        
        public ProductAlertInfo(Long id, String name, String category, LocalDate expirationDate, 
                               Integer quantity, BigDecimal price, Long daysUntilExpiration) {
            this.id = id;
            this.name = name;
            this.category = category;
            this.expirationDate = expirationDate;
            this.quantity = quantity;
            this.price = price;
            this.daysUntilExpiration = daysUntilExpiration;
        }
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public LocalDate getExpirationDate() { return expirationDate; }
        public void setExpirationDate(LocalDate expirationDate) { this.expirationDate = expirationDate; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public Long getDaysUntilExpiration() { return daysUntilExpiration; }
        public void setDaysUntilExpiration(Long daysUntilExpiration) { this.daysUntilExpiration = daysUntilExpiration; }
    }
    
    // Getters and Setters
    public String getAlertType() {
        return alertType;
    }
    
    public void setAlertType(String alertType) {
        this.alertType = alertType;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public List<ProductAlertInfo> getProducts() {
        return products;
    }
    
    public void setProducts(List<ProductAlertInfo> products) {
        this.products = products;
    }
    
    public List<RecipeDTO> getSuggestedRecipes() {
        return suggestedRecipes;
    }
    
    public void setSuggestedRecipes(List<RecipeDTO> suggestedRecipes) {
        this.suggestedRecipes = suggestedRecipes;
    }
    
    public BigDecimal getTotalValueAtRisk() {
        return totalValueAtRisk;
    }
    
    public void setTotalValueAtRisk(BigDecimal totalValueAtRisk) {
        this.totalValueAtRisk = totalValueAtRisk;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}