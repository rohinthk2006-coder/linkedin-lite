package com.linksphere;

import com.linksphere.dto.CreatePostRequest;
import com.linksphere.dto.PostDto;
import com.linksphere.entity.Post;
import com.linksphere.entity.User;
import com.linksphere.enums.Role;
import com.linksphere.exception.UnauthorizedException;
import com.linksphere.mapper.EntityDtoMapper;
import com.linksphere.repository.*;
import com.linksphere.service.NotificationService;
import com.linksphere.service.impl.PostServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock private PostRepository postRepository;
    @Mock private LikeRepository likeRepository;
    @Mock private CommentRepository commentRepository;
    @Mock private ConnectionRepository connectionRepository;
    @Mock private NotificationService notificationService;
    @Mock private EntityDtoMapper mapper;

    @InjectMocks
    private PostServiceImpl postService;

    private User author;
    private User otherUser;
    private Post post;

    @BeforeEach
    void setUp() {
        author = User.builder().id(1L).firstName("Alex").lastName("M").role(Role.ROLE_USER).build();
        otherUser = User.builder().id(2L).firstName("Bob").lastName("S").role(Role.ROLE_USER).build();

        post = Post.builder()
                .id(10L)
                .content("Hello World Post")
                .author(author)
                .build();
    }

    @Test
    void updatePost_UnauthorizedUser_ThrowsUnauthorizedException() {
        CreatePostRequest req = new CreatePostRequest();
        req.setContent("Updated content");

        when(postRepository.findById(10L)).thenReturn(Optional.of(post));

        assertThrows(UnauthorizedException.class, () -> postService.updatePost(10L, req, otherUser));
    }

    @Test
    void deletePost_Author_Success() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));

        postService.deletePost(10L, author);

        verify(postRepository, times(1)).delete(post);
    }
}
