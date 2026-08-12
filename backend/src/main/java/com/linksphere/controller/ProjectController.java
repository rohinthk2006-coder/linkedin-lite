package com.linksphere.controller;

import com.linksphere.dto.ApiResponse;
import com.linksphere.dto.ProjectDto;
import com.linksphere.dto.ProjectRequest;
import com.linksphere.entity.User;
import com.linksphere.security.CurrentUser;
import com.linksphere.security.UserPrincipal;
import com.linksphere.service.ProjectService;
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
@Tag(name = "Project APIs", description = "CRUD operations for user portfolio projects")
public class ProjectController {

    private final ProjectService projectService;
    private final SecurityUtils securityUtils;

    @GetMapping("/users/{userId}/projects")
    @Operation(summary = "Get user portfolio projects")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getProjectsByUserId(@PathVariable Long userId) {
        List<ProjectDto> projects = projectService.getProjectsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @PostMapping("/users/{userId}/projects")
    @Operation(summary = "Add a portfolio project")
    public ResponseEntity<ApiResponse<ProjectDto>> addProject(
            @PathVariable Long userId,
            @Valid @RequestBody ProjectRequest request,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        ProjectDto created = projectService.addProject(userId, request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Project added successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/projects/{id}")
    @Operation(summary = "Update a project")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        ProjectDto updated = projectService.updateProject(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updated));
    }

    @DeleteMapping("/projects/{id}")
    @Operation(summary = "Delete a project")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable Long id,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        projectService.deleteProject(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }
}
