package com.example.order_pricing_and_promotion_engine.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CreateOrderRequestDTO {
    @NotNull
    private CustomerType customerType;

    @NotNull
    private BigDecimal subtotal;

    @NotNull
    private BigDecimal discount;

    @NotNull
    private BigDecimal finalPrice;

    private String couponCode;

    @Valid
    private List<OrderItemDTO> items = new ArrayList<>();
}
