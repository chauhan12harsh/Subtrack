using SubTrack.Payments.Interfaces;

namespace SubTrack.Dtos.Payment
{
    public class WorkerProcessPaymentDto: IProcessPaymentDto
    {
        public Guid UserId { get; set; }

        public required Guid SubscriptionId { get; set; }

        public required decimal Amount { get; set; }
    }
}
