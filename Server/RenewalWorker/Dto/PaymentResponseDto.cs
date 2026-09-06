
using Payments.Enum;
using System.Text.Json.Serialization;

namespace RenewalWorker.Dto
{
    public class PaymentResponseDto
    {
        public Guid PaymentId { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public PaymentStatus Status { get; set; }

        public string TransactionReference { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public Guid SubscriptionId { get; set; }

    }
}
