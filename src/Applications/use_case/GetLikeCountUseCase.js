const GetCommentLikeCount = require('../../Domains/likeUnlikeComment/entities/GetCommentLikeCount');

class GetLikeCountUseCase {
  constructor({ commentLikeRepository }) {
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    const getCommentLikeCount = new GetCommentLikeCount(useCasePayload);
    const result = await this._commentLikeRepository.getLikeCount(
      getCommentLikeCount,
    );

    return result.likeCount;
  }
}

module.exports = GetLikeCountUseCase;
