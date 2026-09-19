using SubTrack.Payments.Interfaces;

namespace SubTrack.Dtos.Payment
{
    public class ProcessPaymentDto: IProcessPaymentDto
    {

        public required Guid SubscriptionId { get; set; }

        public required decimal Amount { get; set; }

    }
}
