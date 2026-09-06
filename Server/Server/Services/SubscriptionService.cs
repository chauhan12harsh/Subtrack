using Microsoft.EntityFrameworkCore;
using Subscriptions.Data;
using Subscriptions.Dto;
using Subscriptions.Entities;
using Subscriptions.Enum;
using Subscriptions.Interfaces;

namespace Subscriptions.Services
{
    public class SubscriptionService(SubscriptionDbContext context) : ISubscriptionService
    {
        public async Task<SubscriptionResponseDto> CreateSubscription(CreateSubscriptionDto createSubscriptionDto, Guid userId)
        {
            var IsSubscriptionExists = await context.Subscription
                .AnyAsync(x =>
                    x.UserId == userId &&
                    x.Name == createSubscriptionDto.Name &&
                    x.Category == createSubscriptionDto.Category);

            if (IsSubscriptionExists)
            {
                throw new ArgumentException("Subscription already exist's.");
            }

            var newSubscription = new Subscription
            {
                UserId = userId,
                Name = createSubscriptionDto.Name,
                Amount = createSubscriptionDto.Amount,
                Category = createSubscriptionDto.Category,
                BillingCycle = createSubscriptionDto.BillingCycle,
                NextBillingDate = createSubscriptionDto.NextBillingDate
            };

            context.Subscription.Add(newSubscription);
            await context.SaveChangesAsync();

            SubscriptionResponseDto subscriptionResponseDto = new SubscriptionResponseDto
            {

                Id = newSubscription.Id,
                UserId = newSubscription.UserId,
                Name = newSubscription.Name,
                Amount = newSubscription.Amount,
                Category = newSubscription.Category,
                BillingCycle = newSubscription.BillingCycle,
                NextBillingDate = newSubscription.NextBillingDate
            };

            return subscriptionResponseDto;
        }

        public async Task<SubscriptionResponseDto> UpdateSubscription(Guid subscriptionid, UpdateSubscriptionDto updateSubscriptionDto, Guid userId)
        {
            var subscription = await context.Subscription.FirstOrDefaultAsync(x => x.Id == subscriptionid && x.UserId == userId);

            if (subscription is null)
            {
                throw new ArgumentException("Subscription not found!");
            }

            subscription.Name = !string.IsNullOrWhiteSpace(updateSubscriptionDto.Name) ? updateSubscriptionDto.Name : subscription.Name;
            subscription.Amount = updateSubscriptionDto.Amount ?? subscription.Amount;
            subscription.Category = updateSubscriptionDto.Category ?? subscription.Category;
            subscription.BillingCycle = updateSubscriptionDto.BillingCycle ?? subscription.BillingCycle;
            subscription.NextBillingDate = updateSubscriptionDto.NextBillingDate ?? subscription.NextBillingDate;

            context.Subscription.Update(subscription);
            await context.SaveChangesAsync();

            SubscriptionResponseDto subscriptionResponseDto = new SubscriptionResponseDto
            {

                Id = subscription.Id,
                UserId = subscription.UserId,
                Name = subscription.Name,
                Amount = subscription.Amount,
                Category = subscription.Category,
                BillingCycle = subscription.BillingCycle,
                NextBillingDate = subscription.NextBillingDate
            };

            return subscriptionResponseDto;
        }

        public async Task<string> UpdateSubscriptionStatus(Guid subscriptionid, BillingStatus status, Guid userId)
        {
            var subscription = await context.Subscription.FirstOrDefaultAsync(x => x.Id == subscriptionid && x.UserId == userId);

            if (subscription is null)
            {
                throw new ArgumentException("Subscription not found!");
            }

            if (subscription.Status == status)
            {
                throw new ArgumentException($"Status is already {status}");
            }

            // validating enum values
            if (!System.Enum.IsDefined(typeof(BillingStatus), status))
            {
                throw new ArgumentException("Invalid status.");
            }

            subscription.Status = status;

            await context.SaveChangesAsync();

            return $"Subscription status updated to {status}.";
        }

        public async Task<List<string>> GetCategories()
        {
            var categories = await context.Subscription
                                .AsNoTracking()
                                .Select(x => x.Category)
                                .Distinct()
                                .OrderByDescending(x => x)
                                .ToListAsync();

            return categories;
        }

        public async Task<SubscriptionResponseDto> GetSubscription(Guid subscriptionid, Guid userId)
        {
            var subscription = await context.Subscription
                                .AsNoTracking()
                                .Select(subscription => new SubscriptionResponseDto
                                {
                                    Id = subscription.Id,
                                    UserId = subscription.UserId,
                                    Name = subscription.Name,
                                    Amount = subscription.Amount,
                                    Category = subscription.Category,
                                    BillingCycle = subscription.BillingCycle,
                                    NextBillingDate = subscription.NextBillingDate
                                }
                                )
                                .FirstOrDefaultAsync(x => x.Id == subscriptionid && x.UserId == userId);

            if (subscription is null)
            {
                throw new ArgumentException("Subscription not found!");
            }

            return subscription;
        }

        public async Task<List<SubscriptionResponseDto>> GetUserSubscriptions(Guid userId)
        {
            var subscriptions = await context.Subscription
                    .AsNoTracking()
                    .Where(x => x.UserId == userId && x.Status != BillingStatus.Cancelled)
                    .OrderBy(x => x.NextBillingDate)
                    .Select(subscription => new SubscriptionResponseDto
                    {
                        Id = subscription.Id,
                        UserId = subscription.UserId,
                        Name = subscription.Name,
                        Amount = subscription.Amount,
                        Category = subscription.Category,
                        BillingCycle = subscription.BillingCycle,
                        NextBillingDate = subscription.NextBillingDate
                    }
                    )
                    .ToListAsync();

            return subscriptions;
        }

        //Admin
        public async Task<List<SubscriptionResponseDto>> GetAllSubscriptions()
        {
            var subscriptions = await context.Subscription
                .AsNoTracking()
                .Select(subscription => new SubscriptionResponseDto
                {
                    Id = subscription.Id,
                    UserId = subscription.UserId,
                    Name = subscription.Name,
                    Amount = subscription.Amount,
                    Category = subscription.Category,
                    BillingCycle = subscription.BillingCycle,
                    NextBillingDate = subscription.NextBillingDate
                }
                )
                .ToListAsync();

            return subscriptions;
        }

        public async Task<bool> DeleteSubscription(Guid subscriptionid)
        {
            var subscription = await context.Subscription.FindAsync(subscriptionid);

            if (subscription is null)
            {
                throw new ArgumentException("Subscription not found!");
            }

            Guid deletedSubscriptionId = subscription.Id;

            context.Subscription.Remove(subscription);
            await context.SaveChangesAsync();

            return true;
        }

        //Worker
        public async Task<List<SubscriptionResponseDto>> GetUserDueSubscriptions()
        {
            var today = DateTime.UtcNow.Date;

            var subscriptions = await context.Subscription
                    .AsNoTracking()
                    .Where(x =>
                        x.Status == BillingStatus.Active &&
                        x.NextBillingDate.Date == today)
                    .OrderBy(x => x.NextBillingDate)
                    .Select(subscription => new SubscriptionResponseDto
                    {
                        Id = subscription.Id,
                        UserId = subscription.UserId,
                        Name = subscription.Name,
                        Amount = subscription.Amount,
                        Category = subscription.Category,
                        BillingCycle = subscription.BillingCycle,
                        NextBillingDate = subscription.NextBillingDate
                    }
                    )
                    .ToListAsync();

            return subscriptions;
        }

        public async Task<bool> RenewSubscription(Guid subscriptionid)
        {
            var subscription = await context.Subscription.FindAsync(subscriptionid);

            if (subscription is null)
            {
                throw new ArgumentException("Subscription not found!");
            }

            if (subscription.Status == BillingStatus.Cancelled)
            {
                throw new ArgumentException("Cancelled subscriptions cannot be renewed.");
            }

            if (subscription.Status != BillingStatus.Active)
            {
                throw new ArgumentException("Only active subscriptions can be renewed.");
            }

            switch (subscription.BillingCycle)
            {
                case BillingCycle.Monthly:
                    subscription.NextBillingDate = subscription.NextBillingDate.AddMonths(1);
                    break;

                case BillingCycle.Yearly:
                    subscription.NextBillingDate = subscription.NextBillingDate.AddYears(1);
                    break;

                default:
                    throw new ArgumentException("Invalid billing cycle.");
            }

            await context.SaveChangesAsync();

            return true;
            //return Ok(new
            //{
            //    message = "Subscription renewed.",
            //    nextBillingDate = subscription.NextBillingDate
            //});
        }

    }
}
