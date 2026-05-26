package com.example.order_pricing_and_promotion_engine.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class PricingContextDTO {

    private CustomerType customerType;
    private String couponCode;
    private List<OrderItemDTO> items = new ArrayList<>();

    private BigDecimal subtotal = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    private BigDecimal discount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    private BigDecimal runningTotal = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    private final List<AppliedDiscountDTO> appliedDiscounts = new ArrayList<>();

    public CustomerType getCustomerType() {
        return customerType;
    }

    public void setCustomerType(CustomerType customerType) {
        this.customerType = customerType;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = normalize(subtotal);
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public BigDecimal getRunningTotal() {
        return runningTotal;
    }

    public void setRunningTotal(BigDecimal runningTotal) {
        this.runningTotal = normalize(runningTotal);
    }

    public List<String> getAppliedPromotions() {
        return appliedDiscounts.stream()
                .map(AppliedDiscountDTO::getCode)
                .toList();
    }

    public List<AppliedDiscountDTO> getAppliedDiscounts() {
        return Collections.unmodifiableList(appliedDiscounts);
    }

    public void applyDiscount(BigDecimal discountAmount, String promotionName) {
        applyDiscount(discountAmount, promotionName, promotionName, "PROMOTION");
    }

    public void applyDiscount(BigDecimal discountAmount, String code, String name, String type) {
        if (discountAmount == null || discountAmount.signum() <= 0) {
            return;
        }

        BigDecimal normalized = normalize(discountAmount);
        BigDecimal effective = normalized.min(runningTotal);
        if (effective.signum() <= 0) {
            return;
        }

        discount = normalize(discount.add(effective));
        runningTotal = normalize(runningTotal.subtract(effective));
        if (code != null && !code.isBlank()) {
            appliedDiscounts.add(new AppliedDiscountDTO(code, name, type, effective));
        }
    }

    private BigDecimal normalize(BigDecimal value) {
        return (value == null ? BigDecimal.ZERO : value).setScale(2, RoundingMode.HALF_UP);
    }
}
