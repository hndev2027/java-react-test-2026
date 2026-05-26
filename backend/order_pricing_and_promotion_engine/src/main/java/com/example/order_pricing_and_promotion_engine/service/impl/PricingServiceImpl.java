package com.example.order_pricing_and_promotion_engine.service.impl;

import com.example.order_pricing_and_promotion_engine.dto.OrderItemDTO;
import com.example.order_pricing_and_promotion_engine.dto.PricingContextDTO;
import com.example.order_pricing_and_promotion_engine.promotion.PromotionPipeline;
import com.example.order_pricing_and_promotion_engine.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PricingServiceImpl implements PricingService {

    private final PromotionPipeline promotionPipeline;

    @Override
    public PricingContextDTO calculate(PricingContextDTO context) {
        BigDecimal subtotal = context.getItems().stream()
                .map(this::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        context.setSubtotal(subtotal);
        context.setRunningTotal(subtotal);

        promotionPipeline.execute(context);
        return context;
    }

    private BigDecimal lineTotal(OrderItemDTO item) {
        return item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
    }
}
