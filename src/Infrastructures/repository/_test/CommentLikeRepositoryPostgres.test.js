const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsThreadTableTestHelper = require('../../../../tests/CommentsThreadTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentLikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user123' });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      owner: 'user-123',
    });
    await CommentsThreadTableTestHelper.addCommentThread({
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    });
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsThreadTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyLikeStatus function', () => {
    it('should return true if the like exists', async () => {
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-123',
        userId: 'user-123',
        commentId: 'comment-123',
      });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        () => '123',
      );

      const result = await commentLikeRepositoryPostgres.verifyLikeStatus(
        'user-123',
        'comment-123',
      );

      expect(result).toBe(true);
    });

    it('should return false if the like does not exist', async () => {
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        () => '123',
      );

      const result = await commentLikeRepositoryPostgres.verifyLikeStatus(
        'user-123',
        'comment-123',
      );

      expect(result).toBe(false);
    });
  });

  describe('addCommentLike function', () => {
    it('should add a like to the comment', async () => {
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        () => '123',
      );
      await commentLikeRepositoryPostgres.addCommentLike(
        'user-123',
        'comment-123',
      );

      const like = await CommentLikesTableTestHelper.verifyLikeStatus(
        'user-123',
        'comment-123',
      );
      expect(like).toBe(true);
    });
  });

  describe('getLikeCount function', () => {
    it('should return the like count for a comment', async () => {
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-123',
        userId: 'user-123',
        commentId: 'comment-123',
      });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        () => '123',
      );

      const likeCount = await commentLikeRepositoryPostgres.getLikeCount({
        commentId: 'comment-123',
      });

      expect(likeCount.likeCount).toBe(1);
    });
  });

  describe('unlikeComment function', () => {
    it('should remove the like from the comment', async () => {
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-123',
        userId: 'user-123',
        commentId: 'comment-123',
      });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        () => '123',
      );

      await commentLikeRepositoryPostgres.unlikeComment(
        'user-123',
        'comment-123',
      );

      const like = await CommentLikesTableTestHelper.verifyLikeStatus(
        'user-123',
        'comment-123',
      );
      expect(like).toBe(false);
    });
  });
});
