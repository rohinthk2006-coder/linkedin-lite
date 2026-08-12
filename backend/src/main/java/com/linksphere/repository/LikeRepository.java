package com.linksphere.repository;

import com.linksphere.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByPostIdAndUserId(Long postId, Long userId);
    Boolean existsByPostIdAndUserId(Long postId, Long userId);
    long countByPostId(Long postId);
    List<Like> findByPostId(Long postId);
    void deleteByPostIdAndUserId(Long postId, Long userId);
}
