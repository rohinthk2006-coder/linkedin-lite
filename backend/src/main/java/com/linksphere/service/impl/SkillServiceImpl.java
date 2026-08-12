package com.linksphere.service.impl;

import com.linksphere.dto.AddSkillRequest;
import com.linksphere.dto.SkillDto;
import com.linksphere.entity.Skill;
import com.linksphere.entity.User;
import com.linksphere.entity.UserSkill;
import com.linksphere.exception.ConflictException;
import com.linksphere.exception.ResourceNotFoundException;
import com.linksphere.exception.UnauthorizedException;
import com.linksphere.mapper.EntityDtoMapper;
import com.linksphere.repository.SkillRepository;
import com.linksphere.repository.UserRepository;
import com.linksphere.repository.UserSkillRepository;
import com.linksphere.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<SkillDto> getAllSkills() {
        return skillRepository.findAll().stream().map(mapper::toSkillDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDto> getUserSkills(Long userId) {
        return userSkillRepository.findByUserId(userId).stream()
                .map(us -> mapper.toSkillDto(us.getSkill()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SkillDto addSkillToUser(Long userId, AddSkillRequest request, User currentUser) {
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("You cannot add skills to another user's profile");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String skillName = request.getName().trim();
        Skill skill = skillRepository.findByNameIgnoreCase(skillName)
                .orElseGet(() -> skillRepository.save(Skill.builder().name(skillName).build()));

        if (userSkillRepository.existsByUserIdAndSkillId(userId, skill.getId())) {
            throw new ConflictException("Skill '" + skillName + "' is already added to your profile");
        }

        UserSkill userSkill = UserSkill.builder()
                .user(user)
                .skill(skill)
                .build();

        userSkillRepository.save(userSkill);
        return mapper.toSkillDto(skill);
    }

    @Override
    @Transactional
    public void removeSkillFromUser(Long userId, Long skillId, User currentUser) {
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("You cannot remove skills from another user's profile");
        }

        userSkillRepository.deleteByUserIdAndSkillId(userId, skillId);
    }
}
