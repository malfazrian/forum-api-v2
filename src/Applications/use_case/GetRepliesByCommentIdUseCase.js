const { formatReply } = require('../../Commons/utils');
const GetRepliesByCommentId = require('../../Domains/repliesComment/entities/GetRepliesByCommentId');

class GetRepliesByCommentIdUseCase {
  constructor({ replyCommentRepository }) {
    this._replyCommentRepository = replyCommentRepository;
  }

  async execute(useCasePayload) {
    const getRepliesByCommentId = new GetRepliesByCommentId(useCasePayload);
    const repliesData = await this._replyCommentRepository.getRepliesByCommentId(
      getRepliesByCommentId,
    );

    if (!repliesData || !Array.isArray(repliesData.replies)) {
      return [];
    }

    const replies = repliesData.replies.map(formatReply);

    return replies;
  }
}

module.exports = GetRepliesByCommentIdUseCase;
