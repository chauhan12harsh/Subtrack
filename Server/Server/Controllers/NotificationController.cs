using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Notifications.Dto;
using Notifications.Interfaces;
using System.Security.Claims;

namespace Notifications.Controllers
{
    [ApiController]
    [Route("notification")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService notificationService;

        public NotificationController(INotificationService _notificationService)
        {
            notificationService = _notificationService;
        }

        [HttpPost("create")]
        [Authorize(Roles = "Worker")]
        public async Task<IActionResult> CreateNotification(CreateNotificationDto createNotificationDto)
        {

            var response = await notificationService.CreateNotification(createNotificationDto);
            return Ok(response);

        }

        [HttpGet("my")]
        public async Task<IActionResult> UserNotifications()
        {

            var userId = GetCurrentUserId();

            var response = await notificationService.GetUserNotifications(userId);

            return Ok(response);
        }

        [HttpPatch("readall")]
        public async Task<IActionResult> ReadAllNotifications()
        {

            var userId = GetCurrentUserId();

            var response = await notificationService.ReadAllNotifications(userId);

            return Ok(response);
        }

        [HttpPatch("read/{notificationId:guid}")]
        public async Task<IActionResult> ReadNotification(Guid notificationId)
        {

            var userId = GetCurrentUserId();

            var response = await notificationService.ReadNotification(notificationId, userId);

            return Ok(response);
        }

        [HttpGet("unreadcount")]
        public async Task<IActionResult> CountOfUnreadNotifications()
        {

            var userId = GetCurrentUserId();

            var response = await notificationService.GetCountOfUnreadNotifications(userId);

            return Ok(response);
        }

        [HttpDelete("delete/{notificationId:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteNotifications(Guid notificationId)
        {

            var userId = GetCurrentUserId();

            var response = await notificationService.DeleteNotifications(notificationId);

            return Ok(response);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllNotifications()
        {
            var response = await notificationService.GetAllNotifications();
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
