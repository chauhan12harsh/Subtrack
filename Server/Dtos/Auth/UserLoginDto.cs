using Server.Attributes;
using System.ComponentModel.DataAnnotations;

namespace SubTrack.Dtos.Auth
{
    public class UserLoginDto
    {
        [Required]
        [EmailOrUsernameAttribute]
        public required string EmailOrUsername { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public required string Password { get; set; }

    }
}
