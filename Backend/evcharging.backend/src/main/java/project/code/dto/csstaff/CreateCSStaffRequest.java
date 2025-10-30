package project.code.dto.csstaff;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateCSStaffRequest(

        @NotBlank(message = "Tên không được để trống")
        String name,

        @Email(message = "Email không đúng định dạng")
        @NotBlank(message = "Email không được để trống")
        String email,

        @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
        @NotBlank(message = "Mật khẩu không được để trống")
        String password,

        @NotBlank(message = "Số điện thoại không được để trống")
        String phoneNumber,

        @NotNull(message = "ID trạm sạc không được để trống")
        Long stationId
) {

}