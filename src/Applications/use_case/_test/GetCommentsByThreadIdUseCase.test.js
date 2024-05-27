const GetCommentsByThreadId = require('../../../Domains/commentsThread/entities/GetCommentsByThreadId');
const GetCommentsByThreadIdUseCase = require('../GetCommentsByThreadIdUseCase');

describe('GetCommentsByThreadIdUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrate the get comments action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    // Create a mock implementation for getCommentsByThreadId method
    const mockCommentThreadRepository = {
      getCommentsByThreadId: jest.fn(() => ({
        rows: [
          {
            id: 'comment-1',
            username: 'user1',
            date: '2024-05-03T12:00:00.000Z',
            is_delete: false,
            content: 'sebuah komentar',
            likeCount: 0,
          },
          {
            id: 'comment-2',
            username: 'user2',
            date: '2024-05-04T08:00:00.000Z',
            is_delete: true,
            content: '**komentar telah dihapus**',
            likeCount: 0,
          },
        ],
      })),
    };

    const getCommentsByThreadIdUseCase = new GetCommentsByThreadIdUseCase({
      commentThreadRepository: mockCommentThreadRepository,
    });

    // Action
    const commentsData = await getCommentsByThreadIdUseCase.execute(
      useCasePayload,
    );

    // Assert
    expect(commentsData).toEqual([
      {
        id: 'comment-1',
        username: 'user1',
        date: '2024-05-03T12:00:00.000Z',
        is_delete: false,
        content: 'sebuah komentar',
        likeCount: 0,
      },
      {
        id: 'comment-2',
        username: 'user2',
        date: '2024-05-04T08:00:00.000Z',
        is_delete: true,
        content: '**komentar telah dihapus**',
        likeCount: 0,
      },
    ]);

    expect(
      mockCommentThreadRepository.getCommentsByThreadId,
    ).toHaveBeenCalledWith(new GetCommentsByThreadId(useCasePayload));
  });
});
