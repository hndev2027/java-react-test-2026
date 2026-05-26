package com.example.order_pricing_and_promotion_engine.mapper;

import com.example.order_pricing_and_promotion_engine.dto.CreateOrderRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.OrderRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.OrderResponseDTO;
import com.example.order_pricing_and_promotion_engine.dto.UpdateOrderRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.PricingContextDTO;
import com.example.order_pricing_and_promotion_engine.entity.Order;
import com.example.order_pricing_and_promotion_engine.entity.OrderItem;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "subtotal", ignore = true)
    @Mapping(target = "discount", ignore = true)
    @Mapping(target = "runningTotal", ignore = true)
    @Mapping(target = "appliedPromotions", ignore = true)
    @Mapping(target = "appliedDiscounts", ignore = true)
    PricingContextDTO toPricingContext(OrderRequestDTO request);

    @Mapping(target = "finalPrice", source = "runningTotal")
    OrderResponseDTO toOrderResponse(PricingContextDTO context);

    Order toEntity(CreateOrderRequestDTO request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "items", ignore = true)
    void updateEntity(UpdateOrderRequestDTO request, @MappingTarget Order order);

    OrderResponseDTO toOrderResponse(Order order);

    OrderItem toOrderItemEntity(com.example.order_pricing_and_promotion_engine.dto.OrderItemDTO itemDTO);

    com.example.order_pricing_and_promotion_engine.dto.OrderItemDTO toOrderItemDTO(OrderItem orderItem);

    default List<OrderItem> toOrderItemEntities(List<com.example.order_pricing_and_promotion_engine.dto.OrderItemDTO> itemDTOs) {
        if (itemDTOs == null) {
            return new ArrayList<>();
        }
        List<OrderItem> items = new ArrayList<>();
        for (com.example.order_pricing_and_promotion_engine.dto.OrderItemDTO itemDTO : itemDTOs) {
            items.add(toOrderItemEntity(itemDTO));
        }
        return items;
    }

    @AfterMapping
    default void bindOrderToItems(@MappingTarget Order order) {
        if (order.getItems() == null) {
            return;
        }
        for (OrderItem item : order.getItems()) {
            item.setOrder(order);
        }
    }
}
