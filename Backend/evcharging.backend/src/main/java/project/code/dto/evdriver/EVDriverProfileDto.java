package project.code.dto.evdriver;

import project.code.dto.UserSummaryDto;
import project.code.dto.vehicle.VehicleDto;
import java.util.List;

public record EVDriverProfileDto(
        Long id,
        UserSummaryDto userAccount,
        String phoneNumber,
        double walletBalance,
        List<VehicleDto> vehicles
) {}