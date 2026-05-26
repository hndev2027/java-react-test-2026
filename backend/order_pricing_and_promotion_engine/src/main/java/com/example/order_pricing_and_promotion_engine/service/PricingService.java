package com.example.order_pricing_and_promotion_engine.service;

import com.example.order_pricing_and_promotion_engine.dto.PricingContextDTO;

public interface PricingService {
    PricingContextDTO calculate(PricingContextDTO context);
}
