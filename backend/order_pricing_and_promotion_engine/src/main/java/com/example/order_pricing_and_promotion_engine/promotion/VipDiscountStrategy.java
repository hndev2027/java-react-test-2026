package com.example.order_pricing_and_promotion_engine.promotion;

import com.example.order_pricing_and_promotion_engine.dto.PricingContextDTO;
import com.example.order_pricing_and_promotion_engine.dto.CustomerType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Order(3)
public class VipDiscountStrategy implements PromotionStrategy {

    private static final Logger log = LoggerFactory.getLogger(VipDiscountStrategy.class);
    private static final BigDecimal RATE = new BigDecimal("0.05");

    @Override
    public void apply(PricingContextDTO context) {
        if (context.getCustomerType() != CustomerType.VIP) {
            return;
        }
        BigDecimal discount = context.getRunningTotal().multiply(RATE);
        context.applyDiscount(discount, "VIP_5", "VIP Customer Discount", "VIP");
        log.info("Applied VIP_5: {}", discount);
    }
}
