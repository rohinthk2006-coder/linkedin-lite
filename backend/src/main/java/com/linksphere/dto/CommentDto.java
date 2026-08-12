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
public class CommentDto {
    private Long id;
    private String content;
    private Long postId;
    private UserSummaryDto user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
