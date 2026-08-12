package com.linksphere.service.impl;

import com.linksphere.dto.NotificationDto;
import com.linksphere.entity.Notification;
import com.linksphere.entity.User;
import com.linksphere.enums.NotificationType;
import com.linksphere.exception.ResourceNotFoundException;
import com.linksphere.exception.UnauthorizedException;
import com.linksphere.mapper.EntityDtoMapper;
import com.linksphere.repository.NotificationRepository;
import com.linksphere.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional
    public void createNotification(User recipient, User sender, NotificationType type, String message, Long referenceId) {
        if (recipient.getId().equals(sender.getId())) {
            return; // Don't notify self actions
        }

        Notification notification = Notification.builder()
                .recipient(recipient)
                .sender(sender)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(User currentUser) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(currentUser.getId()).stream()
                .map(n -> mapper.toNotificationDto(n, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(User currentUser) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(currentUser.getId());
    }

    @Override
    @Transactional
    public NotificationDto markAsRead(Long id, User currentUser) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getRecipient().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You cannot mark another user's notification as read");
        }

        notification.setRead(true);
        return mapper.toNotificationDto(notificationRepository.save(notification), currentUser);
    }

    @Override
    @Transactional
    public void markAllAsRead(User currentUser) {
        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(currentUser.getId());
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}
