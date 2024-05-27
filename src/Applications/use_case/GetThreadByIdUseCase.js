const GetThreadById = require('../../Domains/threads/entities/GetThreadById');
const GetCommentsByThreadId = require('../../Domains/commentsThread/entities/GetCommentsByThreadId');
const GetRepliesByCommentIdUseCase = require('./GetRepliesByCommentIdUseCase');
const GetLikeCountUseCase = require('./GetLikeCountUseCase');
const { formatDate, formatComment } = require('../../Commons/utils');

class GetThreadByIdUseCase {
  constructor({
    threadRepository,
    commentThreadRepository,
    replyCommentRepository,
    commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentThreadRepository = commentThreadRepository;
    this._replyCommentRepository = replyCommentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExist(useCasePayload.threadId);

    const getThreadById = new GetThreadById(useCasePayload);
    const threadData = await this._threadRepository.getThreadById(getThreadById);
    threadData.date = formatDate(threadData.date);

    const getCommentsByThreadId = new GetCommentsByThreadId(useCasePayload);
    let commentsData = await this._commentThreadRepository.getCommentsByThreadId(
      getCommentsByThreadId,
    );
    commentsData = commentsData && commentsData.comments ? commentsData.comments : [];

    const commentsWithRepliesAndLikes = await Promise.all(
      commentsData.map(async (comment) => {
        if (comment.is_delete) {
          return formatComment(comment);
        }

        const getRepliesByCommentIdUseCase = new GetRepliesByCommentIdUseCase({
          replyCommentRepository: this._replyCommentRepository,
        });
        const replies = await getRepliesByCommentIdUseCase.execute({
          commentId: comment.id,
        });

        const getLikeCountUseCase = new GetLikeCountUseCase({
          commentLikeRepository: this._commentLikeRepository,
        });
        const likeCount = await getLikeCountUseCase.execute({
          commentId: comment.id,
        });

        comment.replies = replies;
        comment.likeCount = likeCount;

        return formatComment(comment);
      }),
    );

    threadData.comments = commentsWithRepliesAndLikes;

    return threadData;
  }
}

module.exports = GetThreadByIdUseCase;
