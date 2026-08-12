package com.linksphere.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProjectRequest {

    @NotBlank(message = "Project title is required")
    private String title;

    private String description;
    private String technologies;
    private String projectUrl;
}
