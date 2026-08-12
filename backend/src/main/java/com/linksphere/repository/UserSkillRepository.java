package com.linksphere.repository;

import com.linksphere.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUserId(Long userId);
    Boolean existsByUserIdAndSkillId(Long userId, Long skillId);
    Optional<UserSkill> findByUserIdAndSkillId(Long userId, Long skillId);
    void deleteByUserIdAndSkillId(Long userId, Long skillId);
}
