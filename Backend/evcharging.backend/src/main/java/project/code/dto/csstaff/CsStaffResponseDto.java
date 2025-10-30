package project.code.dto.csstaff;

import project.code.dto.UserSummaryDto;
import project.code.dto.StationSummaryDto;

public record CsStaffResponseDto(
        Long id,
        UserSummaryDto userAccount,
        String phoneNumber,
        StationSummaryDto assignedStation
) {}