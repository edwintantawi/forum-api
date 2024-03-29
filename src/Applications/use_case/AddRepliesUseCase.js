const { NewReplies } = require('../../Domains/replies/entities/NewReplies');

class AddRepliesUseCase {
  constructor({ commentRepository, repliesRepository }) {
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(useCasePayload) {
    const newReplies = new NewReplies(useCasePayload);
    await this._commentRepository.checkComment(
      newReplies.commentId,
      newReplies.threadId
    );
    const addedReplies = await this._repliesRepository.addReplies(newReplies);

    return addedReplies;
  }
}

module.exports = { AddRepliesUseCase };
