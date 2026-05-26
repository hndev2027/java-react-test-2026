package com.example.order_pricing_and_promotion_engine.service;

import com.example.order_pricing_and_promotion_engine.dto.CouponResponseDTO;
import com.example.order_pricing_and_promotion_engine.dto.CreateCouponRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.UpdateCouponRequestDTO;

import java.util.List;

public interface CouponService {
    CouponResponseDTO create(CreateCouponRequestDTO request);
    List<CouponResponseDTO> getAll();
    CouponResponseDTO getById(Long id);
    CouponResponseDTO update(Long id, UpdateCouponRequestDTO request);
    void delete(Long id);
}
