class GetRepliesByCommentId {
  constructor(payload) {
    this._verifyPayload(payload);

    const { commentId } = payload;

    this.commentId = commentId;
  }

  _verifyPayload({ commentId }) {
    if (!commentId) {
      throw new Error('GET_REPLIES_BY_COMMENT_ID.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string') {
      throw new Error(
        'GET_REPLIES_BY_COMMENT_ID.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}

module.exports = GetRepliesByCommentId;
