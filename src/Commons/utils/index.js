/* istanbul ignore file */
function formatDate(date) {
  return new Date(date).toISOString();
}

function formatReply(reply) {
  return {
    id: reply.id,
    content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
    date: formatDate(reply.date),
    username: reply.username,
  };
}

function formatComment(comment) {
  const formattedComment = {
    id: comment.id,
    username: comment.username,
    date: formatDate(comment.date),
    replies: [],
    content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
    likeCount: comment.likeCount,
  };

  if (!comment.is_delete && comment.replies) {
    formattedComment.replies = comment.replies.map(formatReply);
  }

  return formattedComment;
}

module.exports = {
  formatDate,
  formatReply,
  formatComment,
};
