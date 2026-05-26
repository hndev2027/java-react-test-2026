package com.example.order_pricing_and_promotion_engine.promotion;

import com.example.order_pricing_and_promotion_engine.dto.PricingContextDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Order(2)
public class PercentageDiscountStrategy implements PromotionStrategy {

    private static final Logger log = LoggerFactory.getLogger(PercentageDiscountStrategy.class);
    private static final BigDecimal RATE = new BigDecimal("0.10");

    @Override
    public void apply(PricingContextDTO context) {
        BigDecimal discount = context.getRunningTotal().multiply(RATE);
        context.applyDiscount(discount, "PERCENTAGE_10", "10% Order Discount", "ORDER_PERCENTAGE");
        log.info("Applied PERCENTAGE_10: {}", discount);
    }
}
