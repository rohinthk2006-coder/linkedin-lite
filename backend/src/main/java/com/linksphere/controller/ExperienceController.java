package com.linksphere.controller;

import com.linksphere.dto.ApiResponse;
import com.linksphere.dto.ExperienceDto;
import com.linksphere.dto.ExperienceRequest;
import com.linksphere.entity.User;
import com.linksphere.security.CurrentUser;
import com.linksphere.security.UserPrincipal;
import com.linksphere.service.ExperienceService;
import com.linksphere.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Experience APIs", description = "CRUD operations for work experience profile records")
public class ExperienceController {

    private final ExperienceService experienceService;
    private final SecurityUtils securityUtils;

    @GetMapping("/users/{userId}/experience")
    @Operation(summary = "Get user work experience records")
    public ResponseEntity<ApiResponse<List<ExperienceDto>>> getExperiencesByUserId(@PathVariable Long userId) {
        List<ExperienceDto> experiences = experienceService.getExperiencesByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(experiences));
    }

    @PostMapping("/users/{userId}/experience")
    @Operation(summary = "Add a work experience record")
    public ResponseEntity<ApiResponse<ExperienceDto>> addExperience(
            @PathVariable Long userId,
            @Valid @RequestBody ExperienceRequest request,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        ExperienceDto created = experienceService.addExperience(userId, request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Experience record added successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/experience/{id}")
    @Operation(summary = "Update a work experience record")
    public ResponseEntity<ApiResponse<ExperienceDto>> updateExperience(
            @PathVariable Long id,
            @Valid @RequestBody ExperienceRequest request,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        ExperienceDto updated = experienceService.updateExperience(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Experience record updated successfully", updated));
    }

    @DeleteMapping("/experience/{id}")
    @Operation(summary = "Delete a work experience record")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(
            @PathVariable Long id,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        experienceService.deleteExperience(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Experience record deleted successfully", null));
    }
}
