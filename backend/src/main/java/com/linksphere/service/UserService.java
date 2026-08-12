package com.linksphere.service;

import com.linksphere.dto.UpdateProfileRequest;
import com.linksphere.dto.UserDto;
import com.linksphere.dto.UserSummaryDto;
import com.linksphere.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {
    UserDto getUserById(Long id, User currentUser);
    UserDto getCurrentUserProfile(User currentUser);
    UserDto updateProfile(Long id, UpdateProfileRequest request, User currentUser);
    Page<UserSummaryDto> searchUsers(String keyword, int page, int size, User currentUser);
    List<UserSummaryDto> getRecommendedUsers(int page, int size, User currentUser);
}
