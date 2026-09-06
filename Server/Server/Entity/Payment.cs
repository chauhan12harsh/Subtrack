using Payments.Enum;

namespace Payments.Entity
{
    public class Payment
    {
        public Guid Id { get; set; }

        public required Guid UserId { get; set; }

        public required Guid SubscriptionId { get; set; }

        public required decimal Amount { get; set; }

        public required PaymentStatus Status { get; set; }

        public DateTime PaymentDate { get; set; } = DateTime.Now;

        public required string TransactionReference { get; set; } = string.Empty;

    }
}
