using Microsoft.EntityFrameworkCore;
using SubTrack.Authentication.Exceptions;
using SubTrack.Data;
using SubTrack.Dtos.Payment;
using SubTrack.Exceptions;
using SubTrack.Notifications.Interfaces;
using SubTrack.Payments.Entities;
using SubTrack.Payments.Enums;
using SubTrack.Payments.Interfaces;
using SubTrack.Subscriptions.Interfaces;

namespace SubTrack.Payments.Services
{
    internal class PaymentService(ApplicationDbContext context, ISubscriptionService subscriptionService, INotificationService notificationService) : IPaymentService
    {
        public async Task<PaymentResponseDto> CreatePayment(IProcessPaymentDto processPaymentDto, Guid userId)
        {

            var user = await context.User.FindAsync(userId);

            if (user is null)
            {
                throw new NotFoundException("User not found");
            }

            if (user.Balance < processPaymentDto.Amount)
            {
                throw new InsufficientBalanceException("Insufficient balance");
            }

            // here i will send the payment process request to extranal payment gateway service [razorpay or stripe]
            //var paymentStatus = PaymentStatus.Completed;
            var paymentStatus = (PaymentStatus)Random.Shared.Next(0, 4);

            var payment = new Payment
            {
                SubscriptionId = processPaymentDto.SubscriptionId,
                UserId = userId,
                Amount = processPaymentDto.Amount,
                Status = paymentStatus,
                TransactionReference = $"TXN{Guid.NewGuid():N}"
            };

            if (paymentStatus == PaymentStatus.Completed)
            {

                // Deducting user balance
                user.Balance = user.Balance - processPaymentDto.Amount;

                // Subscription Renewal
                await subscriptionService.RenewSubscription(processPaymentDto.SubscriptionId);


                //// Create notification
                //string title = "";
                //string message = "";
                //await notificationService.CreateNotification(new createNotificationDto{ userId, title,message, NotificationType.PaymentSuccess});
            }

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
                throw new NotFoundException("Payment not found");
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
                   SubscriptionId = payment.SubscriptionId,
                   PaymentDate = payment.PaymentDate
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
