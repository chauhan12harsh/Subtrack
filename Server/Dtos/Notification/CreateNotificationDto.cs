using SubTrack.Notifications.Enums;

namespace SubTrack.Dtos.Notification;

public class CreateNotificationDto
{
    public Guid UserId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public NotificationType Type { get; set; }
}