package com.linksphere.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CertificationRequest {

    @NotBlank(message = "Certification name is required")
    private String name;

    private String issuingOrganization;
    private LocalDate issueDate;
    private String credentialId;
    private String credentialUrl;
}
