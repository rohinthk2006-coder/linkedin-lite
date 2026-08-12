package com.linksphere.service.impl;

import com.linksphere.dto.ConnectionDto;
import com.linksphere.dto.UserSummaryDto;
import com.linksphere.entity.Connection;
import com.linksphere.entity.User;
import com.linksphere.enums.ConnectionStatus;
import com.linksphere.enums.NotificationType;
import com.linksphere.exception.BadRequestException;
import com.linksphere.exception.ConflictException;
import com.linksphere.exception.ResourceNotFoundException;
import com.linksphere.exception.UnauthorizedException;
import com.linksphere.mapper.EntityDtoMapper;
import com.linksphere.repository.ConnectionRepository;
import com.linksphere.repository.UserRepository;
import com.linksphere.service.ConnectionService;
import com.linksphere.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConnectionServiceImpl implements ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional
    public ConnectionDto sendConnectionRequest(Long receiverId, User currentUser) {
        if (currentUser.getId().equals(receiverId)) {
            throw new BadRequestException("You cannot send a connection request to yourself");
        }

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        Optional<Connection> existingConn = connectionRepository.findConnectionBetween(currentUser.getId(), receiverId);
        if (existingConn.isPresent()) {
            Connection conn = existingConn.get();
            if (conn.getStatus() == ConnectionStatus.ACCEPTED) {
                throw new ConflictException("You are already connected with this user");
            } else if (conn.getStatus() == ConnectionStatus.PENDING) {
                throw new ConflictException("A connection request between you and this user is already pending");
            } else {
                // If rejected previously, re-open as PENDING
                conn.setSender(currentUser);
                conn.setReceiver(receiver);
                conn.setStatus(ConnectionStatus.PENDING);
                Connection saved = connectionRepository.save(conn);
                notificationService.createNotification(
                        receiver, currentUser, NotificationType.CONNECTION_REQUEST,
                        currentUser.getFirstName() + " " + currentUser.getLastName() + " sent you a connection request",
                        saved.getId()
                );
                return mapper.toConnectionDto(saved, currentUser, connectionRepository);
            }
        }

        Connection connection = Connection.builder()
                .sender(currentUser)
                .receiver(receiver)
                .status(ConnectionStatus.PENDING)
                .build();

        Connection saved = connectionRepository.save(connection);

        notificationService.createNotification(
                receiver, currentUser, NotificationType.CONNECTION_REQUEST,
                currentUser.getFirstName() + " " + currentUser.getLastName() + " sent you a connection request",
                saved.getId()
        );

        return mapper.toConnectionDto(saved, currentUser, connectionRepository);
    }

    @Override
    @Transactional
    public ConnectionDto acceptConnection(Long connectionId, User currentUser) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection request not found"));

        if (!connection.getReceiver().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only the recipient can accept a connection request");
        }

        connection.setStatus(ConnectionStatus.ACCEPTED);
        Connection saved = connectionRepository.save(connection);

        notificationService.createNotification(
                connection.getSender(), currentUser, NotificationType.CONNECTION_ACCEPT,
                currentUser.getFirstName() + " " + currentUser.getLastName() + " accepted your connection request",
                saved.getId()
        );

        return mapper.toConnectionDto(saved, currentUser, connectionRepository);
    }

    @Override
    @Transactional
    public ConnectionDto rejectConnection(Long connectionId, User currentUser) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection request not found"));

        if (!connection.getReceiver().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only the recipient can reject a connection request");
        }

        connection.setStatus(ConnectionStatus.REJECTED);
        Connection saved = connectionRepository.save(connection);

        return mapper.toConnectionDto(saved, currentUser, connectionRepository);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConnectionDto> getPendingRequests(User currentUser) {
        return connectionRepository.findByReceiverIdAndStatus(currentUser.getId(), ConnectionStatus.PENDING).stream()
                .map(c -> mapper.toConnectionDto(c, currentUser, connectionRepository))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSummaryDto> getUserConnections(User currentUser) {
        List<Connection> connections = connectionRepository.findAcceptedConnectionsForUser(currentUser.getId());
        return connections.stream()
                .map(c -> {
                    User otherUser = c.getSender().getId().equals(currentUser.getId()) ? c.getReceiver() : c.getSender();
                    return mapper.toUserSummaryDto(otherUser, currentUser, connectionRepository);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeConnection(Long connectionId, User currentUser) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection not found"));

        if (!connection.getSender().getId().equals(currentUser.getId()) &&
            !connection.getReceiver().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not part of this connection");
        }

        connectionRepository.delete(connection);
    }
}
