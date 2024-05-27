const PostReplyComment = require('../../../Domains/repliesComment/entities/PostReplyComment');
const PostedReplyComment = require('../../../Domains/repliesComment/entities/PostedReplyComment');
const CommentThreadRepository = require('../../../Domains/commentsThread/CommentThreadRepository');
const ReplyCommentRepository = require('../../../Domains/repliesComment/ReplyCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyCommentUseCase = require('../AddReplyCommentUseCase');

describe('AddReplyCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add reply of comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    const mockPostedReplyComment = new PostedReplyComment({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** Creating dependencies of use case */
    const mockReplyCommentRepository = new ReplyCommentRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();
    const mockThreadRepository = new ThreadRepository();

    /** Mocking needed functions */
    mockThreadRepository.verifyThreadExist = jest.fn().mockResolvedValue();
    mockCommentThreadRepository.verifyCommentThreadExist = jest
      .fn()
      .mockResolvedValue();
    mockReplyCommentRepository.addReplyComment = jest
      .fn()
      .mockResolvedValue(mockPostedReplyComment);

    /** Creating use case instance */
    const addCommentUseCase = new AddReplyCommentUseCase({
      replyCommentRepository: mockReplyCommentRepository,
      commentThreadRepository: mockCommentThreadRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const postedReplyComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(postedReplyComment).toStrictEqual(
      new PostedReplyComment({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );

    expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );

    expect(
      mockCommentThreadRepository.verifyCommentThreadExist,
    ).toHaveBeenCalledWith(useCasePayload.commentId);

    expect(mockReplyCommentRepository.addReplyComment).toHaveBeenCalledWith(
      new PostReplyComment({
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );
  });
});
