using SubTrack.Notifications.Enums;

namespace SubTrack.Dtos.Notification
{
    public class NotificationResponseDto
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public NotificationType Type { get; set; }

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
