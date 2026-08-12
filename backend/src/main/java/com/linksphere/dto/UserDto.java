package com.linksphere.dto;

import com.linksphere.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String headline;
    private String about;
    private String location;
    private String profileImage;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private List<EducationDto> educations;
    private List<ExperienceDto> experiences;
    private List<SkillDto> skills;
    private List<ProjectDto> projects;
    private List<CertificationDto> certifications;
    
    private long connectionCount;
    private int profileCompleteness;
    private String connectionStatusWithCurrentUser;
    private Long connectionIdWithCurrentUser;
}
