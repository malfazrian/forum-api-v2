class RepliesDataByCommentId {
  constructor(payloads) {
    if (!Array.isArray(payloads)) {
      payloads = [payloads];
    }

    this.replies = payloads.length ? payloads.map(this._createReply) : [];
  }

  _createReply({
    id, content, date, username, is_delete,
  }) {
    if (!id || !content || !date || !username) {
      throw new Error('REPLIES_DATA_BY_COMMENT_ID.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    // Convert date to string format
    const dateString = new Date(date).toISOString();

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof dateString !== 'string'
      || typeof username !== 'string'
    ) {
      throw new Error(
        'REPLIES_DATA_BY_COMMENT_ID.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }

    return {
      id,
      content,
      date: dateString,
      username,
      is_delete,
    };
  }
}

module.exports = RepliesDataByCommentId;
