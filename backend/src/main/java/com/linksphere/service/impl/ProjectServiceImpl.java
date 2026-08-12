package com.linksphere.service.impl;

import com.linksphere.dto.ProjectDto;
import com.linksphere.dto.ProjectRequest;
import com.linksphere.entity.Project;
import com.linksphere.entity.User;
import com.linksphere.exception.ResourceNotFoundException;
import com.linksphere.exception.UnauthorizedException;
import com.linksphere.mapper.EntityDtoMapper;
import com.linksphere.repository.ProjectRepository;
import com.linksphere.repository.UserRepository;
import com.linksphere.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDto> getProjectsByUserId(Long userId) {
        return projectRepository.findByUserId(userId).stream()
                .map(mapper::toProjectDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProjectDto addProject(Long userId, ProjectRequest request, User currentUser) {
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("You cannot add projects to another user's profile");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .technologies(request.getTechnologies())
                .projectUrl(request.getProjectUrl())
                .user(user)
                .build();

        return mapper.toProjectDto(projectRepository.save(project));
    }

    @Override
    @Transactional
    public ProjectDto updateProject(Long id, ProjectRequest request, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You cannot modify another user's project");
        }

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setTechnologies(request.getTechnologies());
        project.setProjectUrl(request.getProjectUrl());

        return mapper.toProjectDto(projectRepository.save(project));
    }

    @Override
    @Transactional
    public void deleteProject(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You cannot delete another user's project");
        }

        projectRepository.delete(project);
    }
}
