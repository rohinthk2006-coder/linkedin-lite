package com.linksphere.controller;

import com.linksphere.dto.ApiResponse;
import com.linksphere.dto.CertificationDto;
import com.linksphere.dto.CertificationRequest;
import com.linksphere.entity.User;
import com.linksphere.security.CurrentUser;
import com.linksphere.security.UserPrincipal;
import com.linksphere.service.CertificationService;
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
@Tag(name = "Certification APIs", description = "CRUD operations for professional certifications")
public class CertificationController {

    private final CertificationService certificationService;
    private final SecurityUtils securityUtils;

    @GetMapping("/users/{userId}/certifications")
    @Operation(summary = "Get user certifications")
    public ResponseEntity<ApiResponse<List<CertificationDto>>> getCertificationsByUserId(@PathVariable Long userId) {
        List<CertificationDto> certifications = certificationService.getCertificationsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(certifications));
    }

    @PostMapping("/users/{userId}/certifications")
    @Operation(summary = "Add a professional certification")
    public ResponseEntity<ApiResponse<CertificationDto>> addCertification(
            @PathVariable Long userId,
            @Valid @RequestBody CertificationRequest request,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        CertificationDto created = certificationService.addCertification(userId, request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Certification added successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/certifications/{id}")
    @Operation(summary = "Update a certification")
    public ResponseEntity<ApiResponse<CertificationDto>> updateCertification(
            @PathVariable Long id,
            @Valid @RequestBody CertificationRequest request,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        CertificationDto updated = certificationService.updateCertification(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Certification updated successfully", updated));
    }

    @DeleteMapping("/certifications/{id}")
    @Operation(summary = "Delete a certification")
    public ResponseEntity<ApiResponse<Void>> deleteCertification(
            @PathVariable Long id,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        certificationService.deleteCertification(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Certification deleted successfully", null));
    }
}
