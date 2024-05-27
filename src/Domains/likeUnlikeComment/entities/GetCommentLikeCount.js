class GetCommentLikeCount {
  constructor(payload) {
    this._verifyPayload(payload);

    const { commentId } = payload;

    this.commentId = commentId;
  }

  _verifyPayload({ commentId }) {
    if (!commentId) {
      throw new Error('GET_COMMENTS_BY_THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string') {
      throw new Error(
        'GET_COMMENTS_BY_THREAD_ID.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}

module.exports = GetCommentLikeCount;
