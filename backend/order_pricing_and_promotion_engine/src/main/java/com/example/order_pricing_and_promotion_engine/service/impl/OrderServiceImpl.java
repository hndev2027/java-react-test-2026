package com.example.order_pricing_and_promotion_engine.service.impl;

import com.example.order_pricing_and_promotion_engine.dto.CreateOrderRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.OrderRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.OrderResponseDTO;
import com.example.order_pricing_and_promotion_engine.dto.PricingContextDTO;
import com.example.order_pricing_and_promotion_engine.dto.UpdateOrderRequestDTO;
import com.example.order_pricing_and_promotion_engine.entity.Order;
import com.example.order_pricing_and_promotion_engine.entity.OrderItem;
import com.example.order_pricing_and_promotion_engine.exception.ResourceNotFoundException;
import com.example.order_pricing_and_promotion_engine.mapper.OrderMapper;
import com.example.order_pricing_and_promotion_engine.repository.OrderRepository;
import com.example.order_pricing_and_promotion_engine.service.OrderService;
import com.example.order_pricing_and_promotion_engine.service.PricingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final PricingService pricingService;
    private final OrderMapper orderMapper;

    public OrderServiceImpl(OrderRepository orderRepository, PricingService pricingService, OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.pricingService = pricingService;
        this.orderMapper = orderMapper;
    }

    @Override
    public OrderResponseDTO calculate(OrderRequestDTO request) {
        validate(request);
        PricingContextDTO context = orderMapper.toPricingContext(request);
        PricingContextDTO priced = pricingService.calculate(context);
        return orderMapper.toOrderResponse(priced);
    }

    @Override
    @Transactional
    public OrderResponseDTO create(CreateOrderRequestDTO request) {
        OrderRequestDTO orderRequest = toOrderRequest(request);
        validate(orderRequest);
        PricingContextDTO priced = pricingService.calculate(orderMapper.toPricingContext(orderRequest));
        Order order = orderMapper.toEntity(request);
        order.setSubtotal(priced.getSubtotal());
        order.setDiscount(priced.getDiscount());
        order.setFinalPrice(priced.getRunningTotal());
        attachOrderToItems(order);
        return orderMapper.toOrderResponse(orderRepository.save(order));
    }

    @Override
    public List<OrderResponseDTO> getAll() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toOrderResponse)
                .toList();
    }

    @Override
    public OrderResponseDTO getById(Long id) {
        return orderMapper.toOrderResponse(findOrder(id));
    }

    @Override
    @Transactional
    public OrderResponseDTO update(Long id, UpdateOrderRequestDTO request) {
        Order existing = findOrder(id);
        orderMapper.updateEntity(request, existing);
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            existing.setItems(orderMapper.toOrderItemEntities(request.getItems()));
            attachOrderToItems(existing);
        }
        return orderMapper.toOrderResponse(orderRepository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Order existing = findOrder(id);
        orderRepository.delete(existing);
    }

    private void validate(OrderRequestDTO request) {
        Objects.requireNonNull(request, "request must not be null");
        Objects.requireNonNull(request.getCustomerType(), "customerType must not be null");
        Objects.requireNonNull(request.getItems(), "items must not be null");
        if (request.getItems().isEmpty()) {
            throw new IllegalArgumentException("items must not be empty");
        }
    }

    private Order findOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    private OrderRequestDTO toOrderRequest(CreateOrderRequestDTO request) {
        OrderRequestDTO orderRequest = new OrderRequestDTO();
        orderRequest.setCustomerType(request.getCustomerType());
        orderRequest.setCouponCode(request.getCouponCode());
        orderRequest.setItems(request.getItems());
        return orderRequest;
    }

    private void attachOrderToItems(Order order) {
        if (order.getItems() == null) {
            return;
        }
        for (OrderItem item : order.getItems()) {
            item.setOrder(order);
        }
    }
}
