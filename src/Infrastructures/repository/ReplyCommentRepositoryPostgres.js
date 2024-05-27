const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const PostedReplyComment = require('../../Domains/repliesComment/entities/PostedReplyComment');
const ReplyCommentRepository = require('../../Domains/repliesComment/ReplyCommentRepository');
const RepliesDataByCommentId = require('../../Domains/repliesComment/entities/RepliesDataByCommentId');

class ReplyCommentRepositoryPostgres extends ReplyCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyReplyCommentExist(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyOwner({ replyId, ownerId }) {
    const query = {
      text: 'SELECT id, user_id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].user_id !== ownerId) {
      throw new AuthorizationError('Anda tidak berhak menghapus balasan ini');
    }
  }

  async addReplyComment(postReplyComment) {
    const { commentId, content, owner } = postReplyComment;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO replies (id, comment_id, user_id, content) VALUES($1, $2, $3, $4) RETURNING id, content, user_id',
      values: [id, commentId, owner, content],
    };
    const result = await this._pool.query(query);

    const {
      id: postId,
      content: postContent,
      user_id: postOwner,
    } = result.rows[0];
    return new PostedReplyComment({
      id: postId,
      content: postContent,
      owner: postOwner,
    });
  }

  async getRepliesByCommentId(getRepliesByCommentId) {
    const { commentId } = getRepliesByCommentId;

    const query = {
      text: `
      SELECT r.id, r.content, r.date, u.username, r.is_delete
      FROM replies r
      JOIN users u ON r.user_id = u.id
      WHERE r.comment_id = $1
      ORDER BY r.date ASC;
    `,
      values: [commentId],
    };

    const repliesResult = await this._pool.query(query);

    return new RepliesDataByCommentId(repliesResult.rows);
  }

  async deleteReplyComment(deleteReplyComment) {
    const { replyId } = deleteReplyComment;
    const is_delete = true;
    const query = {
      text: 'UPDATE replies SET is_delete = $1 WHERE id = $2',
      values: [is_delete, replyId],
    };
    await this._pool.query(query);
  }
}

module.exports = ReplyCommentRepositoryPostgres;
