package com.example.order_pricing_and_promotion_engine.service;

import com.example.order_pricing_and_promotion_engine.dto.CreateOrderRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.OrderRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.OrderResponseDTO;
import com.example.order_pricing_and_promotion_engine.dto.UpdateOrderRequestDTO;

import java.util.List;

public interface OrderService {
    OrderResponseDTO calculate(OrderRequestDTO request);
    OrderResponseDTO create(CreateOrderRequestDTO request);
    List<OrderResponseDTO> getAll();
    OrderResponseDTO getById(Long id);
    OrderResponseDTO update(Long id, UpdateOrderRequestDTO request);
    void delete(Long id);
}
