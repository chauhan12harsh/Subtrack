using SubTrack.Payments.Enums;

namespace SubTrack.Dtos.Payment
{
    public class PaymentResponseDto
    {
        public Guid PaymentId { get; set; }

        public PaymentStatus Status { get; set; }

        public string TransactionReference { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public Guid SubscriptionId { get; set; }

        public DateTime PaymentDate { get; set; }

    }
}
