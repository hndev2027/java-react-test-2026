package com.example.order_pricing_and_promotion_engine.repository;

import com.example.order_pricing_and_promotion_engine.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
