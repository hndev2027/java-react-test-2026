package com.example.order_pricing_and_promotion_engine.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
public class OrderResponseDTO {
    private Long id;
    private String customerType;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal finalPrice;
    private String couponCode;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items = new ArrayList<>();
    private List<AppliedDiscountDTO> appliedDiscounts = new ArrayList<>();
}
