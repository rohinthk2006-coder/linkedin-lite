package com.linksphere.dto;

import com.linksphere.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {
    private Long id;
    private UserSummaryDto sender;
    private NotificationType type;
    private String message;
    private Long referenceId;
    private boolean isRead;
    private LocalDateTime createdAt;
}
