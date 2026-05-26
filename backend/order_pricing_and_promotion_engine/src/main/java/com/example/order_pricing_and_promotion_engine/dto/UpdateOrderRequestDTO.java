package com.example.order_pricing_and_promotion_engine.dto;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class UpdateOrderRequestDTO {
    private CustomerType customerType;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal finalPrice;
    private String couponCode;

    @Valid
    private List<OrderItemDTO> items = new ArrayList<>();
}
