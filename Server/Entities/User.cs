using SubTrack.Authentication.Enums;

namespace SubTrack.Authentication.Entities
{
    public class User
    {
        public Guid Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public decimal Balance { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public UserRole Role { get; set; } = UserRole.User;

    }
}
