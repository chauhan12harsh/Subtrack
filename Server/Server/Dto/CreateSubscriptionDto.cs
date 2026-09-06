using Subscriptions.Enum;

namespace Subscriptions.Dto
{
    public class CreateSubscriptionDto
    {
        public required string Name { get; set; }

        public required decimal Amount { get; set; }

        public string Category { get; set; } = "Other";

        public required BillingCycle BillingCycle { get; set; }

        public required DateTime NextBillingDate { get; set; }
    }
}
