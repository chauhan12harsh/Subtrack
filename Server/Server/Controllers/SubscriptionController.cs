using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Subscriptions.Data;
using Subscriptions.Dto;
using Subscriptions.Entities;
using Subscriptions.Enum;
using Subscriptions.Interfaces;
using System.Net.NetworkInformation;
using System.Security.Claims;

namespace Subscriptions.Controllers
{
    [ApiController]
    [Route("subscription")]
    [Authorize]
    public class SubscriptionController : ControllerBase
    {        
        private readonly ISubscriptionService subscriptionService;
        public SubscriptionController(ISubscriptionService _subscriptionService)
        {
            subscriptionService = _subscriptionService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> NewSubscription(CreateSubscriptionDto createSubscriptionDto)
        {
            Guid userId = GetCurrentUserId();

            var response = await subscriptionService.CreateSubscription(createSubscriptionDto,userId);

            return Ok(response);
        }
            
        [HttpPatch("update/{subscriptionid:guid}")]
        public async Task<IActionResult> UpdateSubscription(Guid subscriptionid ,UpdateSubscriptionDto updateSubscriptionDto)
        {
            Guid userId = GetCurrentUserId();

            var response = await subscriptionService.UpdateSubscription(subscriptionid, updateSubscriptionDto, userId);

            return Ok(response);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AllSubscriptions()
        {
            var response = await subscriptionService.GetAllSubscriptions();

            return Ok(response);
        }

        [HttpGet("{subscriptionid:guid}")]
        public async Task<IActionResult> SubscriptionById(Guid subscriptionid)
        {
            var userId = GetCurrentUserId();

            var response = await subscriptionService.GetSubscription(subscriptionid, userId);

            return Ok(response);
        }

        [HttpGet("user-subscription")]
        public async Task<IActionResult> UserSubscriptions()
        {
            var userId = GetCurrentUserId();

            var response = await subscriptionService.GetUserSubscriptions(userId);

            return Ok(response);
        }

        [HttpPut("status/{subscriptionid:guid}/{status}")]
        public async Task<IActionResult> UpdateSubscriptionStatus(Guid subscriptionid, BillingStatus status)
        {
            var userId = GetCurrentUserId();

            var response = await subscriptionService.UpdateSubscriptionStatus(subscriptionid, status, userId);

            return Ok(response);
        }

        [HttpDelete("{subscriptionid:guid}")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> DeleteSubscription(Guid subscriptionid)
        {            

            var response = await subscriptionService.DeleteSubscription(subscriptionid);

            return Ok(response);
        }
        
        [HttpPatch("renew/{subscriptionid:guid}")]
        [Authorize(Roles = "Worker")]
        public async Task<IActionResult> RenewSubscription(Guid subscriptionid)
        {

            var response = await subscriptionService.RenewSubscription(subscriptionid);

            return Ok(response);

            //return Ok(new
            //{
            //    message = "Subscription renewed.",
            //    nextBillingDate = subscription.NextBillingDate
            //});
        }
        
        [HttpGet("due")]
        [Authorize(Roles = "Worker,Admin")]
        public async Task<IActionResult> GetUserDueSubscriptions()
        {
            var response = await subscriptionService.GetUserDueSubscriptions();
            return Ok(response);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories() {

            var response = await subscriptionService.GetCategories();
            return Ok(response);
        }

        // Utility
        private Guid GetCurrentUserId()
        {

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdString, out var userId))
            {
                throw new UnauthorizedAccessException("Invalid user identifier.");
            }
            // return userId converted to guid from string
            return userId;
        }

    }
}
    