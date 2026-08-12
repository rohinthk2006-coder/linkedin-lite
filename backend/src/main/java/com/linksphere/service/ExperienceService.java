package com.linksphere.service;

import com.linksphere.dto.ExperienceDto;
import com.linksphere.dto.ExperienceRequest;
import com.linksphere.entity.User;

import java.util.List;

public interface ExperienceService {
    List<ExperienceDto> getExperiencesByUserId(Long userId);
    ExperienceDto addExperience(Long userId, ExperienceRequest request, User currentUser);
    ExperienceDto updateExperience(Long id, ExperienceRequest request, User currentUser);
    void deleteExperience(Long id, User currentUser);
}
