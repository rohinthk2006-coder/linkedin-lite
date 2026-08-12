package com.linksphere.service;

import com.linksphere.dto.ProjectDto;
import com.linksphere.dto.ProjectRequest;
import com.linksphere.entity.User;

import java.util.List;

public interface ProjectService {
    List<ProjectDto> getProjectsByUserId(Long userId);
    ProjectDto addProject(Long userId, ProjectRequest request, User currentUser);
    ProjectDto updateProject(Long id, ProjectRequest request, User currentUser);
    void deleteProject(Long id, User currentUser);
}
