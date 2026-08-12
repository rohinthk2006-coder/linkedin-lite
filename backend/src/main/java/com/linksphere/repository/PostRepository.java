package com.linksphere.repository;

import com.linksphere.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByAuthorIdOrderByCreatedAtDesc(Long authorId);

    @Query("SELECT p FROM Post p WHERE p.author.id IN :authorIds ORDER BY p.createdAt DESC")
    Page<Post> findFeedPostsForUserAndConnections(@Param("authorIds") List<Long> authorIds, Pageable pageable);

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
