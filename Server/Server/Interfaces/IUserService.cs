using Authentication.Dto;
using Authentication.Enum;

namespace Authentication.Interfaces
{
    public interface IUserService
    {
        public Task<UserResponseDto> GetUserDetailById(Guid userId);
        public Task<List<UserResponseDto>> GetAllUsersDetails();
        public Task<string> UpdateUserRole(Guid userId, UserRole role);
        public Task<UserResponseDto> UpdateUserProfile(UpdateUserDto updateUserDto, Guid userId);
        public Task<string> UpdateUserPassword(UpdatePasswordDto updatePasswordDto, Guid userId);
    }
}
