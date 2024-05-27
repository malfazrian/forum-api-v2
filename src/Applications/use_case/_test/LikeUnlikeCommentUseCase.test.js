const CommentLikeRepository = require('../../../Domains/likeUnlikeComment/CommentLikeRepository');
const CommentThreadRepository = require('../../../Domains/commentsThread/CommentThreadRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeUnlikeCommentUseCase = require('../LikeUnlikeCommentUseCase');

describe('LikeUnlikeCommentUseCase', () => {
  it('should like the comment if not already liked', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };
    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentLikeRepository.verifyLikeStatus = jest
      .fn()
      .mockResolvedValue(false);
    mockCommentLikeRepository.addCommentLike = jest.fn();
    mockThreadRepository.verifyThreadExist = jest.fn().mockResolvedValue();
    mockCommentThreadRepository.verifyCommentThreadExist = jest
      .fn()
      .mockResolvedValue();

    const likeUnlikeCommentUseCase = new LikeUnlikeCommentUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentThreadRepository: mockCommentThreadRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeUnlikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(
      'thread-123',
    );
    expect(
      mockCommentThreadRepository.verifyCommentThreadExist,
    ).toHaveBeenCalledWith('comment-123');
    expect(mockCommentLikeRepository.verifyLikeStatus).toHaveBeenCalledWith(
      'user-123',
      'comment-123',
    );
    expect(mockCommentLikeRepository.addCommentLike).toHaveBeenCalledWith(
      'user-123',
      'comment-123',
    );
  });

  it('should unlike the comment if already liked', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };
    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentLikeRepository.verifyLikeStatus = jest
      .fn()
      .mockResolvedValue(true);
    mockCommentLikeRepository.unlikeComment = jest.fn();
    mockThreadRepository.verifyThreadExist = jest.fn().mockResolvedValue();
    mockCommentThreadRepository.verifyCommentThreadExist = jest
      .fn()
      .mockResolvedValue();

    const likeUnlikeCommentUseCase = new LikeUnlikeCommentUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentThreadRepository: mockCommentThreadRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeUnlikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(
      'thread-123',
    );
    expect(
      mockCommentThreadRepository.verifyCommentThreadExist,
    ).toHaveBeenCalledWith('comment-123');
    expect(mockCommentLikeRepository.verifyLikeStatus).toHaveBeenCalledWith(
      'user-123',
      'comment-123',
    );
    expect(mockCommentLikeRepository.unlikeComment).toHaveBeenCalledWith(
      'user-123',
      'comment-123',
    );
  });
});
