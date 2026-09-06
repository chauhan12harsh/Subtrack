using Payments.Enum;

namespace Payments.Dto
{
    public class PaymentResponseDto
    {
        public Guid PaymentId { get; set; }

        public PaymentStatus Status { get; set; }

        public string TransactionReference { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public Guid SubscriptionId { get; set; }

    }
}
