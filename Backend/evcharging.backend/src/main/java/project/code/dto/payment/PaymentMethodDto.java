package project.code.dto.payment;

import project.code.model.enums.PaymentType;

public record PaymentMethodDto(
        Long id,
        PaymentType type,
        String provider,
        boolean isDefault
) {}