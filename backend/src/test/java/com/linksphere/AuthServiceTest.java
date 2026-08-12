package com.linksphere;

import com.linksphere.dto.AuthResponse;
import com.linksphere.dto.LoginRequest;
import com.linksphere.dto.RegisterRequest;
import com.linksphere.entity.User;
import com.linksphere.enums.Role;
import com.linksphere.exception.ConflictException;
import com.linksphere.mapper.EntityDtoMapper;
import com.linksphere.repository.ConnectionRepository;
import com.linksphere.repository.UserRepository;
import com.linksphere.security.JwtTokenProvider;
import com.linksphere.security.UserPrincipal;
import com.linksphere.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private EntityDtoMapper mapper;

    @Mock
    private ConnectionRepository connectionRepository;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User mockUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setEmail("john.doe@example.com");
        registerRequest.setPassword("password123");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("john.doe@example.com");
        loginRequest.setPassword("password123");

        mockUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("encoded_pass")
                .role(Role.ROLE_USER)
                .build();
    }

    @Test
    void register_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(tokenProvider.generateTokenFromUserId(1L)).thenReturn("mock_token");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("mock_token", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsConflictException() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("jwt_auth_token");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("jwt_auth_token", response.getToken());
    }
}
