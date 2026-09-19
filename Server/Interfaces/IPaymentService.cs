using SubTrack.Dtos.Payment;

namespace SubTrack.Payments.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> CreatePayment(IProcessPaymentDto processPaymentDto, Guid userId);
        Task<PaymentResponseDto> GetPaymentByPaymentId(Guid paymentid, Guid userId);
        Task<List<PaymentResponseDto>> GetPaymentsBySubscriptionId(Guid subscriptionId, Guid userId);
        Task<List<PaymentResponseDto>> GetUserPaymentTransactions(Guid userId);
        Task<List<PaymentResponseDto>> GetAllPaymentTransactions();
    }
}
