using Authentication.Dto;
using Authentication.Enum;
using Authentication.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Authentication.Controllers
{
    [ApiController]
    [Route("user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService userService;
        public UserController(IUserService _userService)
        {
            userService = _userService;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> UserDetail()
        {
            var userId = GetCurrentUserId();

            var response = await userService.GetUserDetailById(userId);

            return Ok(response);
        }

        [HttpPatch("update")]
        public async Task<IActionResult> UpdateProfile(UpdateUserDto updateUserDto)
        {
            Guid userId = GetCurrentUserId();

            var response = await userService.UpdateUserProfile(updateUserDto, userId);

            return Ok(response);
        }

        [HttpPatch("changepassword")]
        public async Task<IActionResult> UpdateUserPassword(UpdatePasswordDto updatePasswordDto)
        {
            Guid userId = GetCurrentUserId();

            var response = await userService.UpdateUserPassword(updatePasswordDto, userId);

            return Ok(response);
        }

        [HttpGet("alluser")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AllUserDetail()
        {

            var response = await userService.GetAllUsersDetails();

            return Ok(response);
        }

        [HttpPatch("role/{userId:guid}/{role}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUserRole(Guid userId, UserRole role)
        {
            var response = await userService.UpdateUserRole(userId, role);

            return Ok(response);
        }

        // Utility
        private Guid GetCurrentUserId()
        {

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdString, out var userId))
            {
                throw new UnauthorizedAccessException("Invalid user identifier.");
            }
            // return userId converted to guid from string
            return userId;
        }
    }
}
