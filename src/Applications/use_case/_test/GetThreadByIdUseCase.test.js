const GetThreadById = require('../../../Domains/threads/entities/GetThreadById');
const GetCommentsByThreadId = require('../../../Domains/commentsThread/entities/GetCommentsByThreadId');
const CommentsDataByThreadId = require('../../../Domains/commentsThread/entities/CommentsDataByThreadId');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');
const GetRepliesByCommentIdUseCase = require('../GetRepliesByCommentIdUseCase');
const GetLikeCountUseCase = require('../GetLikeCountUseCase');

describe('GetThreadByIdUseCase', () => {
  it('should orchestrate the get thread by id action correctly with one comment', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThreadData = {
      id: 'thread-123',
      title: 'sebuah judul thread',
      body: 'sebuah thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'user-123',
      comments: [],
    };

    const expectedThreadData = {
      id: 'thread-123',
      title: 'sebuah judul thread',
      body: 'sebuah thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'user-123',
      comments: [],
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadData));

    const mockCommentThreadRepositoryWithComments = {
      getCommentsByThreadId: jest.fn(() => Promise.resolve(
        new CommentsDataByThreadId([
          {
            id: 'comment-1',
            username: 'user1',
            date: '2024-05-03T12:00:00Z',
            is_delete: false,
            content: 'sebuah komentar',
            likeCount: 10,
          },
          {
            id: 'comment-2',
            username: 'user2',
            date: '2024-05-04T08:00:00Z',
            is_delete: true,
            content: '**komentar telah dihapus**',
            likeCount: 0,
          },
        ]),
      )),
    };

    const mockCommentThreadRepositoryWithoutComments = {
      getCommentsByThreadId: jest.fn(() => Promise.resolve()),
    };

    const mockReplyCommentRepository = {
      getRepliesByCommentId: jest.fn(() => Promise.resolve([])),
    };

    const mockCommentLikeRepository = {
      getLikeCount: jest.fn(({ commentId }) => {
        if (commentId === 'comment-1') {
          return Promise.resolve({ likeCount: 10 });
        }
        return Promise.resolve({ likeCount: 0 });
      }),
    };

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentThreadRepository: mockCommentThreadRepositoryWithComments,
      replyCommentRepository: mockReplyCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    const getThreadByIdUseCaseWithoutComments = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentThreadRepository: mockCommentThreadRepositoryWithoutComments,
      replyCommentRepository: mockReplyCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    const threadDataById = await getThreadByIdUseCase.execute(useCasePayload);
    const threadDataByIdWithoutComments = await getThreadByIdUseCaseWithoutComments.execute(useCasePayload);

    expect(threadDataById).toEqual(expectedThreadData);
    expect(threadDataByIdWithoutComments).toEqual({
      id: 'thread-123',
      title: 'sebuah judul thread',
      body: 'sebuah thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'user-123',
      comments: [],
    });
    expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      new GetThreadById(useCasePayload),
    );
    expect(
      mockCommentThreadRepositoryWithComments.getCommentsByThreadId,
    ).toHaveBeenCalledWith(new GetCommentsByThreadId(useCasePayload));
    expect(
      mockReplyCommentRepository.getRepliesByCommentId,
    ).toHaveBeenCalledTimes(1);
    expect(mockCommentLikeRepository.getLikeCount).toHaveBeenCalledTimes(1);
  });
});
