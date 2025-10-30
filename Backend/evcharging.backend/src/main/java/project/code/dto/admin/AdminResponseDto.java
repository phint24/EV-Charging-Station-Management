package project.code.dto.admin;

import project.code.dto.UserSummaryDto;

public record AdminResponseDto(
        Long id,
        UserSummaryDto userAccount
) {}