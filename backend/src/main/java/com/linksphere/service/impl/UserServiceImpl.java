package com.linksphere.service.impl;

import com.linksphere.dto.UpdateProfileRequest;
import com.linksphere.dto.UserDto;
import com.linksphere.dto.UserSummaryDto;
import com.linksphere.entity.User;
import com.linksphere.exception.ResourceNotFoundException;
import com.linksphere.exception.UnauthorizedException;
import com.linksphere.mapper.EntityDtoMapper;
import com.linksphere.repository.ConnectionRepository;
import com.linksphere.repository.UserRepository;
import com.linksphere.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ConnectionRepository connectionRepository;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id, User currentUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapper.toUserDto(user, currentUser, connectionRepository);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getCurrentUserProfile(User currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
        return mapper.toUserDto(user, user, connectionRepository);
    }

    @Override
    @Transactional
    public UserDto updateProfile(Long id, UpdateProfileRequest request, User currentUser) {
        if (!currentUser.getId().equals(id)) {
            throw new UnauthorizedException("You are not authorized to update another user's profile");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        if (request.getHeadline() != null) user.setHeadline(request.getHeadline());
        if (request.getAbout() != null) user.setAbout(request.getAbout());
        if (request.getLocation() != null) user.setLocation(request.getLocation());
        if (request.getProfileImage() != null) user.setProfileImage(request.getProfileImage());

        User updatedUser = userRepository.save(user);
        return mapper.toUserDto(updatedUser, currentUser, connectionRepository);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryDto> searchUsers(String keyword, int page, int size, User currentUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("firstName").ascending());
        Page<User> usersPage = userRepository.searchUsers(keyword != null ? keyword.trim() : "", pageable);
        return usersPage.map(u -> mapper.toUserSummaryDto(u, currentUser, connectionRepository));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSummaryDto> getRecommendedUsers(int page, int size, User currentUser) {
        Pageable pageable = PageRequest.of(page, size);
        List<User> users = userRepository.findRecommendedUsers(currentUser.getId(), pageable);
        return users.stream()
                .map(u -> mapper.toUserSummaryDto(u, currentUser, connectionRepository))
                .collect(Collectors.toList());
    }
}
