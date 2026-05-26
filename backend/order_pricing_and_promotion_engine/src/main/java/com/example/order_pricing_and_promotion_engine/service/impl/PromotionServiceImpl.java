package com.example.order_pricing_and_promotion_engine.service.impl;

import com.example.order_pricing_and_promotion_engine.dto.CreatePromotionRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.PromotionResponseDTO;
import com.example.order_pricing_and_promotion_engine.dto.UpdatePromotionRequestDTO;
import com.example.order_pricing_and_promotion_engine.entity.Promotion;
import com.example.order_pricing_and_promotion_engine.exception.ResourceNotFoundException;
import com.example.order_pricing_and_promotion_engine.mapper.PromotionMapper;
import com.example.order_pricing_and_promotion_engine.repository.PromotionRepository;
import com.example.order_pricing_and_promotion_engine.service.PromotionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;

    public PromotionServiceImpl(PromotionRepository promotionRepository, PromotionMapper promotionMapper) {
        this.promotionRepository = promotionRepository;
        this.promotionMapper = promotionMapper;
    }

    @Override
    @Transactional
    public PromotionResponseDTO create(CreatePromotionRequestDTO request) {
        Promotion promotion = promotionMapper.toEntity(request);
        return promotionMapper.toResponse(promotionRepository.save(promotion));
    }

    @Override
    public List<PromotionResponseDTO> getAll() {
        return promotionRepository.findAll().stream()
                .map(promotionMapper::toResponse)
                .toList();
    }

    @Override
    public PromotionResponseDTO getById(Long id) {
        return promotionMapper.toResponse(findPromotion(id));
    }

    @Override
    @Transactional
    public PromotionResponseDTO update(Long id, UpdatePromotionRequestDTO request) {
        Promotion promotion = findPromotion(id);
        promotionMapper.updateEntity(request, promotion);
        return promotionMapper.toResponse(promotionRepository.save(promotion));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Promotion promotion = findPromotion(id);
        promotionRepository.delete(promotion);
    }

    private Promotion findPromotion(Long id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + id));
    }
}
