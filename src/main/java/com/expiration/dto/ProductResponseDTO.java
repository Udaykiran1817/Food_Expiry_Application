package com.expiration.dto;

import com.expiration.entity.Product;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProductResponseDTO {
    private Long id;
    private String name;
    private String category;
    private LocalDate expirationDate;
    private Integer quantity;
    private BigDecimal price;
    private LocalDateTime createdAt;
    private Long daysUntilExpiration;
    private String status;
    
    // Constructors
    public ProductResponseDTO() {}
    
    public ProductResponseDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.category = product.getCategory();
        this.expirationDate = product.getExpirationDate();
        this.quantity = product.getQuantity();
        this.price = product.getPrice();
        this.createdAt = product.getCreatedAt();
        this.daysUntilExpiration = calculateDaysUntilExpiration(product.getExpirationDate());
        this.status = determineStatus(this.daysUntilExpiration);
    }
    
    private Long calculateDaysUntilExpiration(LocalDate expirationDate) {
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), expirationDate);
    }
    
    private String determineStatus(Long daysUntilExpiration) {
        if (daysUntilExpiration < 0) {
            return "EXPIRED";
        } else if (daysUntilExpiration == 0) {
            return "EXPIRES_TODAY";
        } else if (daysUntilExpiration == 1) {
            return "EXPIRES_TOMORROW";
        } else if (daysUntilExpiration <= 7) {
            return "EXPIRES_THIS_WEEK";
        } else {
            return "GOOD";
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public LocalDate getExpirationDate() {
        return expirationDate;
    }
    
    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Long getDaysUntilExpiration() {
        return daysUntilExpiration;
    }
    
    public void setDaysUntilExpiration(Long daysUntilExpiration) {
        this.daysUntilExpiration = daysUntilExpiration;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}