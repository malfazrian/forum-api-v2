const DeleteReplyComment = require('../DeleteReplyComment');

describe('DeleteReplyComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      replyId: 'comment-123',
    };

    // Action and Assert
    expect(() => new DeleteReplyComment(payload)).toThrowError(
      'DELETE_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      replyId: 123,
      ownerId: ['John'],
    };

    // Action and Assert
    expect(() => new DeleteReplyComment(payload)).toThrowError(
      'DELETE_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create DeleteReplyComment object correctly', () => {
    // Arrange
    const payload = {
      replyId: 'comment-123',
      ownerId: 'user-123',
    };

    // Action
    const { replyId, ownerId } = new DeleteReplyComment(payload);

    // Assert
    expect(replyId).toEqual(payload.replyId);
    expect(ownerId).toEqual(payload.ownerId);
  });
});
