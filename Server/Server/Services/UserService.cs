using Authentication.Data;
using Authentication.Dto;
using Authentication.Entity;
using Authentication.Enum;
using Authentication.Exceptions;
using Authentication.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Authentication.Services
{
    public class UserService(UserDbContext context) : IUserService
    {
        public async Task<UserResponseDto> GetUserDetailById(Guid userId)
        {
            var user = await context.User
                        .AsNoTracking()
                        .Select(user => new UserResponseDto
                        {
                            Id = user.Id,
                            Username = user.Username,
                            Email = user.Email,
                            Balance = user.Balance,
                            Role = user.Role,
                            CreatedAt = user.CreatedAt,
                        }
                        )
                        .FirstOrDefaultAsync(x => x.Id == userId);

            if (user is null)
            {
                throw new NotFoundException("User Not found");
            }

            return user;
        }

        public async Task<List<UserResponseDto>> GetAllUsersDetails()
        {
            var users = await context.User
                        .AsNoTracking()
                        .Select(user => new UserResponseDto
                        {
                            Id = user.Id,
                            Username = user.Username,
                            Email = user.Email,
                            Balance = user.Balance,
                            Role = user.Role,
                            CreatedAt = user.CreatedAt,
                        }
                        )
                        .ToListAsync();

            return users;
        }

        public async Task<string> UpdateUserRole(Guid userId, UserRole role)
        {
            var user = await context.User
                        .FirstOrDefaultAsync(x => x.Id == userId);

            if (user is null)
            {
                throw new NotFoundException("User not found");
            }

            if (user.Role == role)
            {
                throw new BadRequestException($"Role is already {role}");
            }

            // validating enum values
            if (!System.Enum.IsDefined(typeof(UserRole), role))
            {
                throw new NotFoundException("Invalid Role.");
            }

            user.Role = role;

            await context.SaveChangesAsync();

            return $"User role updated to {role}.";
        }

        public async Task<UserResponseDto> UpdateUserProfile(UpdateUserDto updateUserDto, Guid userId)
        {
            var user = await context.User
                        .FirstOrDefaultAsync(x => x.Id == userId);

            if (user is null)
            {
                throw new NotFoundException("User not found");
            }

            user.Email = !string.IsNullOrWhiteSpace(updateUserDto.Email) ? updateUserDto.Email : user.Email;
            user.Username = !string.IsNullOrWhiteSpace(updateUserDto.Username) ? updateUserDto.Username : user.Username;
            user.Balance = (updateUserDto.Balance != 0m) ? updateUserDto.Balance: user.Balance;

            context.User.Update(user);
            await context.SaveChangesAsync();

            UserResponseDto userResponseDto = new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Balance = user.Balance,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
            };

            return userResponseDto;
        }

        public async Task<string> UpdateUserPassword(UpdatePasswordDto updatePasswordDto, Guid userId)
        {
            var user = await context.User
                        .FirstOrDefaultAsync(x => x.Id == userId);

            if (user is null)
            {
                throw new NotFoundException("User not found");
            }

            var newPasswordHash = new PasswordHasher<User>().HashPassword(user, updatePasswordDto.Password);

            user.PasswordHash = newPasswordHash;

            context.User.Update(user);
            await context.SaveChangesAsync();

            return "Password Updated";
        }
    }
}
