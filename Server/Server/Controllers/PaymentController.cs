using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Payments.Dto;
using Payments.Interface;
using System.Security.Claims;

namespace Payments.Controller
{
    [ApiController]
    [Route("payment")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService paymentService;

        public PaymentController(IPaymentService _paymentService)
        {
            paymentService = _paymentService;
        }

        [HttpPost("process")]
        public async Task<IActionResult> ProcessPayment(ProcessPaymentDto processPaymentDto)
        {
            Guid userId = GetCurrentUserId();

            var response = await paymentService.CreatePayment(processPaymentDto, userId);

            return Ok(response);
        }

        [HttpPost("processinternal")]
        [Authorize(Roles = "Worker")]
        public async Task<IActionResult> ProcessPaymentInternal(WorkerProcessPaymentDto workerProcessPaymentDto)
        {
            var response = await paymentService.CreatePayment(workerProcessPaymentDto, workerProcessPaymentDto.UserId);
            return Ok(response);
        }

        [HttpGet("{paymentid:guid}")]
        public async Task<IActionResult> PaymentByPaymentId(Guid paymentid)
        {
            Guid userId = GetCurrentUserId();

            var response = await paymentService.GetPaymentByPaymentId(paymentid, userId);

            return Ok(response);
        }

        [HttpGet("subscription/{subscriptionId:guid}")]
        public async Task<IActionResult> PaymentsBySubscriptionId(Guid subscriptionId)
        {
            Guid userId = GetCurrentUserId();

            var response = await paymentService.GetPaymentsBySubscriptionId(subscriptionId, userId);

            return Ok(response);
        }

        [HttpGet("transactions")]
        public async Task<IActionResult> UserPaymentTransactions()
        {
            Guid userId = GetCurrentUserId();

            var response = await paymentService.GetUserPaymentTransactions(userId);

            return Ok(response);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AllPaymentTransactions()
        {
            var response = await paymentService.GetAllPaymentTransactions();

            return Ok(response);
        }

        // Utility
        private Guid GetCurrentUserId(){

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
