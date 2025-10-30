package project.code.dto;

import project.code.model.enums.Role;

public record UserSummaryDto(
        Long id,
        String name,
        String email,
        Role role
) {}