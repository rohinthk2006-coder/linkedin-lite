package com.linksphere.dto;

import com.linksphere.enums.ConnectionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConnectionDto {
    private Long id;
    private UserSummaryDto sender;
    private UserSummaryDto receiver;
    private ConnectionStatus status;
    private LocalDateTime createdAt;
}
