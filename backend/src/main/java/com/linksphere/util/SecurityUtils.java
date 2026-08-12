package com.linksphere.util;

import com.linksphere.entity.User;
import com.linksphere.repository.UserRepository;
import com.linksphere.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    public User getAuthenticatedUser(UserPrincipal principal) {
        if (principal == null) return null;
        return userRepository.findById(principal.getId()).orElse(null);
    }
}
