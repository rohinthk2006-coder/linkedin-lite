package com.linksphere.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ExperienceRequest {

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Position is required")
    private String position;

    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
}
