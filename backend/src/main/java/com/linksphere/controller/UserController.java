package com.linksphere.controller;

import com.linksphere.dto.ApiResponse;
import com.linksphere.dto.UpdateProfileRequest;
import com.linksphere.dto.UserDto;
import com.linksphere.dto.UserSummaryDto;
import com.linksphere.entity.User;
import com.linksphere.security.CurrentUser;
import com.linksphere.security.UserPrincipal;
import com.linksphere.service.UserService;
import com.linksphere.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User & Profile APIs", description = "Endpoints for retrieving and updating professional user profiles")
public class UserController {

    private final UserService userService;
    private final SecurityUtils securityUtils;

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        UserDto profile = userService.getCurrentUserProfile(currentUser);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user profile by ID")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id, @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        UserDto userDto = userService.getUserById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(userDto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update logged-in user profile details")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProfileRequest request,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        UserDto updated = userService.updateProfile(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/search")
    @Operation(summary = "Search users by name, headline, location, or skill")
    public ResponseEntity<ApiResponse<Page<UserSummaryDto>>> searchUsers(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        Page<UserSummaryDto> results = userService.searchUsers(keyword, page, size, currentUser);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/recommended")
    @Operation(summary = "Get recommended professionals to connect with")
    public ResponseEntity<ApiResponse<List<UserSummaryDto>>> getRecommendedUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        List<UserSummaryDto> recommended = userService.getRecommendedUsers(page, size, currentUser);
        return ResponseEntity.ok(ApiResponse.success(recommended));
    }
}
