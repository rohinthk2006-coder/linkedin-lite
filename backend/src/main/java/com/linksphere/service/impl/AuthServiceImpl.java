package com.linksphere.service.impl;

import com.linksphere.dto.AuthResponse;
import com.linksphere.dto.LoginRequest;
import com.linksphere.dto.RegisterRequest;
import com.linksphere.dto.UserDto;
import com.linksphere.entity.User;
import com.linksphere.enums.Role;
import com.linksphere.exception.ConflictException;
import com.linksphere.mapper.EntityDtoMapper;
import com.linksphere.repository.ConnectionRepository;
import com.linksphere.repository.UserRepository;
import com.linksphere.security.JwtTokenProvider;
import com.linksphere.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EntityDtoMapper mapper;
    private final ConnectionRepository connectionRepository;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email address is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .headline(request.getHeadline())
                .location(request.getLocation())
                .role(Role.ROLE_USER)
                .build();

        User savedUser = userRepository.save(user);

        String token = tokenProvider.generateTokenFromUserId(savedUser.getId());
        UserDto userDto = mapper.toUserDto(savedUser, savedUser, connectionRepository);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userDto)
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim()).orElseThrow();
        UserDto userDto = mapper.toUserDto(user, user, connectionRepository);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userDto)
                .build();
    }
}
