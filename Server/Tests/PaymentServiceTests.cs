using Microsoft.EntityFrameworkCore;
using Moq;
using SubTrack.Authentication.Entities;
using SubTrack.Data;
using SubTrack.Dtos.Payment;
using SubTrack.Dtos.Notification;
using SubTrack.Exceptions;
using SubTrack.Notifications.Interfaces;
using SubTrack.Payments.Services;
using SubTrack.Subscriptions.Interfaces;

namespace Server.Tests;

public class PaymentServiceTests
{
    [Fact]
    public async Task CreatePayment_WhenBalanceIsInsufficient_ShouldThrowException()
    {
        // Arrange {created a temp db for testing}
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ApplicationDbContext(options);

        // created fake services
        var subscriptionService = new Mock<ISubscriptionService>();
        var notificationService = new Mock<INotificationService>();

        // creating a user with balance 50 and trying to do the payment of 100
        var userId = Guid.NewGuid();

        var user = new User
        {
            Id = userId,
            Username = "Test User",
            Email = "test@test.com",
            PasswordHash = "hashed-password",
            Balance = 50
        };

        context.User.Add(user);
        await context.SaveChangesAsync();

        var paymentDto = new ProcessPaymentDto
        {
            SubscriptionId = Guid.NewGuid(),
            Amount = 100
        };

        var paymentService = new PaymentService(
            context,
            subscriptionService.Object,
            notificationService.Object
        );

        // Act & Assert
        await Assert.ThrowsAsync<InsufficientBalanceException>(
            () => paymentService.CreatePayment(paymentDto, userId));

        // Verify that no notification was created
        notificationService.Verify(
            x => x.CreateNotification(It.IsAny<CreateNotificationDto>()),
            Times.Never);
    }
}