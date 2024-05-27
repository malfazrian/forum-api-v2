const AddReplyCommentUseCase = require('../../../../Applications/use_case/AddReplyCommentUseCase');
const DeleteReplyCommentUseCase = require('../../../../Applications/use_case/DeleteReplyCommentUseCase');

class RepliesCommentHandler {
  constructor(container) {
    this._container = container;

    this.postReplyCommentHandler = this.postReplyCommentHandler.bind(this);
    this.deleteReplyCommentHandler = this.deleteReplyCommentHandler.bind(this);
  }

  async postReplyCommentHandler(request, h) {
    const { content } = request.payload;
    const { threadId, commentId } = request.params;
    const { id } = request.auth.credentials;

    const payload = {
      threadId,
      commentId,
      content,
      owner: id,
    };
    const addReplyCommentUseCase = this._container.getInstance(
      AddReplyCommentUseCase.name,
    );
    const addedReply = await addReplyCommentUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyCommentHandler(request, h) {
    const deleteReplyCommentUseCase = this._container.getInstance(
      DeleteReplyCommentUseCase.name,
    );
    const deleteReply = {
      replyId: request.params.replyId,
      ownerId: request.auth.credentials.id,
    };

    await deleteReplyCommentUseCase.execute(deleteReply);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesCommentHandler;
