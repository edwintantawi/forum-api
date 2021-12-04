const {
  CommentsTableTestHelper,
} = require('../../../../tests/CommentsTableTestHelper');
const {
  RepliesTableTestHelper,
} = require('../../../../tests/RepliesTableTestHelper');
const {
  ThreadsTableTestHelper,
} = require('../../../../tests/ThreadsTableTestHelper');
const { UsersTableTestHelper } = require('../../../../tests/UsersTableTestHelper');
const { AddedReply } = require('../../../Domains/replies/entities/AddedReply');
const { NewReplies } = require('../../../Domains/replies/entities/NewReplies');
const { pool } = require('../../database/postgres/pool');
const { RepliesRepositoryPostgres } = require('../RepliesRepositoryPostgres');

describe('RepliesRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTabel();
    await CommentsTableTestHelper.cleanTabel();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReplies method', () => {
    it('should presist new replies and return the added replies correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        threadId,
        owner: ownerId,
      });

      const fakeIdGenerator = () => '123';
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const newReplies = new NewReplies({
        threadId,
        commentId,
        owner: ownerId,
        content: 'reply content!',
      });

      const expectedAddedReplies = new AddedReply({
        id: `reply-${fakeIdGenerator()}`,
        content: newReplies.content,
        owner: newReplies.owner,
      });

      const addedReplies = await repliesRepositoryPostgres.addReplies(newReplies);

      expect(addedReplies).toStrictEqual(expectedAddedReplies);
      const replies = await RepliesTableTestHelper.findRepliesById(addedReplies.id);
      expect(replies).toHaveLength(1);
    });
  });

  describe('getRepliesByCommentId method', () => {
    it('should return replies by comment id correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const replyUserId = await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'jack',
      });

      const threadId = await ThreadsTableTestHelper.addThread({ owner: ownerId });
      const commentId = await CommentsTableTestHelper.addComment({
        owner: ownerId,
        threadId,
      });

      const addedRepliesId = await RepliesTableTestHelper.addReplies({
        commentId,
        owner: replyUserId,
      });

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      const replies = await repliesRepositoryPostgres.getRepliesByCommentId(
        commentId
      );

      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual(addedRepliesId);
      expect(replies[0].username).toEqual('jack');
    });
  });
});