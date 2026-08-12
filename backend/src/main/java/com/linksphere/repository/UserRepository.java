package com.linksphere.repository;

import com.linksphere.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u " +
           "LEFT JOIN u.userSkills us " +
           "LEFT JOIN us.skill s " +
           "WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(u.headline) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(u.location) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.id <> :userId AND u.id NOT IN " +
           "(SELECT CASE WHEN c.sender.id = :userId THEN c.receiver.id ELSE c.sender.id END " +
           " FROM Connection c WHERE c.sender.id = :userId OR c.receiver.id = :userId)")
    List<User> findRecommendedUsers(@Param("userId") Long userId, Pageable pageable);
}
