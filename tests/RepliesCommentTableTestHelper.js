/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReplyComment({
    id = 'reply-123',
    commentId = 'comment-123',
    owner = 'user-123',
    date = new Date('2021-08-08T07:22:33.555Z').toISOString(),
    content = 'sebuah balasan',
    is_delete = false,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, commentId, owner, date, content, is_delete],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findReplyByCommentId(commentId) {
    const query = {
      text: `
        SELECT r.id, r.content, r.date, u.username, r.is_delete
        FROM replies r
        JOIN users u ON c.username = u.id
        WHERE r.comment_id = $1;
      `,
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getReplyCommentDeleteStatus(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
