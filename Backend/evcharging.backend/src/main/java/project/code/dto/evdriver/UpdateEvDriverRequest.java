package project.code.dto.evdriver;

import jakarta.validation.constraints.Size;

public record UpdateEvDriverRequest(
        @Size(max = 100, message = "Tên không được vượt quá 100 ký tự")
        String name,

        @Size(min=10, max = 11, message = "Số điện thoại phải có 10 chữ số")
        String phoneNumber
) {}