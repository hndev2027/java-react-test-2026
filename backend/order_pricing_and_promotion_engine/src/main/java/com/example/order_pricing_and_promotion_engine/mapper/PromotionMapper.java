package com.example.order_pricing_and_promotion_engine.mapper;

import com.example.order_pricing_and_promotion_engine.dto.CreatePromotionRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.PromotionResponseDTO;
import com.example.order_pricing_and_promotion_engine.dto.UpdatePromotionRequestDTO;
import com.example.order_pricing_and_promotion_engine.entity.Promotion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PromotionMapper {

    Promotion toEntity(CreatePromotionRequestDTO request);

    PromotionResponseDTO toResponse(Promotion promotion);

    @Mapping(target = "id", ignore = true)
    void updateEntity(UpdatePromotionRequestDTO request, @MappingTarget Promotion promotion);
}
