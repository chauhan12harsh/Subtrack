using Microsoft.EntityFrameworkCore;
using Payments.Data;
using Payments.Dto;
using Payments.Entity;
using Payments.Enum;
using Payments.Interface;

namespace Payments.Services
{
    internal class PaymentService(PaymentDbContext context) : IPaymentService
    {
        public async Task<PaymentResponseDto> CreatePayment(IProcessPaymentDto processPaymentDto, Guid userId)
        {
            var payment = new Payment
            {
                SubscriptionId = processPaymentDto.SubscriptionId,
                UserId = userId,
                Amount = processPaymentDto.Amount,
                Status = (PaymentStatus)Random.Shared.Next(0, 4),
                TransactionReference = $"TXN-{Guid.NewGuid():N}"
            };

            context.Payment.Add(payment);
            await context.SaveChangesAsync();

            PaymentResponseDto paymentResponseDto = new PaymentResponseDto
            {
                PaymentId = payment.Id,
                Status = payment.Status,
                TransactionReference = payment.TransactionReference,
                Amount = payment.Amount,
                SubscriptionId = payment.SubscriptionId
            };

            return paymentResponseDto;
        }

        public async Task<PaymentResponseDto> GetPaymentByPaymentId(Guid paymentid, Guid userId)
        {
            // Ensure the payment belongs to the authenticated user.
            var payment = await context.Payment.AsNoTracking().FirstOrDefaultAsync(x => x.Id == paymentid && x.UserId == userId);

            if (payment is null)
            {
                throw new ArgumentException("Payment not found");
            }

            PaymentResponseDto paymentResponseDto = new PaymentResponseDto
            {
                PaymentId = payment.Id,
                Status = payment.Status,
                TransactionReference = payment.TransactionReference,
                Amount = payment.Amount,
                SubscriptionId = payment.SubscriptionId
            };

            return paymentResponseDto;
        }

        public async Task<List<PaymentResponseDto>> GetPaymentsBySubscriptionId(Guid subscriptionId, Guid userId)
        {
            var payments = await context.Payment
                .AsNoTracking()
                .Where(x => x.SubscriptionId == subscriptionId && x.UserId == userId)
                .OrderByDescending(x => x.PaymentDate)
                .Select(payment => new PaymentResponseDto
                {
                    PaymentId = payment.Id,
                    Status = payment.Status,
                    TransactionReference = payment.TransactionReference,
                    Amount = payment.Amount,
                    SubscriptionId = payment.SubscriptionId
                }
                ).ToListAsync();

            return payments;
        }

        public async Task<List<PaymentResponseDto>> GetUserPaymentTransactions(Guid userId)
        {
            var payments = await context.Payment
               .AsNoTracking()
               .Where(x => x.UserId == userId)
               .OrderByDescending(x => x.PaymentDate)
               .Select(payment => new PaymentResponseDto
               {
                   PaymentId = payment.Id,
                   Status = payment.Status,
                   TransactionReference = payment.TransactionReference,
                   Amount = payment.Amount,
                   SubscriptionId = payment.SubscriptionId
               }
               ).ToListAsync();

            return payments;
        }

        public async Task<List<PaymentResponseDto>> GetAllPaymentTransactions()
        {
            var payments = await context.Payment
               .AsNoTracking()
               .OrderByDescending(x => x.PaymentDate)
               .Select(payment => new PaymentResponseDto
               {
                   PaymentId = payment.Id,
                   Status = payment.Status,
                   TransactionReference = payment.TransactionReference,
                   Amount = payment.Amount,
                   SubscriptionId = payment.SubscriptionId
               }
               ).ToListAsync();

            return payments;
        }
    }
}
