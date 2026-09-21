using System.ComponentModel.DataAnnotations;

namespace SubTrack.Dtos.Auth
{
    public class UserRegisterDto
    {
        [Required]
        [StringLength(50,MinimumLength = 5)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public required string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public required string Password { get; set; } = string.Empty;        
    }   
}
    