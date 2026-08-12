package com.linksphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDto {
    private Long id;
    private String title;
    private String description;
    private String technologies;
    private String projectUrl;
    private Long userId;
}
