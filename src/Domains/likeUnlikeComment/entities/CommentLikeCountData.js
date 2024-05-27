class CommentLikeCountData {
  constructor(likeCount) {
    this._verifyPayload(likeCount);

    this.likeCount = likeCount;
  }

  _verifyPayload(likeCount) {
    if (likeCount === undefined || likeCount === null) {
      throw new Error('COMMENT_LIKE_COUNT_DATA.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof likeCount !== 'number') {
      throw new Error(
        'COMMENT_LIKE_COUNT_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}

module.exports = CommentLikeCountData;
