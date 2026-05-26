package com.example.order_pricing_and_promotion_engine.service;

import com.example.order_pricing_and_promotion_engine.dto.OrderItemDTO;
import com.example.order_pricing_and_promotion_engine.dto.PricingContextDTO;
import com.example.order_pricing_and_promotion_engine.promotion.PromotionPipeline;
import com.example.order_pricing_and_promotion_engine.service.impl.PricingServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PricingServiceImplTest {

    @Mock
    private PromotionPipeline promotionPipeline;

    @InjectMocks
    private PricingServiceImpl pricingService;

    @Test
    void calculateSubtotal_correct_subtotalCalculatedFromItems() {
        PricingContextDTO context = buildContext();

        PricingContextDTO result = pricingService.calculate(context);

        assertEquals(0, new BigDecimal("250.00").compareTo(result.getSubtotal()));
        verify(promotionPipeline).execute(context);
    }

    @Test
    void applyPromotions_correctDiscount_pipelineCanMutateContextDiscount() {
        PricingContextDTO context = buildContext();
        doAnswer(invocation -> {
            PricingContextDTO ctx = invocation.getArgument(0);
            ctx.applyDiscount(new BigDecimal("30.00"), "MOCK_PROMOTION");
            return null;
        }).when(promotionPipeline).execute(context);

        PricingContextDTO result = pricingService.calculate(context);

        assertEquals(0, new BigDecimal("30.00").compareTo(result.getDiscount()));
        assertEquals(List.of("MOCK_PROMOTION"), result.getAppliedPromotions());
    }

    @Test
    void finalPrice_correct_runningTotalEqualsSubtotalMinusDiscount() {
        PricingContextDTO context = buildContext();
        doAnswer(invocation -> {
            PricingContextDTO ctx = invocation.getArgument(0);
            ctx.applyDiscount(new BigDecimal("40.00"), "MOCK_PROMOTION");
            return null;
        }).when(promotionPipeline).execute(context);

        PricingContextDTO result = pricingService.calculate(context);

        assertEquals(0, new BigDecimal("210.00").compareTo(result.getRunningTotal()));
        ArgumentCaptor<PricingContextDTO> captor = ArgumentCaptor.forClass(PricingContextDTO.class);
        verify(promotionPipeline).execute(captor.capture());
        assertEquals(0, new BigDecimal("250.00").compareTo(captor.getValue().getSubtotal()));
    }

    private PricingContextDTO buildContext() {
        PricingContextDTO context = new PricingContextDTO();
        OrderItemDTO itemA = new OrderItemDTO();
        itemA.setSku("A100");
        itemA.setPrice(new BigDecimal("100.00"));
        itemA.setQuantity(2);
        OrderItemDTO itemB = new OrderItemDTO();
        itemB.setSku("B200");
        itemB.setPrice(new BigDecimal("50.00"));
        itemB.setQuantity(1);
        context.setItems(List.of(itemA, itemB));
        return context;
    }
}
