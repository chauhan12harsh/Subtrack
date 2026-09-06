using Notifications.Dto;

namespace Notifications.Interfaces
{
    public interface INotificationService
    {
        Task<NotificationResponseDto> CreateNotification(CreateNotificationDto createNotificationDto);

        Task<List<NotificationResponseDto>> GetUserNotifications(Guid userId);

        Task<string> ReadAllNotifications(Guid userId);

        Task<string> ReadNotification(Guid notificationId, Guid userId);

        Task<int> GetCountOfUnreadNotifications(Guid userId);

        Task<string> DeleteNotifications(Guid notificationId);

        Task<List<NotificationResponseDto>> GetAllNotifications();
    }
}
