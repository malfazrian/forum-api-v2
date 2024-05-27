const DeleteReplyComment = require('../../Domains/repliesComment/entities/DeleteReplyComment');

class DeleteReplyCommentUseCase {
  constructor({ replyCommentRepository }) {
    this._replyCommentRepository = replyCommentRepository;
  }

  async execute(useCasePayload) {
    const deleteReplyComment = new DeleteReplyComment(useCasePayload);
    await this._replyCommentRepository.verifyReplyCommentExist(
      deleteReplyComment.replyId,
    );
    await this._replyCommentRepository.verifyReplyOwner(useCasePayload);
    return this._replyCommentRepository.deleteReplyComment(deleteReplyComment);
  }
}

module.exports = DeleteReplyCommentUseCase;
