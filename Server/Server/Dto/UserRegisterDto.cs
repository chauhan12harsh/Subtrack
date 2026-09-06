namespace Authentication.Dto
{
    public class UserRegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public required string Email { get; set; } = string.Empty;
        public required string Password { get; set; } = string.Empty;
        public decimal Balance { get; set; } = 0m;
    }   
}
