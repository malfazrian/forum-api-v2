const PostReplyComment = require('../PostReplyComment');

describe('a PostReplyComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'abc',
    };

    // Action and Assert
    expect(() => new PostReplyComment(payload)).toThrowError(
      'POST_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      commentId: 'comment-123',
      content: 123,
      owner: ['Jane'],
    };

    // Action and Assert
    expect(() => new PostReplyComment(payload)).toThrowError(
      'POST_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create PostReplyComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: "Yes it's awesome",
      owner: 'Jane',
    };

    // Action
    const {
      threadId, commentId, content, owner,
    } = new PostReplyComment(
      payload,
    );

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
