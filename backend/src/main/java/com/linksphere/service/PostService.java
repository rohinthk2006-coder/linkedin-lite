package com.linksphere.service;

import com.linksphere.dto.*;
import com.linksphere.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PostService {
    PostDto createPost(CreatePostRequest request, User currentUser);
    Page<PostDto> getFeed(int page, int size, User currentUser);
    List<PostDto> getUserPosts(Long userId, User currentUser);
    PostDto getPostById(Long id, User currentUser);
    PostDto updatePost(Long id, CreatePostRequest request, User currentUser);
    void deletePost(Long id, User currentUser);

    boolean toggleLikePost(Long postId, User currentUser);
    List<LikeDto> getPostLikes(Long postId, User currentUser);

    CommentDto addComment(Long postId, CreateCommentRequest request, User currentUser);
    List<CommentDto> getPostComments(Long postId, User currentUser);
    CommentDto updateComment(Long commentId, CreateCommentRequest request, User currentUser);
    void deleteComment(Long commentId, User currentUser);
}
