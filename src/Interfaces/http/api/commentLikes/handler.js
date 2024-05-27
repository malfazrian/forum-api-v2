const LikeUnlikeCommentUseCase = require('../../../../Applications/use_case/LikeUnlikeCommentUseCase');

class CommentsLikeHandler {
  constructor(container) {
    this._container = container;

    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async putCommentLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id } = request.auth.credentials;

    const payload = {
      threadId,
      commentId,
      userId: id,
    };
    const likeUnlikeCommentUseCase = this._container.getInstance(
      LikeUnlikeCommentUseCase.name,
    );
    await likeUnlikeCommentUseCase.execute(payload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsLikeHandler;
