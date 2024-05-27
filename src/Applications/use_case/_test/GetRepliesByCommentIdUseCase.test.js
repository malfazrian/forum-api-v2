const GetRepliesByCommentId = require('../../../Domains/repliesComment/entities/GetRepliesByCommentId');
const GetRepliesByCommentIdUseCase = require('../GetRepliesByCommentIdUseCase');

describe('GetRepliesByCommentIdUseCase', () => {
  it('should orchestrate the get replies action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
    };

    const mockReplyCommentRepository = {
      getRepliesByCommentId: jest.fn(() => ({
        replies: [
          {
            id: 'reply-1',
            content: 'This is a reply',
            date: '2024-05-03T12:00:00.000Z',
            username: 'user1',
            is_delete: false,
          },
          {
            id: 'reply-2',
            content: 'This reply has been deleted',
            date: '2024-05-04T08:00:00.000Z',
            username: 'user2',
            is_delete: true,
          },
        ],
      })),
    };

    const getRepliesByCommentIdUseCase = new GetRepliesByCommentIdUseCase({
      replyCommentRepository: mockReplyCommentRepository,
    });

    // Action
    const repliesData = await getRepliesByCommentIdUseCase.execute(
      useCasePayload,
    );

    // Assert
    expect(repliesData).toEqual([
      {
        id: 'reply-1',
        content: 'This is a reply',
        date: '2024-05-03T12:00:00.000Z',
        username: 'user1',
      },
      {
        id: 'reply-2',
        content: '**balasan telah dihapus**',
        date: '2024-05-04T08:00:00.000Z',
        username: 'user2',
      },
    ]);

    expect(
      mockReplyCommentRepository.getRepliesByCommentId,
    ).toHaveBeenCalledWith(new GetRepliesByCommentId(useCasePayload));
  });

  it('should return an empty array when result is null or undefined', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
    };

    const mockReplyCommentRepository = {
      getRepliesByCommentId: jest.fn(() => null),
    };

    const getRepliesByCommentIdUseCase = new GetRepliesByCommentIdUseCase({
      replyCommentRepository: mockReplyCommentRepository,
    });

    // Action
    const repliesData = await getRepliesByCommentIdUseCase.execute(
      useCasePayload,
    );

    // Assert
    expect(repliesData).toEqual([]);

    expect(
      mockReplyCommentRepository.getRepliesByCommentId,
    ).toHaveBeenCalledWith(new GetRepliesByCommentId(useCasePayload));
  });

  it('should return an empty array when result.rows is not an array', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
    };

    const mockReplyCommentRepository = {
      getRepliesByCommentId: jest.fn(() => ({ rows: 'not an array' })),
    };

    const getRepliesByCommentIdUseCase = new GetRepliesByCommentIdUseCase({
      replyCommentRepository: mockReplyCommentRepository,
    });

    // Action
    const repliesData = await getRepliesByCommentIdUseCase.execute(
      useCasePayload,
    );

    // Assert
    expect(repliesData).toEqual([]);

    expect(
      mockReplyCommentRepository.getRepliesByCommentId,
    ).toHaveBeenCalledWith(new GetRepliesByCommentId(useCasePayload));
  });

  it('should return an empty array when result is an object without rows', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
    };

    const mockReplyCommentRepository = {
      getRepliesByCommentId: jest.fn(() => ({})),
    };

    const getRepliesByCommentIdUseCase = new GetRepliesByCommentIdUseCase({
      replyCommentRepository: mockReplyCommentRepository,
    });

    // Action
    const repliesData = await getRepliesByCommentIdUseCase.execute(
      useCasePayload,
    );

    // Assert
    expect(repliesData).toEqual([]);

    expect(
      mockReplyCommentRepository.getRepliesByCommentId,
    ).toHaveBeenCalledWith(new GetRepliesByCommentId(useCasePayload));
  });
});
