package project.code.dto.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Dùng record cho DTO đơn giản, hoặc dùng @Data @Builder
public record CreateAdminRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @Size(min = 6) @NotBlank String password,
        String department,
        String employeeCode
) {}