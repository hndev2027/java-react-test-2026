package com.example.order_pricing_and_promotion_engine.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class ProductResponseDTO {
    private Long id;
    private String sku;
    private String name;
    private BigDecimal price;
}
