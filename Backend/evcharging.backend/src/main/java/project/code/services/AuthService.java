//package project.code.services;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import project.code.config.JwtConfig;
//import project.code.dto.LoginRequest;
//import project.code.dto.LoginResponse;
//import project.code.dto.RegisterRequest;
//import project.code.model.enums.Role;
//import project.code.model.User;
//import project.code.repository.UserRepository;
//
//@Service
//@RequiredArgsConstructor
//public class AuthService {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final JwtConfig jwtConfig;
//    private final AuthenticationManager authenticationManager;
//
//    public LoginResponse register(RegisterRequest request) {
//        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
//            throw new IllegalArgumentException("Email đã được sử dụng");
//        }
//
//        var user = User.builder()
//                .name(request.getName())
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .role(Role.ROLE_EVDRIVER)
//                .build();
//
//        userRepository.save(user);
//
//        var jwtToken = jwtConfig.generateToken(user);
//
//        return LoginResponse.builder()
//                .token(jwtToken)
//                .email(user.getEmail())
//                .role(user.getRole().name())
//                .build();
//    }
//
//    public LoginResponse login(LoginRequest request) {
//        // 1. Xác thực (email, password)
//        // AuthenticationManager sẽ gọi UserDetailsService và PasswordEncoder để kiểm tra
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                        request.getEmail(),
//                        request.getPassword()
//                )
//        );
//
//        // 2. Nếu xác thực thành công, tìm lại user
//        var user = userRepository.findByEmail(request.getEmail())
//                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user"));
//
//        // 3. Tạo token
//        var jwtToken = jwtConfig.generateToken(user);
//
//        // 4. Trả về token
//        return LoginResponse.builder()
//                .token(jwtToken)
//                .email(user.getEmail())
//                .role(user.getRole().name())
//                .build();
//    }
//}

package project.code.services;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // (1) THÊM IMPORT

import project.code.config.JwtConfig; // (Hoặc JwtService)
import project.code.dto.LoginRequest;
import project.code.dto.LoginResponse;
import project.code.dto.RegisterRequest;
import project.code.model.enums.Role;
import project.code.model.User;
import project.code.model.EVDriver;
import project.code.repository.UserRepository;
import project.code.repository.EVDriverRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final EVDriverRepository evDriverRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtConfig jwtConfig;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }

        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_EVDRIVER)
                .build();
        User savedUser = userRepository.save(user);

        EVDriver driverProfile = EVDriver.builder()
                .userAccount(savedUser)
                .phoneNumber(null)
                .walletBalance(0.0)
                .build();

        evDriverRepository.save(driverProfile);
        var jwtToken = jwtConfig.generateToken(savedUser);

        return LoginResponse.builder()
                .token(jwtToken)
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .build();
    }

    public LoginResponse login(LoginRequest request) {
        logger.info("Attempting login for email: {}", request.getEmail());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            logger.info("Authentication successful for: {}", request.getEmail());

        } catch (BadCredentialsException e) {
            logger.error("!!! LỖI SAI MẬT KHẨU (BadCredentialsException) cho email: {} !!!", request.getEmail());
            throw e;
        } catch (UsernameNotFoundException e) {
            logger.error("User not found during authentication: {}", request.getEmail());
            throw e;
        } catch (Exception e) {
            logger.error("Authentication failed for email: {}. Error: {}", request.getEmail(), e.getMessage(), e);
            throw e;
        }

        var user = (User) userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User somehow not found after successful authentication"));

        var jwtToken = jwtConfig.generateToken(user);
        logger.info("JWT Token generated for: {}", request.getEmail());

        return LoginResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}