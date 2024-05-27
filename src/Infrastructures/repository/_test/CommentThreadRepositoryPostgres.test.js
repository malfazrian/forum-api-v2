const CommentsThreadTableTestHelper = require('../../../../tests/CommentsThreadTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const PostCommentThread = require('../../../Domains/commentsThread/entities/PostCommentThread');
const PostedCommentThread = require('../../../Domains/commentsThread/entities/PostedCommentThread');
const GetCommentsByThreadId = require('../../../Domains/commentsThread/entities/GetCommentsByThreadId');
const CommentsDataByThreadId = require('../../../Domains/commentsThread/entities/CommentsDataByThreadId');
const pool = require('../../database/postgres/pool');
const CommentThreadRepositoryPostgres = require('../CommentThreadRepositoryPostgres');

describe('CommentThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await CommentsThreadTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyCommentThreadExist function', () => {
    it('should throw NotFoundError when comment thread not exist', async () => {
      // Arrange
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentThreadRepositoryPostgres.verifyCommentThreadExist('comment-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment thread exist', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await CommentsThreadTableTestHelper.addCommentThread({
        id: 'comment-123',
      });
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentThreadRepositoryPostgres.verifyCommentThreadExist('comment-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when user is not authorized', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await CommentsThreadTableTestHelper.addCommentThread({
        id: 'comment-123',
        owner: 'user-123',
      });
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentThreadRepositoryPostgres.verifyCommentOwner({
          commentId: 'comment-123',
          ownerId: 'user-456',
        }),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when authorized', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await CommentsThreadTableTestHelper.addCommentThread({
        id: 'comment-123',
        owner: 'user-123',
      });
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentThreadRepositoryPostgres.verifyCommentOwner({
          commentId: 'comment-123',
          ownerId: 'user-123',
        }),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('addCommentThread function', () => {
    it('should persist post comment', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      const postCommentThread = new PostCommentThread({
        threadId: 'thread-123',
        content: 'sebuah komentar',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentThreadRepositoryPostgres.addCommentThread(postCommentThread);

      // Assert
      const comment = await CommentsThreadTableTestHelper.findCommentById(
        'comment-123',
      );
      expect(comment).toHaveLength(1);
    });

    it('should return posted comment thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      const postCommentThread = new PostCommentThread({
        threadId: 'thread-123',
        content: 'sebuah komentar',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const postedCommentThread = await commentThreadRepositoryPostgres.addCommentThread(
        postCommentThread,
      );

      // Assert
      expect(postedCommentThread).toStrictEqual(
        new PostedCommentThread({
          id: 'comment-123',
          content: 'sebuah komentar',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments by thread ID', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-999',
        username: 'user-999',
      });
      await ThreadsTableTestHelper.addThread({ id: 'thread-999' });
      await CommentsThreadTableTestHelper.addCommentThread({
        id: 'comment-999',
        threadId: 'thread-999',
        owner: 'user-999',
        date: '2024-05-14T07:15:10.694Z',
        is_delete: false,
      });

      const getCommentsByThreadId = new GetCommentsByThreadId({
        threadId: 'thread-999',
      });

      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

      // Action
      const commentsDataByThreadId = await commentThreadRepositoryPostgres.getCommentsByThreadId(
        getCommentsByThreadId,
      );

      // Assert
      const expectedCommentsData = new CommentsDataByThreadId([
        {
          id: 'comment-999',
          username: 'user-999',
          date: '2024-05-14T07:15:10.694Z',
          is_delete: false,
          content: 'sebuah komentar',
        },
      ]);

      expect(commentsDataByThreadId.comments).toHaveLength(1);
      expect(commentsDataByThreadId.comments[0].id).toEqual(
        expectedCommentsData.comments[0].id,
      );
      expect(commentsDataByThreadId.comments[0].username).toEqual(
        expectedCommentsData.comments[0].username,
      );
      expect(typeof commentsDataByThreadId.comments[0].date).toBe('string');
      expect(commentsDataByThreadId.comments[0].is_delete).toEqual(
        expectedCommentsData.comments[0].is_delete,
      );
      expect(commentsDataByThreadId.comments[0].content).toEqual(
        expectedCommentsData.comments[0].content,
      );
    });

    it('should return an empty array if no comments found for the thread', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-456' });
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

      // Action
      const commentsData = await commentThreadRepositoryPostgres.getCommentsByThreadId({
        threadId: 'non-existing-thread-id',
      });

      // Assert
      expect(commentsData.comments).toHaveLength(0);
    });
  });

  describe('deleteCommentThread function', () => {
    it('should soft delete comment correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsThreadTableTestHelper.addCommentThread({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

      // Action
      await commentThreadRepositoryPostgres.deleteCommentThread({
        commentId: 'comment-123',
      });

      // Assert
      const comment = await CommentsThreadTableTestHelper.getCommentThreadDeleteStatus(
        'comment-123',
      );
      expect(comment.is_delete).toEqual(true);
    });
  });
});
