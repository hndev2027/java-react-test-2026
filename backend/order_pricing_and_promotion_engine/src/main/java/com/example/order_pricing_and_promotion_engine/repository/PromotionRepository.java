package com.example.order_pricing_and_promotion_engine.repository;

import com.example.order_pricing_and_promotion_engine.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
}
