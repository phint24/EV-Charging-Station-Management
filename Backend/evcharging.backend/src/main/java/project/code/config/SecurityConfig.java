package project.code.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    // Đường dẫn "công khai" (public), không cần xác thực
    private static final String[] PUBLIC_URLS = {
            "/api/auth/**"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF (vì dùng API)
                .csrf(csrf -> csrf.disable())

                // 2. Định nghĩa các đường dẫn được phép
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_URLS).permitAll() // Cho phép các URL public
                        .anyRequest().authenticated() // Bắt buộc xác thực cho tất cả request còn lại
                )

                // 3. Cấu hình session là STATELESS (không lưu session, vì dùng JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 4. Cung cấp AuthenticationProvider
                .authenticationProvider(authenticationProvider)

                // 5. Thêm bộ lọc JWT của chúng ta vào *trước* bộ lọc mặc định của Spring
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}