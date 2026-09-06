using Authentication.Dto;

namespace Authentication.Interfaces
{
    public interface IAuthService
    {
        public Task<UserResponseDto> CreateNewUser(UserRegisterDto userRegisterDto);
        public Task<TokenResponseDto> AuthenticateUser(UserLoginDto userLoginDto);     
    }
}
