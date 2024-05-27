const GetCommentLikeCount = require('../GetCommentLikeCount');

describe('GetCommentLikeCount', () => {
  it('should create an instance correctly when given valid payload', () => {
    // Arrange
    const payload = { commentId: 'comment-123' };

    // Action
    const getCommentLikeCount = new GetCommentLikeCount(payload);

    // Assert
    expect(getCommentLikeCount.commentId).toEqual(payload.commentId);
  });

  it('should throw error when payload does not contain commentId', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new GetCommentLikeCount(payload)).toThrowError(
      'GET_COMMENTS_BY_THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when commentId is not a string', () => {
    // Arrange
    const payload = { commentId: 123 }; // not a string

    // Action and Assert
    expect(() => new GetCommentLikeCount(payload)).toThrowError(
      'GET_COMMENTS_BY_THREAD_ID.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
});
