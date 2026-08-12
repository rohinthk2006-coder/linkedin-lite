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
public class PostDto {
    private Long id;
    private String content;
    private String imageUrl;
    private UserSummaryDto author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long likeCount;
    private long commentCount;
    private boolean likedByCurrentUser;
}
