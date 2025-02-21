using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WalkerAdvertisingApi.Models;
using WalkerAdvertisingApi.Services;

namespace WalkerAdvertisingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeadsController : ControllerBase
    {
        private readonly ILeadStore _leadStore;
        private readonly INotificationService _notificationService;

        public LeadsController(ILeadStore leadStore, INotificationService notificationService)
        {
            _leadStore = leadStore;
            _notificationService = notificationService;
        }

        [HttpPost]
        public IActionResult CreateLead([FromBody] LeadRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var lead = new Lead
            {
                Name = request.Name,
                PhoneNumber = request.PhoneNumber,
                ZipCode = request.ZipCode,
                HasCommunicationPermission = request.HasCommunicationPermission,
                Email = request.Email
            };

            _leadStore.AddLead(lead);
            _notificationService.NotifyLead(lead);

            return CreatedAtAction(nameof(GetLeadById), new { id = lead.Id }, lead);
        }

        [HttpGet]
        public IActionResult GetAllLeads()
        {
            var leads = _leadStore.GetAllLeads();
            return Ok(leads);
        }

        [HttpGet("{id}")]
        public IActionResult GetLeadById(Guid id)
        {
            var lead = _leadStore.GetLeadById(id);
            if (lead == null)
            {
                return NotFound();
            }
            return Ok(lead);
        }

        [HttpPost("{id}/notifications")]
        public IActionResult SendNotification(Guid id, [FromBody] NotificationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var lead = _leadStore.GetLeadById(id);
            if (lead == null)
            {
                return NotFound();
            }

            if (!lead.HasCommunicationPermission)
            {
                return BadRequest("Lead has not granted communication permission.");
            }

            if (request.Type == "email" && string.IsNullOrEmpty(lead.Email))
            {
                return BadRequest("Lead has no email address for email notification.");
            }

            _notificationService.NotifyLead(lead, request.Type, request.Content);
            return Ok();
        }
    }
}
