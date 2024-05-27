const LikeCommentThread = require('../../Domains/likeUnlikeComment/entities/LikeCommentThread');

class LikeUnlikeCommentUseCase {
  constructor({
    commentLikeRepository,
    commentThreadRepository,
    threadRepository,
  }) {
    this._commentLikeRepository = commentLikeRepository;
    this._commentThreadRepository = commentThreadRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const likeCommentThread = new LikeCommentThread(useCasePayload);
    await this._threadRepository.verifyThreadExist(likeCommentThread.threadId);
    await this._commentThreadRepository.verifyCommentThreadExist(
      likeCommentThread.commentId,
    );
    const likeStatus = await this._commentLikeRepository.verifyLikeStatus(
      useCasePayload.userId,
      useCasePayload.commentId,
    );
    if (likeStatus) {
      await this._commentLikeRepository.unlikeComment(
        useCasePayload.userId,
        useCasePayload.commentId,
      );
    } else {
      await this._commentLikeRepository.addCommentLike(
        useCasePayload.userId,
        useCasePayload.commentId,
      );
    }
  }
}

module.exports = LikeUnlikeCommentUseCase;
