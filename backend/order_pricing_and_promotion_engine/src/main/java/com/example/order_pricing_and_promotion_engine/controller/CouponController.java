package com.example.order_pricing_and_promotion_engine.controller;

import com.example.order_pricing_and_promotion_engine.dto.CouponResponseDTO;
import com.example.order_pricing_and_promotion_engine.dto.CreateCouponRequestDTO;
import com.example.order_pricing_and_promotion_engine.dto.UpdateCouponRequestDTO;
import com.example.order_pricing_and_promotion_engine.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping
    public ResponseEntity<CouponResponseDTO> create(@Valid @RequestBody CreateCouponRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(couponService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<CouponResponseDTO>> getAll() {
        return ResponseEntity.ok(couponService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CouponResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(couponService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CouponResponseDTO> update(@PathVariable Long id, @Valid @RequestBody UpdateCouponRequestDTO request) {
        return ResponseEntity.ok(couponService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        couponService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
