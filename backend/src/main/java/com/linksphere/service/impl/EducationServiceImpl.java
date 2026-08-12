package com.linksphere.service.impl;

import com.linksphere.dto.EducationDto;
import com.linksphere.dto.EducationRequest;
import com.linksphere.entity.Education;
import com.linksphere.entity.User;
import com.linksphere.exception.ResourceNotFoundException;
import com.linksphere.exception.UnauthorizedException;
import com.linksphere.mapper.EntityDtoMapper;
import com.linksphere.repository.EducationRepository;
import com.linksphere.repository.UserRepository;
import com.linksphere.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EducationServiceImpl implements EducationService {

    private final EducationRepository educationRepository;
    private final UserRepository userRepository;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<EducationDto> getEducationsByUserId(Long userId) {
        return educationRepository.findByUserIdOrderByStartDateDesc(userId)
                .stream().map(mapper::toEducationDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EducationDto addEducation(Long userId, EducationRequest request, User currentUser) {
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("You cannot add education entries to another user's profile");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Education education = Education.builder()
                .institution(request.getInstitution())
                .degree(request.getDegree())
                .fieldOfStudy(request.getFieldOfStudy())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .user(user)
                .build();

        return mapper.toEducationDto(educationRepository.save(education));
    }

    @Override
    @Transactional
    public EducationDto updateEducation(Long id, EducationRequest request, User currentUser) {
        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education record not found"));

        if (!education.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You cannot modify another user's education record");
        }

        education.setInstitution(request.getInstitution());
        education.setDegree(request.getDegree());
        education.setFieldOfStudy(request.getFieldOfStudy());
        education.setStartDate(request.getStartDate());
        education.setEndDate(request.getEndDate());
        education.setDescription(request.getDescription());

        return mapper.toEducationDto(educationRepository.save(education));
    }

    @Override
    @Transactional
    public void deleteEducation(Long id, User currentUser) {
        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education record not found"));

        if (!education.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You cannot delete another user's education record");
        }

        educationRepository.delete(education);
    }
}
