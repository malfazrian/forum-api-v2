/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addCommentThread({
    id = 'comment-123',
    threadId = 'thread-123',
    owner = 'user-123',
    date = new Date('2021-08-08T07:22:33.555Z').toISOString(),
    content = 'sebuah komentar',
    is_delete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, threadId, owner, date, content, is_delete],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findCommentByThreadId(threadId) {
    const query = {
      text: `
        SELECT c.id, u.username, c.date, c.is_delete, c.content
        FROM comments c
        JOIN users u ON c.username = u.id
        WHERE c.thread_id = $1;
      `,
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getCommentThreadDeleteStatus(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
