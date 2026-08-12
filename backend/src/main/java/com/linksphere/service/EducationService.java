package com.linksphere.service;

import com.linksphere.dto.EducationDto;
import com.linksphere.dto.EducationRequest;
import com.linksphere.entity.User;

import java.util.List;

public interface EducationService {
    List<EducationDto> getEducationsByUserId(Long userId);
    EducationDto addEducation(Long userId, EducationRequest request, User currentUser);
    EducationDto updateEducation(Long id, EducationRequest request, User currentUser);
    void deleteEducation(Long id, User currentUser);
}
