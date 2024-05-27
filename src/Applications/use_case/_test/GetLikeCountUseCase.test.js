const GetLikeCountUseCase = require('../GetLikeCountUseCase');
const GetCommentLikeCount = require('../../../Domains/likeUnlikeComment/entities/GetCommentLikeCount');

describe('GetLikeCountUseCase', () => {
  it('should orchestrate the get like count action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-1',
    };

    const expectedLikeCount = 10;
    const mockCommentLikeRepository = {
      getLikeCount: jest.fn(() => Promise.resolve({ likeCount: expectedLikeCount })),
    };

    const getLikeCountUseCase = new GetLikeCountUseCase({
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Act
    const result = await getLikeCountUseCase.execute(useCasePayload);

    // Assert
    expect(result).toEqual(expectedLikeCount);
    expect(mockCommentLikeRepository.getLikeCount).toBeCalledWith(
      new GetCommentLikeCount(useCasePayload),
    );
  });
});
