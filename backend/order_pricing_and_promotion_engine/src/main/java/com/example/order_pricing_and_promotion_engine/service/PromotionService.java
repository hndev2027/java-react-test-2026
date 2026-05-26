package com.example.order_pricing_and_promotion_engine.service;

import com.example.order_pricing_and_promotion_engine.dto.CreatePromotionRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.PromotionResponseDTO;
import com.example.order_pricing_and_promotion_engine.dto.UpdatePromotionRequestDTO;

import java.util.List;

public interface PromotionService {
    PromotionResponseDTO create(CreatePromotionRequestDTO request);
    List<PromotionResponseDTO> getAll();
    PromotionResponseDTO getById(Long id);
    PromotionResponseDTO update(Long id, UpdatePromotionRequestDTO request);
    void delete(Long id);
}
