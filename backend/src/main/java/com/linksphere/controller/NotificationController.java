package com.linksphere.controller;

import com.linksphere.dto.ApiResponse;
import com.linksphere.dto.NotificationDto;
import com.linksphere.entity.User;
import com.linksphere.security.CurrentUser;
import com.linksphere.security.UserPrincipal;
import com.linksphere.service.NotificationService;
import com.linksphere.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification APIs", description = "Endpoints for managing user notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final SecurityUtils securityUtils;

    @GetMapping
    @Operation(summary = "Get list of all notifications for authenticated user")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getUserNotifications(@CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        List<NotificationDto> notifications = notificationService.getUserNotifications(currentUser);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get count of unread notifications")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        long count = notificationService.getUnreadCount(currentUser);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark a single notification as read")
    public ResponseEntity<ApiResponse<NotificationDto>> markAsRead(
            @PathVariable Long id,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        NotificationDto updated = notificationService.markAsRead(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", updated));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        notificationService.markAllAsRead(currentUser);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}
