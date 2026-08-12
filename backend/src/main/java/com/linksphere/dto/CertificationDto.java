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
public class CertificationDto {
    private Long id;
    private String name;
    private String issuingOrganization;
    private LocalDate issueDate;
    private String credentialId;
    private String credentialUrl;
    private Long userId;
}
