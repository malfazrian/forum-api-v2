class DeleteReplyComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { replyId, ownerId } = payload;

    this.replyId = replyId;
    this.ownerId = ownerId;
  }

  _verifyPayload({ replyId, ownerId }) {
    if (!replyId || !ownerId) {
      throw new Error('DELETE_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof replyId !== 'string' || typeof ownerId !== 'string') {
      throw new Error('DELETE_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyComment;
