package com.example.order_pricing_and_promotion_engine.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class UpdatePromotionRequestDTO {
    private String name;
    private String type;
    private BigDecimal value;
    private Boolean active;
}
