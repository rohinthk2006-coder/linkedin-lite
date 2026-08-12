package com.linksphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LikeDto {
    private Long id;
    private Long postId;
    private UserSummaryDto user;
    private LocalDateTime createdAt;
}
