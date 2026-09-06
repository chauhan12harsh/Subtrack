using Microsoft.EntityFrameworkCore;
using Notifications.Data;
using Notifications.Dto;
using Notifications.Entity;
using Notifications.Interfaces;

namespace Notifications.Services
{
    public class NotificationService(NotificationDbContext context) : INotificationService
    {
        public async Task<NotificationResponseDto> CreateNotification(CreateNotificationDto createNotificationDto)
        {
            Notification notification = new Notification
            {

                UserId = createNotificationDto.UserId,
                Title = createNotificationDto.Title,
                Message = createNotificationDto.Message,
                Type = createNotificationDto.Type,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            context.Notification.Add(notification);
            await context.SaveChangesAsync();

            NotificationResponseDto notificationResponseDto = new NotificationResponseDto
            {
                Id = notification.Id,
                UserId = notification.UserId,
                Title = notification.Title,
                Message = notification.Message,
                Type = notification.Type,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt
            };

            return notificationResponseDto;
        }

        public async Task<int> GetCountOfUnreadNotifications(Guid userId)
        {

            var notificationsCount = await context.Notification.CountAsync(x => !x.IsRead && x.UserId == userId);

            return notificationsCount;
        }

        public async Task<List<NotificationResponseDto>> GetUserNotifications(Guid userId)
        {
            var notifications = await context.Notification
                               .AsNoTracking()
                               .Where(x => x.UserId == userId)
                               .OrderByDescending(x => x.CreatedAt)
                               .Select(notification => new NotificationResponseDto
                               {
                                   Id = notification.Id,
                                   UserId = notification.UserId,
                                   Title = notification.Title,
                                   Message = notification.Message,
                                   Type = notification.Type,
                                   IsRead = notification.IsRead,
                                   CreatedAt = notification.CreatedAt
                               }
                               )
                               .ToListAsync();

            return notifications;
        }

        public async Task<string> ReadAllNotifications(Guid userId)
        {
            var notifications = await context.Notification
                                    .Where(x => x.UserId == userId)
                                    .ToListAsync();

            if (!notifications.Any())
            {
                throw new ArgumentException("All Notifications are already seen");
            }

            foreach (var item in notifications)
            {
                item.IsRead = true;
            }

            await context.SaveChangesAsync();
            return "Marked All notification as Seen";
        }

        public async Task<string> ReadNotification(Guid notificationId, Guid userId)
        {

            var notification = await context.Notification
                                .FirstOrDefaultAsync(x => x.Id == notificationId && x.UserId == userId);

            if (notification is null)
            {
                throw new ArgumentException("No notifications found.");
            }

            if (notification.IsRead)
            {
                throw new ArgumentException("Notification already seen");
            }

            notification.IsRead = true;
            await context.SaveChangesAsync();

            return "Marked Seen";
        }

        public async Task<string> DeleteNotifications(Guid notificationId)
        {
            var notification = await context.Notification
                                .FirstOrDefaultAsync(x => x.Id == notificationId);

            if (notification is null)
            {
                throw new ArgumentException("Notification Not Exists");
            }

            context.Notification.Remove(notification);
            await context.SaveChangesAsync();

            return "Notification Deleted";
        }

        public async Task<List<NotificationResponseDto>> GetAllNotifications()
        {
            var notifications = await context.Notification
                                   .AsNoTracking()
                                   .OrderByDescending(x => x.CreatedAt)
                                   .Select(notification => new NotificationResponseDto
                                   {
                                       Id = notification.Id,
                                       UserId = notification.UserId,
                                       Title = notification.Title,
                                       Message = notification.Message,
                                       Type = notification.Type,
                                       IsRead = notification.IsRead,
                                       CreatedAt = notification.CreatedAt
                                   }
                                   )
                                   .ToListAsync();

            return notifications;
        }
    }
}
