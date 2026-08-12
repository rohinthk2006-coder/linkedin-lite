package com.linksphere.repository;

import com.linksphere.entity.Connection;
import com.linksphere.enums.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    @Query("SELECT c FROM Connection c WHERE (c.sender.id = :u1 AND c.receiver.id = :u2) OR (c.sender.id = :u2 AND c.receiver.id = :u1)")
    Optional<Connection> findConnectionBetween(@Param("u1") Long user1Id, @Param("u2") Long user2Id);

    List<Connection> findByReceiverIdAndStatus(Long receiverId, ConnectionStatus status);

    @Query("SELECT c FROM Connection c WHERE (c.sender.id = :userId OR c.receiver.id = :userId) AND c.status = 'ACCEPTED'")
    List<Connection> findAcceptedConnectionsForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(c) FROM Connection c WHERE (c.sender.id = :userId OR c.receiver.id = :userId) AND c.status = 'ACCEPTED'")
    long countAcceptedConnections(@Param("userId") Long userId);
}
