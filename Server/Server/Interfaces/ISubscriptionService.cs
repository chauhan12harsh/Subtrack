using Subscriptions.Dto;
using Subscriptions.Enum;

namespace Subscriptions.Interfaces
{
    public interface ISubscriptionService
    {
        public Task<SubscriptionResponseDto> CreateSubscription(CreateSubscriptionDto createSubscriptionDto, Guid userId);

        Task<SubscriptionResponseDto> UpdateSubscription(Guid subscriptionid, UpdateSubscriptionDto updateSubscriptionDto, Guid userId);

        Task<string> UpdateSubscriptionStatus(Guid subscriptionid, BillingStatus status, Guid userId);

        Task<SubscriptionResponseDto> GetSubscription(Guid subscriptionid, Guid userId);

        Task<List<SubscriptionResponseDto>> GetUserSubscriptions(Guid userId);

        Task<List<string>> GetCategories();

        //Admin
        Task<List<SubscriptionResponseDto>> GetAllSubscriptions();

        Task<bool> DeleteSubscription(Guid subscriptionid);

        //Worker
        Task<bool> RenewSubscription(Guid subscriptionid);

        Task<List<SubscriptionResponseDto>> GetUserDueSubscriptions();


    }
}
