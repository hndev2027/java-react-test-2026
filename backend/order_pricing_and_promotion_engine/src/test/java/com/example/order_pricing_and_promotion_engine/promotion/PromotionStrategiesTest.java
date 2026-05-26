package com.example.order_pricing_and_promotion_engine.promotion;

import com.example.order_pricing_and_promotion_engine.dto.OrderItemDTO;
import com.example.order_pricing_and_promotion_engine.dto.CustomerType;
import com.example.order_pricing_and_promotion_engine.dto.PricingContextDTO;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PromotionStrategiesTest {

    private final VipDiscountStrategy vipDiscountStrategy = new VipDiscountStrategy();
    private final BuyXGetYStrategy buyXGetYStrategy = new BuyXGetYStrategy();

    @Test
    void apply_vipCustomer_discountAppliedCorrectly() {
        PricingContextDTO context = new PricingContextDTO();
        context.setCustomerType(CustomerType.VIP);
        context.setRunningTotal(new BigDecimal("200.00"));

        vipDiscountStrategy.apply(context);

        assertEquals(0, new BigDecimal("10.00").compareTo(context.getDiscount()));
        assertEquals(0, new BigDecimal("190.00").compareTo(context.getRunningTotal()));
    }

    @Test
    void apply_nonVipCustomer_noDiscountApplied() {
        PricingContextDTO context = new PricingContextDTO();
        context.setCustomerType(CustomerType.NORMAL);
        context.setRunningTotal(new BigDecimal("200.00"));

        vipDiscountStrategy.apply(context);

        assertEquals(0, new BigDecimal("0.00").compareTo(context.getDiscount()));
        assertEquals(0, new BigDecimal("200.00").compareTo(context.getRunningTotal()));
    }

    @Test
    void apply_buyXGetYEligibleQuantity_discountAppliedCorrectly() {
        PricingContextDTO context = new PricingContextDTO();
        context.setRunningTotal(new BigDecimal("400.00"));
        context.setItems(List.of(item("A100", "100.00", 3)));

        buyXGetYStrategy.apply(context);

        assertEquals(0, new BigDecimal("100.00").compareTo(context.getDiscount()));
        assertEquals(0, new BigDecimal("300.00").compareTo(context.getRunningTotal()));
    }

    @Test
    void apply_quantityLessThanRequired_noDiscountApplied() {
        PricingContextDTO context = new PricingContextDTO();
        context.setRunningTotal(new BigDecimal("200.00"));
        context.setItems(List.of(item("B200", "50.00", 2)));

        buyXGetYStrategy.apply(context);

        assertEquals(0, new BigDecimal("0.00").compareTo(context.getDiscount()));
        assertEquals(0, new BigDecimal("200.00").compareTo(context.getRunningTotal()));
    }

    private OrderItemDTO item(String sku, String price, int quantity) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setSku(sku);
        dto.setPrice(new BigDecimal(price));
        dto.setQuantity(quantity);
        return dto;
    }
}
