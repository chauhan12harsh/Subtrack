namespace RenewalWorker.Dto
{
    public class CreatePaymentDto
    {
        public Guid UserId { get; set; }

        public Guid SubscriptionId { get; set; }

        public decimal Amount { get; set; }
    }
}
