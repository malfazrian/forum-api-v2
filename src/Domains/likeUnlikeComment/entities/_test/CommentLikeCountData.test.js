const CommentLikeCountData = require('../CommentLikeCountData');

describe('CommentLikeCountData', () => {
  it('should throw error when likeCount is not provided', () => {
    expect(() => new CommentLikeCountData()).toThrowError(
      'COMMENT_LIKE_COUNT_DATA.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when likeCount is null', () => {
    expect(() => new CommentLikeCountData(null)).toThrowError(
      'COMMENT_LIKE_COUNT_DATA.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when likeCount is undefined', () => {
    expect(() => new CommentLikeCountData(undefined)).toThrowError(
      'COMMENT_LIKE_COUNT_DATA.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when likeCount is not a number', () => {
    expect(() => new CommentLikeCountData('not a number')).toThrowError(
      'COMMENT_LIKE_COUNT_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create CommentLikeCountData object correctly with valid likeCount', () => {
    const likeCount = 5;
    const commentLikeCountData = new CommentLikeCountData(likeCount);
    expect(commentLikeCountData.likeCount).toEqual(likeCount);
  });
});
