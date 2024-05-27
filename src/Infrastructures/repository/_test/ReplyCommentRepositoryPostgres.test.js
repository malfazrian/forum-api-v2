const RepliesCommentTableTestHelper = require('../../../../tests/RepliesCommentTableTestHelper');
const CommentsThreadTableTestHelper = require('../../../../tests/CommentsThreadTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const PostReplyComment = require('../../../Domains/repliesComment/entities/PostReplyComment');
const PostedReplyComment = require('../../../Domains/repliesComment/entities/PostedReplyComment');
const GetRepliesByCommentId = require('../../../Domains/repliesComment/entities/GetRepliesByCommentId');
const RepliesDataByCommentId = require('../../../Domains/repliesComment/entities/RepliesDataByCommentId');

const pool = require('../../database/postgres/pool');
const ReplyCommentRepositoryPostgres = require('../ReplyCommentRepositoryPostgres');

describe('ReplyCommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsThreadTableTestHelper.addCommentThread({});
  });

  afterEach(async () => {
    await RepliesCommentTableTestHelper.cleanTable();
    await CommentsThreadTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyReplyCommentExist function', () => {
    it('should throw NotFoundError when reply comment not exist', async () => {
      // Arrange
      const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(
        pool,
        {},
      );

      // Action & Assert
      await expect(
        replyCommentRepositoryPostgres.verifyReplyCommentExist('reply-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply comment exist', async () => {
      // Arrange
      await RepliesCommentTableTestHelper.addReplyComment({
        id: 'reply-123',
      });
      const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(
        pool,
        {},
      );

      // Action & Assert
      await expect(
        replyCommentRepositoryPostgres.verifyReplyCommentExist('reply-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when user is not authorized', async () => {
      // Arrange
      await RepliesCommentTableTestHelper.addReplyComment({
        id: 'reply-123',
        owner: 'user-123',
      });
      const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(
        pool,
        {},
      );

      // Action & Assert
      await expect(
        replyCommentRepositoryPostgres.verifyReplyOwner({
          replyId: 'reply-123',
          ownerId: 'user-456',
        }),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when authorized', async () => {
      // Arrange
      await RepliesCommentTableTestHelper.addReplyComment({
        id: 'reply-123',
        owner: 'user-123',
      });
      const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(
        pool,
        {},
      );

      // Action & Assert
      await expect(
        replyCommentRepositoryPostgres.verifyReplyOwner({
          replyId: 'reply-123',
          ownerId: 'user-123',
        }),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('addReplyComment function', () => {
    it('should persist post comment', async () => {
      // Arrange
      const postReplyComment = new PostReplyComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await replyCommentRepositoryPostgres.addReplyComment(postReplyComment);

      // Assert
      const reply = await RepliesCommentTableTestHelper.findCommentById(
        'reply-123',
      );
      expect(reply).toHaveLength(1);
    });

    it('should return posted reply comment correctly', async () => {
      // Arrange
      const postReplyComment = new PostReplyComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const postedReplyComment = await replyCommentRepositoryPostgres.addReplyComment(postReplyComment);

      // Assert
      expect(postedReplyComment).toStrictEqual(
        new PostedReplyComment({
          id: 'reply-123',
          content: 'sebuah balasan',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('GetRepliesByCommentId function', () => {
    it('should return comments by thread ID', async () => {
      // Arrange
      await RepliesCommentTableTestHelper.addReplyComment({});

      const getRepliesByreplyId = new GetRepliesByCommentId({
        commentId: 'comment-123',
      });

      const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(
        pool,
        {},
      );

      // Action
      const repliesDataByCommentId = await replyCommentRepositoryPostgres.getRepliesByCommentId(
        getRepliesByreplyId,
      );

      // Assert
      const expectedRepliesData = new RepliesDataByCommentId([
        {
          id: 'reply-123',
          username: 'dicoding',
          date: '2024-05-14T07:15:10.694Z',
          is_delete: false,
          content: 'sebuah balasan',
        },
      ]);

      expect(repliesDataByCommentId.replies).toHaveLength(1);
      expect(repliesDataByCommentId.replies[0].id).toEqual(
        expectedRepliesData.replies[0].id,
      );
      expect(repliesDataByCommentId.replies[0].username).toEqual(
        expectedRepliesData.replies[0].username,
      );
      expect(typeof repliesDataByCommentId.replies[0].date).toBe('string');
      expect(repliesDataByCommentId.replies[0].is_delete).toEqual(
        expectedRepliesData.replies[0].is_delete,
      );
      expect(repliesDataByCommentId.replies[0].content).toEqual(
        expectedRepliesData.replies[0].content,
      );
    });

    it('should return an empty array if no replies found for the comment', async () => {
      // Arrange
      const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(
        pool,
        {},
      );

      // Action
      const repliesData = await replyCommentRepositoryPostgres.getRepliesByCommentId({
        commentId: 'comment-123',
      });

      // Assert
      expect(repliesData.replies).toHaveLength(0);
    });
  });

  describe('deleteReplyComment function', () => {
    it('should soft delete reply correctly', async () => {
      // Arrange
      await RepliesCommentTableTestHelper.addReplyComment({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(
        pool,
        {},
      );

      // Action
      await replyCommentRepositoryPostgres.deleteReplyComment({
        replyId: 'reply-123',
      });

      // Assert
      const reply = await RepliesCommentTableTestHelper.getReplyCommentDeleteStatus(
        'reply-123',
      );
      expect(reply.is_delete).toEqual(true);
    });
  });
});
