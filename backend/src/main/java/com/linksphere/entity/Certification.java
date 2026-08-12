package com.linksphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "certifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String issuingOrganization;

    private LocalDate issueDate;

    private String credentialId;

    private String credentialUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
