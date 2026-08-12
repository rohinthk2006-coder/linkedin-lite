package com.linksphere.mapper;

import com.linksphere.dto.*;
import com.linksphere.entity.*;
import com.linksphere.enums.ConnectionStatus;
import com.linksphere.repository.ConnectionRepository;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class EntityDtoMapper {

    public UserSummaryDto toUserSummaryDto(User user, User currentUser, ConnectionRepository connectionRepo) {
        if (user == null) return null;

        String connStatus = "NONE";
        Long connectionId = null;

        if (currentUser != null) {
            if (currentUser.getId().equals(user.getId())) {
                connStatus = "SELF";
            } else if (connectionRepo != null) {
                Optional<Connection> connOpt = connectionRepo.findConnectionBetween(currentUser.getId(), user.getId());
                if (connOpt.isPresent()) {
                    Connection conn = connOpt.get();
                    connStatus = conn.getStatus().name();
                    connectionId = conn.getId();
                }
            }
        }

        return UserSummaryDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .headline(user.getHeadline())
                .location(user.getLocation())
                .profileImage(user.getProfileImage())
                .connectionStatus(connStatus)
                .connectionId(connectionId)
                .build();
    }

    public UserDto toUserDto(User user, User currentUser, ConnectionRepository connectionRepo) {
        if (user == null) return null;

        long connCount = connectionRepo != null ? connectionRepo.countAcceptedConnections(user.getId()) : 0;
        int completeness = calculateProfileCompleteness(user);

        String connStatus = "NONE";
        Long connId = null;
        if (currentUser != null) {
            if (currentUser.getId().equals(user.getId())) {
                connStatus = "SELF";
            } else if (connectionRepo != null) {
                Optional<Connection> conn = connectionRepo.findConnectionBetween(currentUser.getId(), user.getId());
                if (conn.isPresent()) {
                    connStatus = conn.get().getStatus().name();
                    connId = conn.get().getId();
                }
            }
        }

        List<EducationDto> educations = user.getEducations() != null ?
                user.getEducations().stream().map(this::toEducationDto).collect(Collectors.toList()) : Collections.emptyList();

        List<ExperienceDto> experiences = user.getExperiences() != null ?
                user.getExperiences().stream().map(this::toExperienceDto).collect(Collectors.toList()) : Collections.emptyList();

        List<SkillDto> skills = user.getUserSkills() != null ?
                user.getUserSkills().stream().map(us -> toSkillDto(us.getSkill())).collect(Collectors.toList()) : Collections.emptyList();

        List<ProjectDto> projects = user.getProjects() != null ?
                user.getProjects().stream().map(this::toProjectDto).collect(Collectors.toList()) : Collections.emptyList();

        List<CertificationDto> certifications = user.getCertifications() != null ?
                user.getCertifications().stream().map(this::toCertificationDto).collect(Collectors.toList()) : Collections.emptyList();

        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .headline(user.getHeadline())
                .about(user.getAbout())
                .location(user.getLocation())
                .profileImage(user.getProfileImage())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .educations(educations)
                .experiences(experiences)
                .skills(skills)
                .projects(projects)
                .certifications(certifications)
                .connectionCount(connCount)
                .profileCompleteness(completeness)
                .connectionStatusWithCurrentUser(connStatus)
                .connectionIdWithCurrentUser(connId)
                .build();
    }

    public EducationDto toEducationDto(Education ed) {
        if (ed == null) return null;
        return EducationDto.builder()
                .id(ed.getId())
                .institution(ed.getInstitution())
                .degree(ed.getDegree())
                .fieldOfStudy(ed.getFieldOfStudy())
                .startDate(ed.getStartDate())
                .endDate(ed.getEndDate())
                .description(ed.getDescription())
                .userId(ed.getUser() != null ? ed.getUser().getId() : null)
                .build();
    }

    public ExperienceDto toExperienceDto(Experience exp) {
        if (exp == null) return null;
        return ExperienceDto.builder()
                .id(exp.getId())
                .company(exp.getCompany())
                .position(exp.getPosition())
                .location(exp.getLocation())
                .startDate(exp.getStartDate())
                .endDate(exp.getEndDate())
                .description(exp.getDescription())
                .userId(exp.getUser() != null ? exp.getUser().getId() : null)
                .build();
    }

    public SkillDto toSkillDto(Skill skill) {
        if (skill == null) return null;
        return SkillDto.builder()
                .id(skill.getId())
                .name(skill.getName())
                .build();
    }

    public ProjectDto toProjectDto(Project proj) {
        if (proj == null) return null;
        return ProjectDto.builder()
                .id(proj.getId())
                .title(proj.getTitle())
                .description(proj.getDescription())
                .technologies(proj.getTechnologies())
                .projectUrl(proj.getProjectUrl())
                .userId(proj.getUser() != null ? proj.getUser().getId() : null)
                .build();
    }

    public CertificationDto toCertificationDto(Certification cert) {
        if (cert == null) return null;
        return CertificationDto.builder()
                .id(cert.getId())
                .name(cert.getName())
                .issuingOrganization(cert.getIssuingOrganization())
                .issueDate(cert.getIssueDate())
                .credentialId(cert.getCredentialId())
                .credentialUrl(cert.getCredentialUrl())
                .userId(cert.getUser() != null ? cert.getUser().getId() : null)
                .build();
    }

    public ConnectionDto toConnectionDto(Connection conn, User currentUser, ConnectionRepository connectionRepo) {
        if (conn == null) return null;
        return ConnectionDto.builder()
                .id(conn.getId())
                .sender(toUserSummaryDto(conn.getSender(), currentUser, connectionRepo))
                .receiver(toUserSummaryDto(conn.getReceiver(), currentUser, connectionRepo))
                .status(conn.getStatus())
                .createdAt(conn.getCreatedAt())
                .build();
    }

    public PostDto toPostDto(Post post, User currentUser) {
        if (post == null) return null;
        boolean liked = false;
        if (currentUser != null && post.getLikes() != null) {
            liked = post.getLikes().stream().anyMatch(l -> l.getUser().getId().equals(currentUser.getId()));
        }

        long likeCount = post.getLikes() != null ? post.getLikes().size() : 0;
        long commentCount = post.getComments() != null ? post.getComments().size() : 0;

        return PostDto.builder()
                .id(post.getId())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .author(toUserSummaryDto(post.getAuthor(), currentUser, null))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .likeCount(likeCount)
                .commentCount(commentCount)
                .likedByCurrentUser(liked)
                .build();
    }

    public LikeDto toLikeDto(Like like, User currentUser) {
        if (like == null) return null;
        return LikeDto.builder()
                .id(like.getId())
                .postId(like.getPost() != null ? like.getPost().getId() : null)
                .user(toUserSummaryDto(like.getUser(), currentUser, null))
                .createdAt(like.getCreatedAt())
                .build();
    }

    public CommentDto toCommentDto(Comment comment, User currentUser) {
        if (comment == null) return null;
        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .postId(comment.getPost() != null ? comment.getPost().getId() : null)
                .user(toUserSummaryDto(comment.getUser(), currentUser, null))
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    public NotificationDto toNotificationDto(Notification notification, User currentUser) {
        if (notification == null) return null;
        return NotificationDto.builder()
                .id(notification.getId())
                .sender(toUserSummaryDto(notification.getSender(), currentUser, null))
                .type(notification.getType())
                .message(notification.getMessage())
                .referenceId(notification.getReferenceId())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    public int calculateProfileCompleteness(User user) {
        if (user == null) return 0;
        int score = 20; // Base score for registration (name + email)

        if (user.getHeadline() != null && !user.getHeadline().isBlank()) score += 15;
        if (user.getAbout() != null && !user.getAbout().isBlank()) score += 15;
        if (user.getLocation() != null && !user.getLocation().isBlank()) score += 10;
        if (user.getProfileImage() != null && !user.getProfileImage().isBlank()) score += 10;
        if (user.getExperiences() != null && !user.getExperiences().isEmpty()) score += 10;
        if (user.getEducations() != null && !user.getEducations().isEmpty()) score += 10;
        if (user.getUserSkills() != null && !user.getUserSkills().isEmpty()) score += 10;

        return Math.min(score, 100);
    }
}
