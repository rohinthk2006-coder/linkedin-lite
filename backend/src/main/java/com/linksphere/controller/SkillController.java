package com.linksphere.controller;

import com.linksphere.dto.AddSkillRequest;
import com.linksphere.dto.ApiResponse;
import com.linksphere.dto.SkillDto;
import com.linksphere.entity.User;
import com.linksphere.security.CurrentUser;
import com.linksphere.security.UserPrincipal;
import com.linksphere.service.SkillService;
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
@Tag(name = "Skill APIs", description = "Operations for user profile skills")
public class SkillController {

    private final SkillService skillService;
    private final SecurityUtils securityUtils;

    @GetMapping("/skills")
    @Operation(summary = "Get list of all master skills in the system")
    public ResponseEntity<ApiResponse<List<SkillDto>>> getAllSkills() {
        List<SkillDto> skills = skillService.getAllSkills();
        return ResponseEntity.ok(ApiResponse.success(skills));
    }

    @GetMapping("/users/{userId}/skills")
    @Operation(summary = "Get skills of a specific user")
    public ResponseEntity<ApiResponse<List<SkillDto>>> getUserSkills(@PathVariable Long userId) {
        List<SkillDto> skills = skillService.getUserSkills(userId);
        return ResponseEntity.ok(ApiResponse.success(skills));
    }

    @PostMapping("/users/{userId}/skills")
    @Operation(summary = "Add a skill to user profile")
    public ResponseEntity<ApiResponse<SkillDto>> addSkillToUser(
            @PathVariable Long userId,
            @Valid @RequestBody AddSkillRequest request,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        SkillDto added = skillService.addSkillToUser(userId, request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Skill added successfully", added), HttpStatus.CREATED);
    }

    @DeleteMapping("/users/{userId}/skills/{skillId}")
    @Operation(summary = "Remove a skill from user profile")
    public ResponseEntity<ApiResponse<Void>> removeSkillFromUser(
            @PathVariable Long userId,
            @PathVariable Long skillId,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        skillService.removeSkillFromUser(userId, skillId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Skill removed successfully", null));
    }
}
