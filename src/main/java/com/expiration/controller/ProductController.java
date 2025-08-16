package com.expiration.controller;

import com.expiration.dto.ProductCreateDTO;
import com.expiration.dto.ProductResponseDTO;
import com.expiration.dto.RecipeDTO;
import com.expiration.service.AlertService;
import com.expiration.service.ProductService;
import com.expiration.service.RecipeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ProductController {
    
    private final ProductService productService;
    private final RecipeService recipeService;
    private final AlertService alertService;
    
    @Autowired
    public ProductController(ProductService productService, RecipeService recipeService, AlertService alertService) {
        this.productService = productService;
        this.recipeService = recipeService;
        this.alertService = alertService;
    }
    
    /**
     * Get all products
     */
    @GetMapping("/products")
    public ResponseEntity<Map<String, Object>> getAllProducts() {
        List<ProductResponseDTO> products = productService.getAllProducts();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", products);
        response.put("count", products.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get product by ID
     */
    @GetMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable Long id) {
        ProductResponseDTO product = productService.getProductById(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", product);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Create new product
     */
    @PostMapping("/products")
    public ResponseEntity<Map<String, Object>> createProduct(@Valid @RequestBody ProductCreateDTO productCreateDTO) {
        ProductResponseDTO createdProduct = productService.createProduct(productCreateDTO);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", createdProduct);
        response.put("message", "Product created successfully");
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Update product
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable Long id, 
            @Valid @RequestBody ProductCreateDTO productCreateDTO) {
        
        ProductResponseDTO updatedProduct = productService.updateProduct(id, productCreateDTO);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", updatedProduct);
        response.put("message", "Product updated successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Delete product
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product deleted successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Search products by name
     */
    @GetMapping("/products/search")
    public ResponseEntity<Map<String, Object>> searchProducts(@RequestParam String name) {
        List<ProductResponseDTO> products = productService.searchProductsByName(name);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", products);
        response.put("count", products.size());
        response.put("query", name);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get products expiring within specified days
     */
    @GetMapping("/products/expiring-in-days/{days}")
    public ResponseEntity<Map<String, Object>> getProductsExpiringInDays(@PathVariable int days) {
        List<ProductResponseDTO> products = productService.getProductsExpiringWithinDaysAsDTO(days);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", products);
        response.put("count", products.size());
        response.put("message", String.format("Products expiring within %d day(s)", days));
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get products expiring tomorrow
     */
    @GetMapping("/products/expiring-tomorrow")
    public ResponseEntity<Map<String, Object>> getProductsExpiringTomorrow() {
        List<ProductResponseDTO> products = productService.getProductsExpiringTomorrow()
                .stream()
                .map(ProductResponseDTO::new)
                .toList();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", products);
        response.put("count", products.size());
        response.put("message", "Products expiring tomorrow");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get recipe suggestions for a product
     */
    @GetMapping("/recipes/{productName}")
    public ResponseEntity<Map<String, Object>> getRecipesForProduct(@PathVariable String productName) {
        List<RecipeDTO> recipes = recipeService.getRecipesForProduct(productName);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", recipes);
        response.put("count", recipes.size());
        response.put("product", productName);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get alert history
     */
    @GetMapping("/alerts/history")
    public ResponseEntity<Map<String, Object>> getAlertHistory(
            @RequestParam(defaultValue = "10") int limit) {
        
        var history = alertService.getAlertHistory(limit);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", history);
        response.put("count", history.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get alert statistics
     */
    @GetMapping("/alerts/stats")
    public ResponseEntity<Map<String, Object>> getAlertStats() {
        var stats = alertService.getAlertStatistics();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", Map.of(
                "totalAlerts", stats.getTotalAlerts(),
                "totalValueAtRisk", stats.getTotalValueAtRisk()
        ));
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Trigger manual alert check
     */
    @PostMapping("/alerts/check")
    public ResponseEntity<Map<String, Object>> triggerManualAlertCheck() {
        var tomorrowProducts = productService.getProductsExpiringTomorrow();
        var weekProducts = productService.getProductsExpiringWithinDays(7);
        
        int totalAlerts = 0;
        
        if (!tomorrowProducts.isEmpty()) {
            alertService.sendExpirationAlert(tomorrowProducts, "TOMORROW");
            totalAlerts++;
        }
        
        if (!weekProducts.isEmpty()) {
            alertService.sendExpirationAlert(weekProducts, "SEVEN_DAYS");
            totalAlerts++;
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Manual alert check completed");
        response.put("totalAlerts", totalAlerts);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("timestamp", java.time.LocalDateTime.now());
        response.put("service", "Product Expiration Monitor");
        
        return ResponseEntity.ok(response);
    }
}