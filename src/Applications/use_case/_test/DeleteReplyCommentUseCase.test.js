const DeleteReplyComment = require('../../../Domains/repliesComment/entities/DeleteReplyComment');
const ReplyCommentRepository = require('../../../Domains/repliesComment/ReplyCommentRepository');
const DeleteReplyCommentUseCase = require('../DeleteReplyCommentUseCase');

describe('DeleteReplyCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete reply of comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      ownerId: 'user-123',
    };

    /** creating dependency of use case */
    const mockReplyCommentRepository = new ReplyCommentRepository();

    /** mocking needed function */
    mockReplyCommentRepository.verifyReplyCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyCommentRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyCommentRepository.deleteReplyComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({
      replyCommentRepository: mockReplyCommentRepository,
    });

    // Action
    await deleteReplyCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyCommentRepository.verifyReplyCommentExist).toBeCalledWith(
      useCasePayload.replyId,
    );

    expect(mockReplyCommentRepository.verifyReplyOwner).toBeCalledWith(
      useCasePayload,
    );

    expect(mockReplyCommentRepository.deleteReplyComment).toBeCalledWith(
      new DeleteReplyComment({
        replyId: useCasePayload.replyId,
        ownerId: useCasePayload.ownerId,
      }),
    );
  });
});
