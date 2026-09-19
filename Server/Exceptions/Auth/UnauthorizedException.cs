namespace SubTrack.Exceptions.Auth
{
    public class UnauthorizedException:Exception
    {
        public UnauthorizedException(string message) : base(message) { }
    }
}
