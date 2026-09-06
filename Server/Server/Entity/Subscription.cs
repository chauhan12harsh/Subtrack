using Subscriptions.Enum;

namespace Subscriptions.Entities
{
    public class Subscription
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }  

        public string Name { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public string Category { get; set; } = "Other";

        public BillingStatus Status { get; set; } = BillingStatus.Active;

        public BillingCycle BillingCycle { get; set; }

        public DateTime NextBillingDate { get; set; } = DateTime.MinValue;

    }
}

