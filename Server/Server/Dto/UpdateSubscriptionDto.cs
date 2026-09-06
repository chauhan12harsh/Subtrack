using Subscriptions.Enum;

namespace Subscriptions.Dto
{
    public class UpdateSubscriptionDto
    {
        public string? Name { get; set; }

        public decimal? Amount { get; set; }

        public string? Category { get; set; }

        public BillingCycle? BillingCycle { get; set; }

        public DateTime? NextBillingDate { get; set; }
    }
}
