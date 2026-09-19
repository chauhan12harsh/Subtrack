using SubTrack.Authentication.Dtos;
using SubTrack.Dtos.Auth;

namespace SubTrack.Authentication.Interfaces
{
    public interface IAuthService
    {
        public Task<UserResponseDto> CreateNewUser(UserRegisterDto userRegisterDto);
        public Task<TokenResponseDto> AuthenticateUser(UserLoginDto userLoginDto);     
    }
}
