package com.expiration.service;

import com.expiration.dto.ProductCreateDTO;
import com.expiration.dto.ProductResponseDTO;
import com.expiration.entity.Product;
import com.expiration.exception.ProductNotFoundException;
import com.expiration.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {
    
    private final ProductRepository productRepository;
    
    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    /**
     * Get all products
     */
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get product by ID
     */
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        return new ProductResponseDTO(product);
    }
    
    /**
     * Create new product
     */
    public ProductResponseDTO createProduct(ProductCreateDTO productCreateDTO) {
        Product product = new Product(
                productCreateDTO.getName(),
                productCreateDTO.getCategory(),
                productCreateDTO.getExpirationDate(),
                productCreateDTO.getQuantity(),
                productCreateDTO.getPrice()
        );
        
        Product savedProduct = productRepository.save(product);
        return new ProductResponseDTO(savedProduct);
    }
    
    /**
     * Update existing product
     */
    public ProductResponseDTO updateProduct(Long id, ProductCreateDTO productCreateDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        
        existingProduct.setName(productCreateDTO.getName());
        existingProduct.setCategory(productCreateDTO.getCategory());
        existingProduct.setExpirationDate(productCreateDTO.getExpirationDate());
        existingProduct.setQuantity(productCreateDTO.getQuantity());
        existingProduct.setPrice(productCreateDTO.getPrice());
        
        Product updatedProduct = productRepository.save(existingProduct);
        return new ProductResponseDTO(updatedProduct);
    }
    
    /**
     * Delete product
     */
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
    
    /**
     * Search products by name
     */
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get products by category
     */
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category)
                .stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get products expiring tomorrow
     */
    @Transactional(readOnly = true)
    public List<Product> getProductsExpiringTomorrow() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        return productRepository.findProductsExpiringTomorrow(tomorrow);
    }
    
    /**
     * Get products expiring within specified days
     */
    @Transactional(readOnly = true)
    public List<Product> getProductsExpiringWithinDays(int days) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(days);
        return productRepository.findProductsExpiringWithinDays(today, futureDate);
    }
    
    /**
     * Get expired products
     */
    @Transactional(readOnly = true)
    public List<Product> getExpiredProducts() {
        LocalDate today = LocalDate.now();
        return productRepository.findExpiredProducts(today);
    }
    
    /**
     * Get products expiring within days as DTOs
     */
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductsExpiringWithinDaysAsDTO(int days) {
        return getProductsExpiringWithinDays(days)
                .stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get total value of products expiring within days
     */
    @Transactional(readOnly = true)
    public Double getTotalValueOfProductsExpiringWithinDays(int days) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(days);
        return productRepository.getTotalValueOfProductsExpiringWithinDays(today, futureDate);
    }
    
    /**
     * Count products expiring within days
     */
    @Transactional(readOnly = true)
    public Long countProductsExpiringWithinDays(int days) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(days);
        return productRepository.countProductsExpiringWithinDays(today, futureDate);
    }
}