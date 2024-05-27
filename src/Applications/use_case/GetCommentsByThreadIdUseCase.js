const GetCommentsByThreadId = require('../../Domains/commentsThread/entities/GetCommentsByThreadId');

class GetCommentsByThreadIdUseCase {
  constructor({ commentThreadRepository }) {
    this._commentThreadRepository = commentThreadRepository;
  }

  async execute(useCasePayload) {
    const getCommentsByThreadId = new GetCommentsByThreadId(useCasePayload);
    const result = await this._commentThreadRepository.getCommentsByThreadId(
      getCommentsByThreadId,
    );
    const comments = [];
    const likeCount = 0;

    result.rows.forEach((row) => {
      const formattedDate = new Date(row.date).toISOString();
      comments.push({
        id: row.id,
        username: row.username,
        date: formattedDate,
        is_delete: row.is_delete,
        content: row.content,
        likeCount: 0,
      });
    });

    return comments;
  }
}

module.exports = GetCommentsByThreadIdUseCase;
