const GetRepliesByCommentId = require('../GetRepliesByCommentId');

describe('a GetRepliesByCommentId entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'comment-123',
    };

    // Action and Assert
    expect(() => new GetRepliesByCommentId(payload)).toThrowError(
      'GET_REPLIES_BY_COMMENT_ID.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
    };

    // Action and Assert
    expect(() => new GetRepliesByCommentId(payload)).toThrowError(
      'GET_REPLIES_BY_COMMENT_ID.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create GetRepliesByCommentId object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
    };

    // Action
    const { commentId } = new GetRepliesByCommentId(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
  });
});
