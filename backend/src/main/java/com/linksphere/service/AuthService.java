package com.linksphere.service;

import com.linksphere.dto.AuthResponse;
import com.linksphere.dto.LoginRequest;
import com.linksphere.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
