package project.code.dto.csstaff;

public record UpdateCSStaffProfileRequest(
        String name,
        String phoneNumber,
        Long stationId
) {
}