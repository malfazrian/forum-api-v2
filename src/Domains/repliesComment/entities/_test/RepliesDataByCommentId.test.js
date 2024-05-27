const RepliesDataByCommentId = require('../RepliesDataByCommentId');

describe('a RepliesDataByCommentId entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: '2021-08-08T07:22:33.555Z',
    };

    // Action and Assert
    expect(() => new RepliesDataByCommentId([payload])).toThrowError(
      'REPLIES_DATA_BY_COMMENT_ID.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: [],
      date: 20210808,
      username: 'user-123',
      is_delete: false,
    };

    // Action and Assert
    expect(() => new RepliesDataByCommentId([payload])).toThrowError(
      'REPLIES_DATA_BY_COMMENT_ID.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create RepliesDataByCommentId object correctly with non-empty payload', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:22:33.555Z',
      username: 'user-123',
      is_delete: false,
    };

    // Action
    const repliesData = new RepliesDataByCommentId([payload]);

    // Assert
    expect(repliesData.replies).toHaveLength(1);
    expect(repliesData.replies[0].id).toEqual(payload.id);
    expect(repliesData.replies[0].content).toEqual(payload.content);
    expect(repliesData.replies[0].date).toEqual(payload.date);
    expect(repliesData.replies[0].username).toEqual(payload.username);
    expect(repliesData.replies[0].is_delete).toEqual(payload.is_delete);
  });

  it('should create RepliesDataByCommentId object correctly with empty payload', () => {
    // Action
    const repliesData = new RepliesDataByCommentId([]);

    // Assert
    expect(repliesData.replies).toHaveLength(0);
  });

  it('should convert single payload into an array', () => {
    // Arrange
    const singlePayload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:22:33.555Z',
      username: 'user-123',
      is_delete: false,
    };

    // Action
    const repliesData = new RepliesDataByCommentId(singlePayload);

    // Assert
    expect(repliesData.replies).toHaveLength(1);
    expect(repliesData.replies[0].id).toEqual(singlePayload.id);
    expect(repliesData.replies[0].content).toEqual(singlePayload.content);
    expect(repliesData.replies[0].date).toEqual(singlePayload.date);
    expect(repliesData.replies[0].username).toEqual(singlePayload.username);
    expect(repliesData.replies[0].is_delete).toEqual(singlePayload.is_delete);
  });
});
