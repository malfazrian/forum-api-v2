const PostReplyComment = require('../../Domains/repliesComment/entities/PostReplyComment');

class AddReplyCommentUseCase {
  constructor({
    threadRepository,
    commentThreadRepository,
    replyCommentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentThreadRepository = commentThreadRepository;
    this._replyCommentRepository = replyCommentRepository;
  }

  async execute(useCasePayload) {
    const postReplyComment = new PostReplyComment(useCasePayload);
    await this._threadRepository.verifyThreadExist(postReplyComment.threadId);
    await this._commentThreadRepository.verifyCommentThreadExist(
      postReplyComment.commentId,
    );
    return this._replyCommentRepository.addReplyComment(postReplyComment);
  }
}

module.exports = AddReplyCommentUseCase;
