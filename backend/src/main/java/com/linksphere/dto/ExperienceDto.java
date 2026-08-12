package com.linksphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExperienceDto {
    private Long id;
    private String company;
    private String position;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private Long userId;
}
