package com.example.order_pricing_and_promotion_engine.service;

import com.example.order_pricing_and_promotion_engine.dto.CreateOrderRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.CustomerType;
import com.example.order_pricing_and_promotion_engine.dto.OrderItemDTO;
import com.example.order_pricing_and_promotion_engine.dto.OrderRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.OrderResponseDTO;
import com.example.order_pricing_and_promotion_engine.dto.PricingContextDTO;
import com.example.order_pricing_and_promotion_engine.dto.UpdateOrderRequestDTO;
import com.example.order_pricing_and_promotion_engine.entity.Order;
import com.example.order_pricing_and_promotion_engine.entity.OrderItem;
import com.example.order_pricing_and_promotion_engine.exception.ResourceNotFoundException;
import com.example.order_pricing_and_promotion_engine.mapper.OrderMapper;
import com.example.order_pricing_and_promotion_engine.repository.OrderRepository;
import com.example.order_pricing_and_promotion_engine.service.impl.OrderServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private PricingService pricingService;
    @Mock
    private OrderMapper orderMapper;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    void createOrder_success_orderCreatedAndMappedResponseReturned() {
        CreateOrderRequestDTO request = new CreateOrderRequestDTO();
        request.setCustomerType(CustomerType.VIP);
        request.setItems(List.of(new OrderItemDTO()));

        PricingContextDTO pricingContext = new PricingContextDTO();
        pricingContext.setSubtotal(new BigDecimal("250.00"));
        pricingContext.setRunningTotal(new BigDecimal("250.00"));
        pricingContext.applyDiscount(new BigDecimal("35.00"), "MOCK_PROMOTION");
        Order orderToSave = new Order();
        OrderItem orderItem = new OrderItem();
        orderToSave.setItems(List.of(orderItem));

        Order savedOrder = new Order();
        savedOrder.setId(1L);
        OrderResponseDTO response = new OrderResponseDTO();
        response.setId(1L);

        when(orderMapper.toPricingContext(any(OrderRequestDTO.class))).thenReturn(pricingContext);
        when(pricingService.calculate(pricingContext)).thenReturn(pricingContext);
        when(orderMapper.toEntity(request)).thenReturn(orderToSave);
        when(orderRepository.save(orderToSave)).thenReturn(savedOrder);
        when(orderMapper.toOrderResponse(savedOrder)).thenReturn(response);

        OrderResponseDTO result = orderService.create(request);

        assertEquals(1L, result.getId());
        assertEquals(orderToSave, orderItem.getOrder());
        assertEquals(0, new BigDecimal("250.00").compareTo(orderToSave.getSubtotal()));
        assertEquals(0, new BigDecimal("35.00").compareTo(orderToSave.getDiscount()));
        assertEquals(0, new BigDecimal("215.00").compareTo(orderToSave.getFinalPrice()));
        verify(pricingService).calculate(pricingContext);
        verify(orderMapper).toEntity(request);
        verify(orderRepository).save(orderToSave);
        verify(orderMapper).toOrderResponse(savedOrder);
    }

    @Test
    void getOrderById_success_orderFoundAndMappedResponseReturned() {
        Order order = new Order();
        order.setId(10L);
        OrderResponseDTO response = new OrderResponseDTO();
        response.setId(10L);

        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(orderMapper.toOrderResponse(order)).thenReturn(response);

        OrderResponseDTO result = orderService.getById(10L);

        assertEquals(10L, result.getId());
        verify(orderRepository).findById(10L);
        verify(orderMapper).toOrderResponse(order);
    }

    @Test
    void getOrderById_notFound_throwsResourceNotFoundException() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orderService.getById(99L));
        verify(orderRepository).findById(99L);
        verify(orderMapper, never()).toOrderResponse(any(Order.class));
    }

    @Test
    void updateOrder_success_orderUpdatedAndSaved() {
        UpdateOrderRequestDTO request = new UpdateOrderRequestDTO();
        request.setCustomerType(CustomerType.NORMAL);
        OrderItemDTO itemDTO = new OrderItemDTO();
        itemDTO.setSku("A100");
        itemDTO.setPrice(new BigDecimal("50.00"));
        itemDTO.setQuantity(3);
        request.setItems(List.of(itemDTO));

        Order existing = new Order();
        existing.setId(2L);

        OrderItem mappedItem = new OrderItem();
        mappedItem.setSku("A100");
        List<OrderItem> mappedItems = List.of(mappedItem);

        OrderResponseDTO response = new OrderResponseDTO();
        response.setId(2L);

        when(orderRepository.findById(2L)).thenReturn(Optional.of(existing));
        when(orderMapper.toOrderItemEntities(request.getItems())).thenReturn(mappedItems);
        when(orderRepository.save(existing)).thenReturn(existing);
        when(orderMapper.toOrderResponse(existing)).thenReturn(response);

        OrderResponseDTO result = orderService.update(2L, request);

        assertEquals(2L, result.getId());
        assertEquals(existing, mappedItem.getOrder());
        verify(orderMapper).updateEntity(request, existing);
        verify(orderMapper).toOrderItemEntities(request.getItems());
        verify(orderRepository).save(existing);
        verify(orderMapper).toOrderResponse(existing);
    }

    @Test
    void deleteOrder_success_existingOrderDeleted() {
        Order existing = new Order();
        existing.setId(3L);
        when(orderRepository.findById(3L)).thenReturn(Optional.of(existing));

        orderService.delete(3L);

        verify(orderRepository).findById(3L);
        verify(orderRepository).delete(eq(existing));
    }
}
