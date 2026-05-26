package com.example.order_pricing_and_promotion_engine.service.impl;

import com.example.order_pricing_and_promotion_engine.dto.CouponResponseDTO;
import com.example.order_pricing_and_promotion_engine.dto.CreateCouponRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.UpdateCouponRequestDTO;
import com.example.order_pricing_and_promotion_engine.entity.Coupon;
import com.example.order_pricing_and_promotion_engine.exception.ResourceNotFoundException;
import com.example.order_pricing_and_promotion_engine.mapper.CouponMapper;
import com.example.order_pricing_and_promotion_engine.repository.CouponRepository;
import com.example.order_pricing_and_promotion_engine.service.CouponService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final CouponMapper couponMapper;

    public CouponServiceImpl(CouponRepository couponRepository, CouponMapper couponMapper) {
        this.couponRepository = couponRepository;
        this.couponMapper = couponMapper;
    }

    @Override
    @Transactional
    public CouponResponseDTO create(CreateCouponRequestDTO request) {
        Coupon coupon = couponMapper.toEntity(request);
        return couponMapper.toResponse(couponRepository.save(coupon));
    }

    @Override
    public List<CouponResponseDTO> getAll() {
        return couponRepository.findAll().stream()
                .map(couponMapper::toResponse)
                .toList();
    }

    @Override
    public CouponResponseDTO getById(Long id) {
        return couponMapper.toResponse(findCoupon(id));
    }

    @Override
    @Transactional
    public CouponResponseDTO update(Long id, UpdateCouponRequestDTO request) {
        Coupon coupon = findCoupon(id);
        couponMapper.updateEntity(request, coupon);
        return couponMapper.toResponse(couponRepository.save(coupon));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Coupon coupon = findCoupon(id);
        couponRepository.delete(coupon);
    }

    private Coupon findCoupon(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
    }
}
