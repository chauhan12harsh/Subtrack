namespace Payments.Interface
{
    public interface IProcessPaymentDto
    {
        public  Guid SubscriptionId { get; set; }

        public decimal Amount { get; set; }
    }
}
