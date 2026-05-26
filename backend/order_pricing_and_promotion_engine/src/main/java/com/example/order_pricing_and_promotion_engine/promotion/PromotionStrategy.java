package com.example.order_pricing_and_promotion_engine.promotion;

import com.example.order_pricing_and_promotion_engine.dto.PricingContextDTO;

public interface PromotionStrategy {
    void apply(PricingContextDTO context);
}
