using SubTrack.Authentication.Dtos;
using SubTrack.Authentication.Entities;
using SubTrack.Authentication.Enums;
using SubTrack.Authentication.Exceptions;
using SubTrack.Authentication.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SubTrack.Data;
using SubTrack.Dtos.Auth;
using SubTrack.Exceptions;
using SubTrack.Exceptions.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SubTrack.Authentication.Services
{
    public class AuthService(ApplicationDbContext context, IConfiguration configuration) : IAuthService
    {
        public async Task<UserResponseDto> CreateNewUser(UserRegisterDto userRegisterDto)
        {
            var user = await context.User.AnyAsync(u => u.Email == userRegisterDto.Email);

            if (user)
            {
                throw new AlreadyExistsException("User with this email already exists");
            }

            var newUser = new User
            {
                Username = userRegisterDto.Username,
                Email = userRegisterDto.Email,
                Balance = userRegisterDto.Balance,
                Role = UserRole.User
            };

            newUser.PasswordHash = new PasswordHasher<User>().HashPassword(newUser, userRegisterDto.Password);

            context.User.Add(newUser);
            await context.SaveChangesAsync();

            UserResponseDto userResponseDto = new UserResponseDto
            {
                Id = newUser.Id,
                Username = newUser.Username,
                Email = newUser.Email,
                Balance = newUser.Balance,
                Role = newUser.Role
            };

            return userResponseDto;
        }

        public async Task<TokenResponseDto> AuthenticateUser(UserLoginDto userLoginDto)
        {
            var user = await context.User.FirstOrDefaultAsync(u => u.Email == userLoginDto.Email);

            if (user is null)
            {
                throw new BadRequestException("Invalid email or password");
            }

            var isPasswordValid = new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, userLoginDto.Password);

            if (isPasswordValid == PasswordVerificationResult.Failed)
            {
                throw new BadRequestException("Invalid email or password");
            }

            string token = CreateJwtToken(user);

            TokenResponseDto tokenResponseDto = new TokenResponseDto
            {
                Token = token,
            };

            return tokenResponseDto;
        }

        private string CreateJwtToken(User user)
        {

            var claim = new List<Claim>{
                        new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                        new Claim(ClaimTypes.Role,user.Role.ToString())
                    };

            // Validate configuration values to avoid passing null into Encoding.GetBytes
            var securityKey = configuration.GetValue<string>("TokenDetails:SigningKey");
            if (string.IsNullOrWhiteSpace(securityKey))
            {
                throw new JwtConfigurationException("Configuration value 'TokenDetails:SigningKey' is missing or empty.");
            }

            var issuer = configuration.GetValue<string>("TokenDetails:Issuer");
            if (string.IsNullOrWhiteSpace(issuer))
            {
                throw new JwtConfigurationException("Configuration value 'TokenDetails:Issuer' is missing or empty.");
            }

            var audience = configuration.GetValue<string>("TokenDetails:Audience");
            if (string.IsNullOrWhiteSpace(audience))
            {
                throw new JwtConfigurationException("Configuration value 'TokenDetails:Audience' is missing or empty.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claim,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            var JwtToken = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);

            return JwtToken;
        }
    }
}
