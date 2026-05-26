package com.example.order_pricing_and_promotion_engine.mapper;

import com.example.order_pricing_and_promotion_engine.dto.CouponResponseDTO;
import com.example.order_pricing_and_promotion_engine.dto.CreateCouponRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.UpdateCouponRequestDTO;
import com.example.order_pricing_and_promotion_engine.entity.Coupon;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CouponMapper {

    Coupon toEntity(CreateCouponRequestDTO request);

    CouponResponseDTO toResponse(Coupon coupon);

    @Mapping(target = "id", ignore = true)
    void updateEntity(UpdateCouponRequestDTO request, @MappingTarget Coupon coupon);
}
