package com.linksphere.service.impl;

import com.linksphere.dto.*;
import com.linksphere.entity.*;
import com.linksphere.enums.NotificationType;
import com.linksphere.exception.ResourceNotFoundException;
import com.linksphere.exception.UnauthorizedException;
import com.linksphere.mapper.EntityDtoMapper;
import com.linksphere.repository.*;
import com.linksphere.service.NotificationService;
import com.linksphere.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final ConnectionRepository connectionRepository;
    private final NotificationService notificationService;
    private final EntityDtoMapper mapper;
    private final com.linksphere.service.FileStorageService fileStorageService;

    @Override
    @Transactional
    public PostDto createPost(String content, org.springframework.web.multipart.MultipartFile image, User currentUser) {
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = fileStorageService.storeFile(image);
        }

        Post post = Post.builder()
                .content(content)
                .imageUrl(imageUrl)
                .author(currentUser)
                .build();

        Post savedPost = postRepository.save(post);
        return mapper.toPostDto(savedPost, currentUser);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDto> getFeed(int page, int size, User currentUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        if (currentUser == null) {
            return postRepository.findAllByOrderByCreatedAtDesc(pageable)
                    .map(p -> mapper.toPostDto(p, null));
        }

        // Get connections of current user
        List<Connection> connections = connectionRepository.findAcceptedConnectionsForUser(currentUser.getId());
        List<Long> authorIds = new ArrayList<>();
        authorIds.add(currentUser.getId());

        for (Connection conn : connections) {
            Long connId = conn.getSender().getId().equals(currentUser.getId()) ? conn.getReceiver().getId() : conn.getSender().getId();
            authorIds.add(connId);
        }

        Page<Post> feedPosts = postRepository.findFeedPostsForUserAndConnections(authorIds, pageable);
        if (feedPosts.isEmpty()) {
            // Fallback to global feed if user has no connections or connections haven't posted
            feedPosts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        return feedPosts.map(p -> mapper.toPostDto(p, currentUser));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostDto> getUserPosts(Long userId, User currentUser) {
        return postRepository.findByAuthorIdOrderByCreatedAtDesc(userId).stream()
                .map(p -> mapper.toPostDto(p, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PostDto getPostById(Long id, User currentUser) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        return mapper.toPostDto(post, currentUser);
    }

    @Override
    @Transactional
    public PostDto updatePost(Long id, CreatePostRequest request, User currentUser) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to edit another user's post");
        }

        post.setContent(request.getContent());
        if (request.getImageUrl() != null) {
            post.setImageUrl(request.getImageUrl());
        }

        Post updatedPost = postRepository.save(post);
        return mapper.toPostDto(updatedPost, currentUser);
    }

    @Override
    @Transactional
    public void deletePost(Long id, User currentUser) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to delete another user's post");
        }

        postRepository.delete(post);
    }

    @Override
    @Transactional
    public boolean toggleLikePost(Long postId, User currentUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, currentUser.getId());
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            return false; // unliked
        } else {
            Like like = Like.builder()
                    .post(post)
                    .user(currentUser)
                    .build();
            likeRepository.save(like);

            notificationService.createNotification(
                    post.getAuthor(), currentUser, NotificationType.POST_LIKE,
                    currentUser.getFirstName() + " " + currentUser.getLastName() + " liked your post",
                    post.getId()
            );
            return true; // liked
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<LikeDto> getPostLikes(Long postId, User currentUser) {
        return likeRepository.findByPostId(postId).stream()
                .map(l -> mapper.toLikeDto(l, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentDto addComment(Long postId, CreateCommentRequest request, User currentUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .post(post)
                .user(currentUser)
                .build();

        Comment savedComment = commentRepository.save(comment);

        notificationService.createNotification(
                post.getAuthor(), currentUser, NotificationType.POST_COMMENT,
                currentUser.getFirstName() + " " + currentUser.getLastName() + " commented on your post",
                post.getId()
        );

        return mapper.toCommentDto(savedComment, currentUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDto> getPostComments(Long postId, User currentUser) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId).stream()
                .map(c -> mapper.toCommentDto(c, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentDto updateComment(Long commentId, CreateCommentRequest request, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You cannot edit another user's comment");
        }

        comment.setContent(request.getContent());
        Comment updated = commentRepository.save(comment);
        return mapper.toCommentDto(updated, currentUser);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId()) &&
            !comment.getPost().getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }
}
