package project.code.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// (MỚI) Import thêm HttpMethod
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// Import thêm các class cho CORS
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    // Đường dẫn "công khai" (public), không cần xác thực
    private static final String[] PUBLIC_URLS = {
            "/api/auth/**",
        //     "/api/charge-sessions/**"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Thêm cấu hình CORS ở đây
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Tắt CSRF (vì dùng API)
                .csrf(csrf -> csrf.disable())

                // 3. (ĐÃ SỬA) Định nghĩa các đường dẫn được phép
                .authorizeHttpRequests(auth -> auth
                        // (MỚI) Luôn luôn cho phép các request OPTIONS (pre-flight)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                        .requestMatchers(PUBLIC_URLS).permitAll() // Cho phép các URL public
                        .requestMatchers("/api/charge-sessions/**").hasRole("DRIVER")
                        .anyRequest().authenticated() // Bắt buộc xác thực cho tất cả request còn lại
                )

                // 4. Cấu hình session là STATELESS (không lưu session, vì dùng JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 5. Cung cấp AuthenticationProvider
                .authenticationProvider(authenticationProvider)

                // 6. Thêm bộ lọc JWT của chúng ta vào *trước* bộ lọc mặc định của Spring
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 7. Bean cấu hình CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Cho phép request từ frontend (thay 5173 bằng port của bạn nếu khác)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000")); 
        
        // (SỬA LẠI) Đảm bảo OPTIONS có trong danh sách
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Áp dụng cho tất cả các đường dẫn
        return source;
    }
}


// package project.code.config;

// import lombok.RequiredArgsConstructor;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
// import org.springframework.security.authentication.AuthenticationProvider;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// // (MỚI) Import thêm các class cho CORS
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
// import java.util.Arrays;

// @Configuration
// @EnableWebSecurity
// @RequiredArgsConstructor
// @EnableMethodSecurity
// public class SecurityConfig {

//     private final JwtAuthFilter jwtAuthFilter;
//     private final AuthenticationProvider authenticationProvider;

//     // Đường dẫn "công khai" (public), không cần xác thực
//     private static final String[] PUBLIC_URLS = {
//             "/api/auth/**",
//             "/api/charge-sessions/**"
//     };

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//                 // (MỚI) 1. Thêm cấu hình CORS ở đây
//                 .cors(cors -> cors.configurationSource(corsConfigurationSource()))

//                 // 2. Tắt CSRF (vì dùng API)
//                 .csrf(csrf -> csrf.disable())

//                 // 3. Định nghĩa các đường dẫn được phép
//                 .authorizeHttpRequests(auth -> auth
//                         .requestMatchers(PUBLIC_URLS).permitAll() // Cho phép các URL public
//                         .anyRequest().authenticated() // Bắt buộc xác thực cho tất cả request còn lại
//                 )

//                 // 4. Cấu hình session là STATELESS (không lưu session, vì dùng JWT)
//                 .sessionManagement(session -> session
//                         .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                 )

//                 // 5. Cung cấp AuthenticationProvider
//                 .authenticationProvider(authenticationProvider)

//                 // 6. Thêm bộ lọc JWT của chúng ta vào *trước* bộ lọc mặc định của Spring
//                 .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

//         return http.build();
//     }

//     // (MỚI) 7. Bean cấu hình CORS
//     @Bean
//     public CorsConfigurationSource corsConfigurationSource() {
//         CorsConfiguration configuration = new CorsConfiguration();
        
//         // Cho phép request từ frontend (thay 5173 bằng port của bạn nếu khác)
//         configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000")); 
        
//         configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//         configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
//         configuration.setAllowCredentials(true); 

//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         source.registerCorsConfiguration("/**", configuration); // Áp dụng cho tất cả các đường dẫn
//         return source;
//     }
// }


// package project.code.config;

// import lombok.RequiredArgsConstructor;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
// import org.springframework.security.authentication.AuthenticationProvider;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// // (MỚI) Import thêm các class cho CORS
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
// import java.util.Arrays;

// @Configuration
// @EnableWebSecurity
// @RequiredArgsConstructor
// @EnableMethodSecurity
// public class SecurityConfig {

//     private final JwtAuthFilter jwtAuthFilter;
//     private final AuthenticationProvider authenticationProvider;

//     // Đường dẫn "công khai" (public), không cần xác thực
//     private static final String[] PUBLIC_URLS = {
//             "/api/auth/**",
//             "/api/charge-sessions/**"
//     };

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//                 .cors(cors -> cors.configurationSource(CorsConfigurationSource()))
//                 // 1. Tắt CSRF (vì dùng API)
//                 .csrf(csrf -> csrf.disable())

//                 // 2. Định nghĩa các đường dẫn được phép
//                 .authorizeHttpRequests(auth -> auth
//                         .requestMatchers(PUBLIC_URLS).permitAll() // Cho phép các URL public
//                         .anyRequest().authenticated() // Bắt buộc xác thực cho tất cả request còn lại
//                 )

//                 // 3. Cấu hình session là STATELESS (không lưu session, vì dùng JWT)
//                 .sessionManagement(session -> session
//                         .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                 )

//                 // 4. Cung cấp AuthenticationProvider
//                 .authenticationProvider(authenticationProvider)

//                 // 5. Thêm bộ lọc JWT của chúng ta vào *trước* bộ lọc mặc định của Spring
//                 .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

//         return http.build();
//     }
// }