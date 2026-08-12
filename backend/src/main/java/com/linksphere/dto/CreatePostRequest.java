package com.linksphere.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreatePostRequest {

    @NotBlank(message = "Post content cannot be empty")
    private String content;

    private String imageUrl;
}
