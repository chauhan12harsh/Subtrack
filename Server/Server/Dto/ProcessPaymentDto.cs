using Payments.Interface;

namespace Payments.Dto
{
    public class ProcessPaymentDto: IProcessPaymentDto
    {

        public required Guid SubscriptionId { get; set; }

        public required decimal Amount { get; set; }

    }
}
