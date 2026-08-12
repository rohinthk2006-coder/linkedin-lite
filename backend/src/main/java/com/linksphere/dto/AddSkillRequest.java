package com.linksphere.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddSkillRequest {
    @NotBlank(message = "Skill name is required")
    private String name;
}
