package com.expiration.repository;

import com.expiration.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    /**
     * Find products expiring on a specific date
     */
    List<Product> findByExpirationDate(LocalDate expirationDate);
    
    /**
     * Find products expiring between two dates (inclusive)
     */
    List<Product> findByExpirationDateBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * Find products expiring on or before a specific date
     */
    List<Product> findByExpirationDateLessThanEqual(LocalDate date);
    
    /**
     * Find products by category
     */
    List<Product> findByCategory(String category);
    
    /**
     * Find products by name containing (case-insensitive)
     */
    List<Product> findByNameContainingIgnoreCase(String name);
    
    /**
     * Find products expiring tomorrow
     */
    @Query("SELECT p FROM Product p WHERE p.expirationDate = :tomorrow")
    List<Product> findProductsExpiringTomorrow(@Param("tomorrow") LocalDate tomorrow);
    
    /**
     * Find products expiring within the next N days
     */
    @Query("SELECT p FROM Product p WHERE p.expirationDate BETWEEN :today AND :futureDate ORDER BY p.expirationDate ASC")
    List<Product> findProductsExpiringWithinDays(@Param("today") LocalDate today, @Param("futureDate") LocalDate futureDate);
    
    /**
     * Find expired products
     */
    @Query("SELECT p FROM Product p WHERE p.expirationDate < :today")
    List<Product> findExpiredProducts(@Param("today") LocalDate today);
    
    /**
     * Count products expiring within N days
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.expirationDate BETWEEN :today AND :futureDate")
    Long countProductsExpiringWithinDays(@Param("today") LocalDate today, @Param("futureDate") LocalDate futureDate);
    
    /**
     * Get total value of products expiring within N days
     */
    @Query("SELECT COALESCE(SUM(p.price * p.quantity), 0) FROM Product p WHERE p.expirationDate BETWEEN :today AND :futureDate")
    Double getTotalValueOfProductsExpiringWithinDays(@Param("today") LocalDate today, @Param("futureDate") LocalDate futureDate);
}