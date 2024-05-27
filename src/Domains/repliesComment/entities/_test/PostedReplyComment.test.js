const PostedReplyComment = require('../PostedReplyComment');

describe('a PostedReplyComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new PostedReplyComment(payload)).toThrowError(
      'POSTED_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 123,
      owner: true,
    };

    // Action and Assert
    expect(() => new PostedReplyComment(payload)).toThrowError(
      'POSTED_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create PostedReplyComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'content',
      owner: 'userId',
    };

    // Action
    const { id, content, owner } = new PostedReplyComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
