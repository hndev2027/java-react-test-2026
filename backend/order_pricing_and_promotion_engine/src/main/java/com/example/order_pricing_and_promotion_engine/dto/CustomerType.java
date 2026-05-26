package com.example.order_pricing_and_promotion_engine.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum CustomerType {
    NORMAL,
    VIP;

    @JsonCreator
    public static CustomerType fromJson(String value) {
        if (value == null) {
            return null;
        }
        return CustomerType.valueOf(value.trim().toUpperCase(Locale.ROOT));
    }

    @JsonValue
    public String toJson() {
        return name();
    }
}
