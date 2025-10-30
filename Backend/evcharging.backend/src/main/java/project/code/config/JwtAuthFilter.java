package project.code.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor // Tự động @Autowired các trường final
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtConfig jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Kiểm tra header 'Authorization'
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // Bỏ qua và cho request đi tiếp
            return;
        }

        // 2. Lấy token từ header
        jwt = authHeader.substring(7); // Bỏ qua "Bearer "

        // 3. Trích xuất email từ token
        userEmail = jwtService.extractEmail(jwt);

        // 4. Nếu có email và user chưa được xác thực (chưa login)
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Lấy thông tin UserDetails từ database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 5. Kiểm tra token có hợp lệ không
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // Tạo một đối tượng xác thực
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // Không cần credentials (password)
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // 6. Lưu thông tin xác thực vào SecurityContext
                // Spring Security sẽ hiểu là user này đã được đăng nhập
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response); // Cho request đi tiếp
    }
}