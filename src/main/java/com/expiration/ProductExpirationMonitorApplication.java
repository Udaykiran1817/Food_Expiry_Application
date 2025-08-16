package com.expiration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ProductExpirationMonitorApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductExpirationMonitorApplication.class, args);
        
        System.out.println("\n🚀 Product Expiration Monitor Started Successfully!");
        System.out.println("📡 Server running on http://localhost:3000");
        System.out.println("🗄️  H2 Console: http://localhost:3000/h2-console");
        System.out.println("⏰ Cron jobs scheduled and running:");
        System.out.println("   - 7-day expiration check: Daily at 9:00 AM");
        System.out.println("   - Tomorrow expiration check: Daily at 6:00 PM");
        System.out.println("   - Test scheduler: Every 2 minutes");
        System.out.println("🍳 Recipe suggestions enabled for expiring products");
        System.out.println("📧 Email alerts configured (currently simulated)");
        System.out.println("=" .repeat(60));
    }
}