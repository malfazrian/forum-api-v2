const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsThreadTableTestHelper = require('../../../../tests/CommentsThreadTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const GetThreadById = require('../../../Domains/threads/entities/GetThreadById');
const ThreadDataById = require('../../../Domains/threads/entities/ThreadDataById');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyThreadExist function', () => {
    it('should throw NotFoundError when thread not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExist('thread-doesnt_exist'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread exist', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah judul',
        body: 'sebuah thread',
        owner: 'user-123',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExist('thread-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addThread function', () => {
    it('should persist post thread', async () => {
      // Arrange
      const postThread = new PostThread({
        title: 'sebuah judul',
        body: 'sebuah thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepositoryPostgres.addThread(postThread);

      // Assert
      const thread = await ThreadsTableTestHelper.getThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return posted thread correctly', async () => {
      // Arrange
      const postThread = new PostThread({
        title: 'sebuah judul',
        body: 'sebuah isi thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const postedThread = await threadRepositoryPostgres.addThread(postThread);

      // Assert
      expect(postedThread).toStrictEqual(
        new PostedThread({
          id: 'thread-123',
          title: 'sebuah judul',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('getThreadById function', () => {
    it('should return thread data when thread is found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const getThreadById = new GetThreadById({ threadId: 'thread-123' });

      const expectedThreadData = {
        id: 'thread-123',
        title: 'sebuah judul',
        body: 'sebuah thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [],
      };
      const expectedThreadDataById = new ThreadDataById(expectedThreadData);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const result = await threadRepositoryPostgres.getThreadById(
        getThreadById,
      );

      // Assert
      expect(result.id).toEqual(expectedThreadDataById.id);
      expect(result.title).toEqual(expectedThreadDataById.title);
      expect(result.body).toEqual(expectedThreadDataById.body);
      expect(result.date).toEqual(expect.any(String));
      expect(result.username).toEqual(expectedThreadDataById.username);
      expect(result.comments).toEqual(expectedThreadDataById.comments);
    });
  });
});
