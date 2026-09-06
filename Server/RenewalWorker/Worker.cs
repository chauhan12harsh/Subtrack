using Microsoft.Extensions.Options;
using Payments.Enum;
using RenewalWorker.Configuration;
using RenewalWorker.Dto;
using System.Net.Http.Headers;

namespace RenewalWorker
{
    public class Worker : BackgroundService
    {
        private readonly WorkerCredientials workerCredientials;
        private readonly ApiEndpoints apiEndpoints;
        private readonly ILogger<Worker> logger;
        private readonly IHttpClientFactory httpClientFactory;

        private string? JwtToken;

        public Worker(
            ILogger<Worker> logger,
            IHttpClientFactory httpClientFactory,
            IOptions<WorkerCredientials> workerCredientialsOptions,
            IOptions<ApiEndpoints> apiEndpointsOptions
            )
        {
            this.logger = logger;
            this.httpClientFactory = httpClientFactory;
            this.apiEndpoints = apiEndpointsOptions.Value;
            this.workerCredientials = workerCredientialsOptions.Value;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {

            while (!stoppingToken.IsCancellationRequested)
            {
                if (string.IsNullOrEmpty(JwtToken))
                {
                    await GetJwtToken();
                }

                await GetDueSubscriptions();

                await Task.Delay(
                    TimeSpan.FromSeconds(30),
                    stoppingToken
                );

            }
        }

        private async Task GetDueSubscriptions()
        {

            try
            {
                var client = CreateAutorizedClient();

                var response = await client.GetAsync($"{apiEndpoints.SubscriptionApi}/subscription/due");
                response.EnsureSuccessStatusCode();

                var subscriptions = await response.Content.ReadFromJsonAsync<List<DueSubscriptionDto>>();

                logger.LogInformation("Found {Count} due subscriptions", subscriptions?.Count ?? 0);

                foreach (var subscription in subscriptions ?? [])
                {
                    logger.LogInformation("Processing subscription {name} ({subscriptionId}) for user {userId}", subscription.Name, subscription.Id, subscription.UserId);

                    await ProcessSubscription(subscription);

                    logger.LogInformation("Finished processing subscription {id}", subscription.Id);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Internal Server Error Occured at worker");
            }
        }

        // Extracted Method
        private async Task ProcessSubscription(DueSubscriptionDto subscription)
        {
            try
            {
                var paymentSuccess = await ProcessPayment(subscription);

                await CreateNotification(subscription, paymentSuccess);

                if (paymentSuccess)
                {
                    await RenewSubscription(subscription);
                    logger.LogInformation("Subscription {subscription} for user {userId} renewed successfully", subscription.Name, subscription.UserId);
                }

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed processing subscription {id}", subscription.Id);
            }
        }

        private async Task<bool> ProcessPayment(DueSubscriptionDto subscription)
        {

            try
            {
                var client = CreateAutorizedClient();

                var paymentRequest = new CreatePaymentDto
                {
                    UserId = subscription.UserId,
                    SubscriptionId = subscription.Id,
                    Amount = subscription.Amount
                };

                var response = await client.PostAsJsonAsync($"{apiEndpoints.PaymentApi}/payment/processinternal", paymentRequest);

                response.EnsureSuccessStatusCode();

                var paymentResponse = await response.Content.ReadFromJsonAsync<PaymentResponseDto>();

                if (paymentResponse is null)
                {
                    logger.LogError("Payment response was null for {subscription}",subscription.Name);

                    return false;
                }

                logger.LogInformation("Payment {paymentId} for subscription {subscription} returned status {status}",paymentResponse.PaymentId,subscription.Name,paymentResponse.Status);

                return paymentResponse.Status == PaymentStatus.Completed;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error processing payment for {subscription}", subscription.Name);
                return false;
            }
        }

        private async Task CreateNotification(DueSubscriptionDto subscription, bool paymentSucceeded)
        {

            try
            {
                var client = CreateAutorizedClient();

                var notification = new CreateNotificationDto
                {

                    UserId = subscription.UserId,
                    Title = paymentSucceeded ? "Payment Successful" : "Payment Failed",
                    Message = paymentSucceeded ? $"{subscription.Name} renewed successfully." : $"{subscription.Name} payment failed.",
                    Type = paymentSucceeded ? 1 : 2
                };

                var response = await client.PostAsJsonAsync($"{apiEndpoints.NotificationApi}/notification/create", notification);

                if (response.IsSuccessStatusCode)
                {
                    logger.LogInformation(
                    "Notification created for {subscription}",
                    subscription.Name);
                }
                else
                {
                    logger.LogError(
                    "Notification creation failed for {subscription}",
                    subscription.Name);
                }


            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Notification error for {subscription}", subscription.Name);
            }

        }

        private async Task RenewSubscription(DueSubscriptionDto subscription)
        {
            try
            {
                var client = CreateAutorizedClient();

                var response = await client.PatchAsync($"{apiEndpoints.SubscriptionApi}/subscription/renew/{subscription.Id}", null);

                if (response.IsSuccessStatusCode)
                {
                    logger.LogInformation(
                        "Subscription renewed: {name}",
                        subscription.Name);
                }
                else
                {
                    logger.LogError(
                        "Failed to renew subscription: {name}",
                        subscription.Name);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex,
                    "Renewal error for {name}",
                    subscription.Name);
            }
        }
      

        //Extracted Method
        private HttpClient CreateAutorizedClient()
        {
            var client = httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", JwtToken);
            return client;
        }

        private async Task GetJwtToken()
        {

            try
            {
                var client = httpClientFactory.CreateClient();

                var loginRequest = new LoginDto
                {
                    Email = workerCredientials.Email,
                    Password = workerCredientials.Password
                };

                var response = await client.PostAsJsonAsync($"{apiEndpoints.AuthApi}/auth/login", loginRequest);

                response.EnsureSuccessStatusCode();

                var authResponseDto = await response.Content.ReadFromJsonAsync<AuthResponseDto>();

                JwtToken = authResponseDto?.Token;

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to generate Jwt Token");
            }
        }


    }
}
