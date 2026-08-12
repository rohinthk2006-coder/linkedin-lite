package com.linksphere.service;

import com.linksphere.dto.AddSkillRequest;
import com.linksphere.dto.SkillDto;
import com.linksphere.entity.User;

import java.util.List;

public interface SkillService {
    List<SkillDto> getAllSkills();
    List<SkillDto> getUserSkills(Long userId);
    SkillDto addSkillToUser(Long userId, AddSkillRequest request, User currentUser);
    void removeSkillFromUser(Long userId, Long skillId, User currentUser);
}
