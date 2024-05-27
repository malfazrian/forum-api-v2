const LikeCommentThread = require('../LikeCommentThread');

describe('a LikeCommentThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action and Assert
    expect(() => new LikeCommentThread(payload)).toThrowError(
      'LIKE_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 123,
      userId: ['John'],
    };

    // Action and Assert
    expect(() => new LikeCommentThread(payload)).toThrowError(
      'LIKE_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create LikeCommentThread object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    // Action
    const { threadId, commentId, userId } = new LikeCommentThread(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(userId).toEqual(payload.userId);
  });
});
