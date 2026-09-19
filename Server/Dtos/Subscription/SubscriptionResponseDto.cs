using SubTrack.Subscriptions.Enums;

namespace SubTrack.Dtos.Subscription
{
    public class SubscriptionResponseDto
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public string Category { get; set; } = string.Empty;

        public BillingStatus Status { get; set; }

        public BillingCycle BillingCycle { get; set; }

        public DateTime NextBillingDate { get; set; }
    }
}
