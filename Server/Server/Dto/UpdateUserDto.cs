namespace Authentication.Dto
{
    public class UpdateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;       
        public decimal Balance { get; set; } = 0m;
    }
}
