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
public class EducationDto {
    private Long id;
    private String institution;
    private String degree;
    private String fieldOfStudy;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private Long userId;
}
