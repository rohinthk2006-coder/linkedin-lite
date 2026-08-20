package com.linksphere.controller;

import com.linksphere.dto.*;
import com.linksphere.entity.User;
import com.linksphere.security.CurrentUser;
import com.linksphere.security.UserPrincipal;
import com.linksphere.service.PostService;
import com.linksphere.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Post & Social Feed APIs", description = "Endpoints for posts, likes, comments, and connection-first social feed")
public class PostController {

    private final PostService postService;
    private final SecurityUtils securityUtils;

    @PostMapping(value = "/posts", consumes = "multipart/form-data")
    @Operation(summary = "Create a new professional post with optional image")
    public ResponseEntity<ApiResponse<PostDto>> createPost(
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        PostDto created = postService.createPost(content, image, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Post published successfully", created), HttpStatus.CREATED);
    }

    @GetMapping("/posts/feed")
    @Operation(summary = "Get personalized social feed (connection posts prioritized)")
    public ResponseEntity<ApiResponse<Page<PostDto>>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        Page<PostDto> feed = postService.getFeed(page, size, currentUser);
        return ResponseEntity.ok(ApiResponse.success(feed));
    }

    @GetMapping("/posts/user/{userId}")
    @Operation(summary = "Get posts published by a specific user")
    public ResponseEntity<ApiResponse<List<PostDto>>> getUserPosts(
            @PathVariable Long userId,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        List<PostDto> posts = postService.getUserPosts(userId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    @GetMapping("/posts/{id}")
    @Operation(summary = "Get post details by ID")
    public ResponseEntity<ApiResponse<PostDto>> getPostById(
            @PathVariable Long id,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        PostDto post = postService.getPostById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(post));
    }

    @PutMapping("/posts/{id}")
    @Operation(summary = "Update an existing post (author only)")
    public ResponseEntity<ApiResponse<PostDto>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody CreatePostRequest request,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        PostDto updated = postService.updatePost(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Post updated successfully", updated));
    }

    @DeleteMapping("/posts/{id}")
    @Operation(summary = "Delete a post (author only)")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @PathVariable Long id,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        postService.deletePost(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Post deleted successfully", null));
    }

    // LIKES
    @PostMapping("/posts/{postId}/like")
    @Operation(summary = "Toggle like/unlike on a post")
    public ResponseEntity<ApiResponse<Boolean>> toggleLike(
            @PathVariable Long postId,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        boolean liked = postService.toggleLikePost(postId, currentUser);
        String msg = liked ? "Post liked" : "Post unliked";
        return ResponseEntity.ok(ApiResponse.success(msg, liked));
    }

    @DeleteMapping("/posts/{postId}/like")
    @Operation(summary = "Unlike a post")
    public ResponseEntity<ApiResponse<Void>> unlikePost(
            @PathVariable Long postId,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        postService.toggleLikePost(postId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Post unliked", null));
    }

    @GetMapping("/posts/{postId}/likes")
    @Operation(summary = "Get list of users who liked a post")
    public ResponseEntity<ApiResponse<List<LikeDto>>> getPostLikes(
            @PathVariable Long postId,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        List<LikeDto> likes = postService.getPostLikes(postId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(likes));
    }

    // COMMENTS
    @PostMapping("/posts/{postId}/comments")
    @Operation(summary = "Add a comment to a post")
    public ResponseEntity<ApiResponse<CommentDto>> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody CreateCommentRequest request,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        CommentDto comment = postService.addComment(postId, request, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Comment added", comment), HttpStatus.CREATED);
    }

    @GetMapping("/posts/{postId}/comments")
    @Operation(summary = "Get comments for a post")
    public ResponseEntity<ApiResponse<List<CommentDto>>> getPostComments(
            @PathVariable Long postId,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        List<CommentDto> comments = postService.getPostComments(postId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }

    @PutMapping("/comments/{id}")
    @Operation(summary = "Update a comment")
    public ResponseEntity<ApiResponse<CommentDto>> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentRequest request,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        CommentDto updated = postService.updateComment(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Comment updated", updated));
    }

    @DeleteMapping("/comments/{id}")
    @Operation(summary = "Delete a comment")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long id,
            @CurrentUser UserPrincipal principal) {
        User currentUser = securityUtils.getAuthenticatedUser(principal);
        postService.deleteComment(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted", null));
    }
}
