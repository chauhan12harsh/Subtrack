using SubTrack.Notifications.Enums;

namespace SubTrack.Notifications.Entities
{
    public class Notification
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public NotificationType Type { get; set; } = NotificationType.General;

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
