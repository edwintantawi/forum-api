const { RepliesRepository } = require('../RepliesRepository');

describe('RepliesRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const repliesRepository = new RepliesRepository();

    await expect(repliesRepository.addReplies({})).rejects.toThrowError(
      'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );

    await expect(
      repliesRepository.getRepliesByCommentIds([''])
    ).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(repliesRepository.deleteRepliesById('')).rejects.toThrowError(
      'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );

    await expect(repliesRepository.checkReplies('', '')).rejects.toThrowError(
      'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );

    await expect(repliesRepository.checkRepliesAccess('', '')).rejects.toThrowError(
      'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
