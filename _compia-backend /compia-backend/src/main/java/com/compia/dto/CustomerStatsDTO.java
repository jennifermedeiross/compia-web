package com.compia.dto;

import java.math.BigDecimal;

public record CustomerStatsDTO(
        Long id,
        String name,
        String email,
        String phone,
        Long orders,
        BigDecimal totalSpent
) {}
