package com.linksphere.service;

import com.linksphere.dto.NotificationDto;
import com.linksphere.entity.User;
import com.linksphere.enums.NotificationType;

import java.util.List;

public interface NotificationService {
    void createNotification(User recipient, User sender, NotificationType type, String message, Long referenceId);
    List<NotificationDto> getUserNotifications(User currentUser);
    long getUnreadCount(User currentUser);
    NotificationDto markAsRead(Long id, User currentUser);
    void markAllAsRead(User currentUser);
}
