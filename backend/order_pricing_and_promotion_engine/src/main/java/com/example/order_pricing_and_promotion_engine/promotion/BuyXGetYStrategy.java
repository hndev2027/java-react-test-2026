package com.example.order_pricing_and_promotion_engine.promotion;

import com.example.order_pricing_and_promotion_engine.dto.OrderItemDTO;
import com.example.order_pricing_and_promotion_engine.dto.PricingContextDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Order(1)
public class BuyXGetYStrategy implements PromotionStrategy {

    private static final Logger log = LoggerFactory.getLogger(BuyXGetYStrategy.class);
    private static final int BUY = 2;
    private static final int GET = 1;

    @Override
    public void apply(PricingContextDTO context) {
        BigDecimal discount = BigDecimal.ZERO;
        int groupSize = BUY + GET;
        for (OrderItemDTO item : context.getItems()) {
            int freeQty = item.getQuantity() / groupSize;
            if (freeQty > 0) {
                discount = discount.add(item.getPrice().multiply(BigDecimal.valueOf(freeQty)));
            }
        }
        context.applyDiscount(discount, "BUY_X_GET_Y", "Buy 2 Get 1 Free", "BUY_X_GET_Y");
        if (discount.signum() > 0) {
            log.info("Applied BUY_X_GET_Y: {}", discount);
        }
    }
}
