package com.example.order_pricing_and_promotion_engine.promotion;

import com.example.order_pricing_and_promotion_engine.dto.PricingContextDTO;
import com.example.order_pricing_and_promotion_engine.entity.Coupon;
import com.example.order_pricing_and_promotion_engine.repository.CouponRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Order(4)
public class CouponStrategy implements PromotionStrategy {

    private static final Logger log = LoggerFactory.getLogger(CouponStrategy.class);
    private static final String SUMMER10 = "SUMMER10";
    private static final BigDecimal AMOUNT = new BigDecimal("10.00");
    private static final String FIXED = "FIXED";
    private static final String PERCENT = "PERCENT";

    private final CouponRepository couponRepository;

    public CouponStrategy(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Override
    public void apply(PricingContextDTO context) {
        if (context.getCouponCode() == null || context.getCouponCode().isBlank()) {
            return;
        }

        Coupon coupon = couponRepository.findByCodeAndActiveTrue(context.getCouponCode().trim())
                .orElseGet(() -> defaultSummerCoupon(context.getCouponCode().trim()));
        if (coupon == null) {
            return;
        }

        BigDecimal discount = calculateDiscount(context, coupon);
        context.applyDiscount(discount, coupon.getCode(), coupon.getCode() + " Coupon", "COUPON");
        log.info("Applied coupon {}: {}", coupon.getCode(), discount);
    }

    private BigDecimal calculateDiscount(PricingContextDTO context, Coupon coupon) {
        if (PERCENT.equalsIgnoreCase(coupon.getDiscountType())) {
            return context.getRunningTotal().multiply(coupon.getValue()).divide(new BigDecimal("100"));
        }
        if (FIXED.equalsIgnoreCase(coupon.getDiscountType())) {
            return coupon.getValue();
        }
        return BigDecimal.ZERO;
    }

    private Coupon defaultSummerCoupon(String code) {
        if (!SUMMER10.equalsIgnoreCase(code)) {
            return null;
        }
        Coupon coupon = new Coupon();
        coupon.setCode(SUMMER10);
        coupon.setDiscountType(FIXED);
        coupon.setValue(AMOUNT);
        coupon.setActive(true);
        return coupon;
    }
}
