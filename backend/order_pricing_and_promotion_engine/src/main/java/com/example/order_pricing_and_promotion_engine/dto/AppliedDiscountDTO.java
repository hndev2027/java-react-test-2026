package com.example.order_pricing_and_promotion_engine.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppliedDiscountDTO {
    private String code;
    private String name;
    private String type;
    private BigDecimal amount;
}
