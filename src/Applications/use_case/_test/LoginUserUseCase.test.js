const { UserRepository } = require('../../../Domains/users/UserRepository');
const {
  AuthenticationRepository,
} = require('../../../Domains/authentications/AuthenticationRepository');
const {
  AuthenticationTokenManager,
} = require('../../security/AuthenticationTokenManager');
const { PasswordHash } = require('../../security/PasswordHash');
const { LoginUserUseCase } = require('../LoginUserUseCase');
const {
  NewAuthentication,
} = require('../../../Domains/authentications/entities/NewAuthentication');

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const expectedAuthentication = new NewAuthentication({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });
    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    // Mocking
    mockUserRepository.getPasswordByUsername = jest.fn(() =>
      Promise.resolve('encrypted_password')
    );

    mockPasswordHash.comparePassword = jest.fn(() => Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken = jest.fn(() =>
      Promise.resolve(expectedAuthentication.accessToken)
    );
    mockAuthenticationTokenManager.createRefreshToken = jest.fn(() =>
      Promise.resolve(expectedAuthentication.refreshToken)
    );
    mockUserRepository.getIdByUsername = jest.fn(() => Promise.resolve('user-123'));
    mockAuthenticationRepository.addToken = jest.fn(() => Promise.resolve());

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    expect(actualAuthentication).toEqual(expectedAuthentication);
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith('dicoding');
    expect(mockPasswordHash.comparePassword).toBeCalledWith(
      'secret',
      'encrypted_password'
    );
    expect(mockUserRepository.getIdByUsername).toBeCalledWith('dicoding');
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      username: 'dicoding',
      id: 'user-123',
    });
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({
      username: 'dicoding',
      id: 'user-123',
    });
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(
      expectedAuthentication.refreshToken
    );
  });
});
