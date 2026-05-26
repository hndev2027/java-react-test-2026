package com.example.order_pricing_and_promotion_engine.service;

import com.example.order_pricing_and_promotion_engine.dto.ProductResponseDTO;

import java.util.List;

public interface ProductService {
    List<ProductResponseDTO> getAll();
}
