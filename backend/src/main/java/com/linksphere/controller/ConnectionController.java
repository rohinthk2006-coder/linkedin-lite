package com.linksphere.controller;

import com.linksphere.dto.ApiResponse;
import com.linksphere.dto.ConnectionDto;
import com.linksphere.dto.UserSummaryDto;
import com.linksphere.entity.User;
import com.linksphere.security.CurrentUser;
import com.linksphere.security.UserPrincipal;
import com.linksphere.service.ConnectionService;
import com.linksphere.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
@Tag(name = "Connection APIs", description = "Endpoints for managing professional networking connections")
public class ConnectionController {

    private final ConnectionService connectionService;
    private final SecurityUtils securityUtils;

    @PostMapping("/request/{userId}")
    @Operation(summary = "Send a connection request to a user")
    public ResponseEntity<ApiResponse<ConnectionDto>> sendConnectionRequest(
            @PathVariable Long userId,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        ConnectionDto created = connectionService.sendConnectionRequest(userId, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Connection request sent successfully", created), HttpStatus.CREATED);
    }

    @GetMapping("/pending")
    @Operation(summary = "Get all pending incoming connection requests")
    public ResponseEntity<ApiResponse<List<ConnectionDto>>> getPendingRequests(@CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        List<ConnectionDto> pending = connectionService.getPendingRequests(currentUser);
        return ResponseEntity.ok(ApiResponse.success(pending));
    }

    @PutMapping("/{id}/accept")
    @Operation(summary = "Accept a connection request")
    public ResponseEntity<ApiResponse<ConnectionDto>> acceptConnection(
            @PathVariable Long id,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        ConnectionDto accepted = connectionService.acceptConnection(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Connection request accepted", accepted));
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject a connection request")
    public ResponseEntity<ApiResponse<ConnectionDto>> rejectConnection(
            @PathVariable Long id,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        ConnectionDto rejected = connectionService.rejectConnection(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Connection request rejected", rejected));
    }

    @GetMapping
    @Operation(summary = "Get list of all accepted connections for current user")
    public ResponseEntity<ApiResponse<List<UserSummaryDto>>> getUserConnections(@CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        List<UserSummaryDto> connections = connectionService.getUserConnections(currentUser);
        return ResponseEntity.ok(ApiResponse.success(connections));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove a connection or cancel request")
    public ResponseEntity<ApiResponse<Void>> removeConnection(
            @PathVariable Long id,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        connectionService.removeConnection(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Connection removed successfully", null));
    }
}
