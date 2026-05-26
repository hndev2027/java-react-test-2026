package com.example.order_pricing_and_promotion_engine.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@AllArgsConstructor
public class ApiErrorResponseDTO {
    private String code;
    private String message;
    private Map<String, String> details;
    private int status;
    private LocalDateTime timestamp;
}
