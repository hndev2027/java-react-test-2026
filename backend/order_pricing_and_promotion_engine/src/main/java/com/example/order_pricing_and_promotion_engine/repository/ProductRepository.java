package com.example.order_pricing_and_promotion_engine.repository;

import com.example.order_pricing_and_promotion_engine.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
}
