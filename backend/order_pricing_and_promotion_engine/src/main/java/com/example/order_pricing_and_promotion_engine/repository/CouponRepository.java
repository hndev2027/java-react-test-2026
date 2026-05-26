package com.example.order_pricing_and_promotion_engine.repository;

import com.example.order_pricing_and_promotion_engine.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCodeAndActiveTrue(String code);
}
