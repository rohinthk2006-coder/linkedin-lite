package com.linksphere.service.impl;

import com.linksphere.dto.ExperienceDto;
import com.linksphere.dto.ExperienceRequest;
import com.linksphere.entity.Experience;
import com.linksphere.entity.User;
import com.linksphere.exception.ResourceNotFoundException;
import com.linksphere.exception.UnauthorizedException;
import com.linksphere.mapper.EntityDtoMapper;
import com.linksphere.repository.ExperienceRepository;
import com.linksphere.repository.UserRepository;
import com.linksphere.service.ExperienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExperienceServiceImpl implements ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final UserRepository userRepository;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<ExperienceDto> getExperiencesByUserId(Long userId) {
        return experienceRepository.findByUserIdOrderByStartDateDesc(userId)
                .stream().map(mapper::toExperienceDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExperienceDto addExperience(Long userId, ExperienceRequest request, User currentUser) {
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("You cannot add experience entries to another user's profile");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Experience experience = Experience.builder()
                .company(request.getCompany())
                .position(request.getPosition())
                .location(request.getLocation())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .user(user)
                .build();

        return mapper.toExperienceDto(experienceRepository.save(experience));
    }

    @Override
    @Transactional
    public ExperienceDto updateExperience(Long id, ExperienceRequest request, User currentUser) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience record not found"));

        if (!experience.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You cannot modify another user's experience record");
        }

        experience.setCompany(request.getCompany());
        experience.setPosition(request.getPosition());
        experience.setLocation(request.getLocation());
        experience.setStartDate(request.getStartDate());
        experience.setEndDate(request.getEndDate());
        experience.setDescription(request.getDescription());

        return mapper.toExperienceDto(experienceRepository.save(experience));
    }

    @Override
    @Transactional
    public void deleteExperience(Long id, User currentUser) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience record not found"));

        if (!experience.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You cannot delete another user's experience record");
        }

        experienceRepository.delete(experience);
    }
}
