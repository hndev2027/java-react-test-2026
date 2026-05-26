package com.example.order_pricing_and_promotion_engine.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class OrderRequestDTO {
    @NotNull
    private CustomerType customerType;

    @NotEmpty
    private List<@Valid OrderItemDTO> items;

    private String couponCode;
}
