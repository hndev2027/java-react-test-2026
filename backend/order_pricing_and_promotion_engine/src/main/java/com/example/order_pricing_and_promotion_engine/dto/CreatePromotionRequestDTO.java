package com.example.order_pricing_and_promotion_engine.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class CreatePromotionRequestDTO {
    @NotBlank
    private String name;
    @NotBlank
    private String type;
    @NotNull
    private BigDecimal value;
    private Boolean active = true;
}
