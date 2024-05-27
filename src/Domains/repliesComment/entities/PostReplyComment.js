class PostReplyComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      threadId, commentId, content, owner,
    } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({
    threadId, commentId, content, owner,
  }) {
    if (!threadId || !commentId || !content || !owner) {
      throw new Error('POST_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof threadId !== 'string'
      || typeof commentId !== 'string'
      || typeof content !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error('POST_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = PostReplyComment;
