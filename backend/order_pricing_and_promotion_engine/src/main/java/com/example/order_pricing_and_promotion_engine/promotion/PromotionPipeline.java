package com.example.order_pricing_and_promotion_engine.promotion;

import com.example.order_pricing_and_promotion_engine.dto.PricingContextDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromotionPipeline {

    private final List<PromotionStrategy> strategies;

    public PromotionPipeline(List<PromotionStrategy> strategies) {
        this.strategies = strategies;
    }

    public void execute(PricingContextDTO context) {
        for (PromotionStrategy strategy : strategies) {
            strategy.apply(context);
        }
    }
}
