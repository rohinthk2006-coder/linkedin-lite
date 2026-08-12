package com.linksphere.controller;

import com.linksphere.dto.ApiResponse;
import com.linksphere.dto.EducationDto;
import com.linksphere.dto.EducationRequest;
import com.linksphere.entity.User;
import com.linksphere.security.CurrentUser;
import com.linksphere.security.UserPrincipal;
import com.linksphere.service.EducationService;
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
@Tag(name = "Education APIs", description = "CRUD operations for education profile records")
public class EducationController {

    private final EducationService educationService;
    private final SecurityUtils securityUtils;

    @GetMapping("/users/{userId}/education")
    @Operation(summary = "Get user education records")
    public ResponseEntity<ApiResponse<List<EducationDto>>> getEducationsByUserId(@PathVariable Long userId) {
        List<EducationDto> educations = educationService.getEducationsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(educations));
    }

    @PostMapping("/users/{userId}/education")
    @Operation(summary = "Add an education record to profile")
    public ResponseEntity<ApiResponse<EducationDto>> addEducation(
            @PathVariable Long userId,
            @Valid @RequestBody EducationRequest request,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        EducationDto created = educationService.addEducation(userId, request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Education record added successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/education/{id}")
    @Operation(summary = "Update an education record")
    public ResponseEntity<ApiResponse<EducationDto>> updateEducation(
            @PathVariable Long id,
            @Valid @RequestBody EducationRequest request,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        EducationDto updated = educationService.updateEducation(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Education record updated successfully", updated));
    }

    @DeleteMapping("/education/{id}")
    @Operation(summary = "Delete an education record")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(
            @PathVariable Long id,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        educationService.deleteEducation(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Education record deleted successfully", null));
    }
}
