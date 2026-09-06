namespace RenewalWorker.Dto
{
    public class DueSubscriptionDto
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public string BillingCycle { get; set; } = string.Empty;

        public DateTime NextBillingDate { get; set; }
    }
}
