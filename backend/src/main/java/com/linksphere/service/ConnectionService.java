package com.linksphere.service;

import com.linksphere.dto.ConnectionDto;
import com.linksphere.dto.UserSummaryDto;
import com.linksphere.entity.User;

import java.util.List;

public interface ConnectionService {
    ConnectionDto sendConnectionRequest(Long receiverId, User currentUser);
    ConnectionDto acceptConnection(Long connectionId, User currentUser);
    ConnectionDto rejectConnection(Long connectionId, User currentUser);
    List<ConnectionDto> getPendingRequests(User currentUser);
    List<UserSummaryDto> getUserConnections(User currentUser);
    void removeConnection(Long connectionId, User currentUser);
}
