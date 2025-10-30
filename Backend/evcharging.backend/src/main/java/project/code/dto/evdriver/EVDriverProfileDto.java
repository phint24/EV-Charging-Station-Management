package project.code.dto.evdriver;

import project.code.dto.UserSummaryDto;

public record EVDriverProfileDto(
        Long id,
        UserSummaryDto userAccount,
        String phoneNumber,
        double walletBalance
) {}