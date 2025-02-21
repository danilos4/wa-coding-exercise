using System;
using WalkerAdvertisingApi.Services;
using Moq;
using WalkerAdvertisingApi.Controllers;
using WalkerAdvertisingApi.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;

namespace WalkerAdvertisingApi.Tests;

public class LeadsControllerTests
{
    private readonly Mock<ILeadStore> _leadStoreMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly LeadsController _controller;

    public LeadsControllerTests()
    {
        _leadStoreMock = new Mock<ILeadStore>();
        _notificationServiceMock = new Mock<INotificationService>();
        _controller = new LeadsController(_leadStoreMock.Object, _notificationServiceMock.Object);
    }

    [Fact]
    public void CreateLead_ValidRequest_ShouldReturnCreated()
    {
        
        var request = new LeadRequest
        {
            Name = "John Doe",
            PhoneNumber = "555-123-4567",
            ZipCode = "12345",
            HasCommunicationPermission = true,
            Email = "john.doe@example.com"
        };

        
        var result = _controller.CreateLead(request);

        
        var createdResult = result.Should().BeOfType<CreatedAtActionResult>().Subject;
        createdResult.StatusCode.Should().Be(201);
        var lead = createdResult.Value.Should().BeOfType<Lead>().Subject;
        lead.Name.Should().Be("John Doe");
        _leadStoreMock.Verify(s => s.AddLead(It.Is<Lead>(l => l.Name == "John Doe")), Times.Once());
        _notificationServiceMock.Verify(n => n.NotifyLead(It.Is<Lead>(l => l.Name == "John Doe")), Times.Once());
    }

    [Fact]
    public void CreateLead_InvalidRequest_ShouldReturnBadRequest()
    {
        
        var request = new LeadRequest(); // Missing required fields
        _controller.ModelState.AddModelError("Name", "The Name field is required.");

        
        var result = _controller.CreateLead(request);

        
        result.Should().BeOfType<BadRequestObjectResult>()
            .Which.StatusCode.Should().Be(400);
        _leadStoreMock.Verify(s => s.AddLead(It.IsAny<Lead>()), Times.Never());
        _notificationServiceMock.Verify(n => n.NotifyLead(It.IsAny<Lead>()), Times.Never());
    }

    [Fact]
    public void GetAllLeads_ShouldReturnAllLeads()
    {
        
        var leads = new List<Lead>
        {
            new Lead { Name = "John Doe" },
            new Lead { Name = "Jane Smith" }
        };
        _leadStoreMock.Setup(s => s.GetAllLeads()).Returns(leads);

        
        var result = _controller.GetAllLeads();

        
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.StatusCode.Should().Be(200);
        okResult.Value.Should().BeEquivalentTo(leads);
    }

    [Fact]
    public void GetLeadById_ExistingId_ShouldReturnLead()
    {
        
        var lead = new Lead { Id = Guid.NewGuid(), Name = "John Doe" };
        _leadStoreMock.Setup(s => s.GetLeadById(lead.Id)).Returns(lead);

        
        var result = _controller.GetLeadById(lead.Id);

        
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.StatusCode.Should().Be(200);
        okResult.Value.Should().BeEquivalentTo(lead);
    }

    [Fact]
    public void GetLeadById_NonExistingId_ShouldReturnNotFound()
    {
        
        var id = Guid.NewGuid();
        _leadStoreMock.Setup(s => s.GetLeadById(id)).Returns((Lead?)null);

        
        var result = _controller.GetLeadById(id);

        
        result.Should().BeOfType<NotFoundResult>()
            .Which.StatusCode.Should().Be(404);
    }

    [Fact]
        public void SendNotification_ValidRequest_ReturnsOk()
        {
            
            var leadId = Guid.NewGuid();
            var lead = new Lead { Id = leadId, Name = "Eve", PhoneNumber = "444", ZipCode = "44444", HasCommunicationPermission = true, Email = "eve@example.com" };
            var request = new NotificationRequest { Type = "email", Content = "Hello" };
            _leadStoreMock.Setup(s => s.GetLeadById(leadId)).Returns(lead);
            _controller.ModelState.Clear();

            
            var result = _controller.SendNotification(leadId, request) as OkResult;

            
            result.Should().NotBeNull();
            result.StatusCode.Should().Be(200);
            _notificationServiceMock.Verify(n => n.NotifyLead(lead, request.Type, request.Content), Times.Once());
        }

        [Fact]
        public void SendNotification_InvalidModelState_ReturnsBadRequest()
        {
            
            var leadId = Guid.NewGuid();
            var request = new NotificationRequest();
            _controller.ModelState.AddModelError("Type", "Required");

            
            var result = _controller.SendNotification(leadId, request) as BadRequestObjectResult;

            
            result.Should().NotBeNull();
            result.StatusCode.Should().Be(400);
            _notificationServiceMock.Verify(n => n.NotifyLead(It.IsAny<Lead>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never());
        }

        [Fact]
        public void SendNotification_NonExistingLead_ReturnsNotFound()
        {
            
            var leadId = Guid.NewGuid();
            var request = new NotificationRequest { Type = "text", Content = "Hi" };
            _leadStoreMock.Setup(s => s.GetLeadById(leadId)).Returns((Lead?)null);
            _controller.ModelState.Clear();

            
            var result = _controller.SendNotification(leadId, request) as NotFoundResult;

            
            result.Should().NotBeNull();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public void SendNotification_NoPermission_ReturnsBadRequest()
        {
            
            var leadId = Guid.NewGuid();
            var lead = new Lead { Id = leadId, Name = "NoPerm", PhoneNumber = "555", ZipCode = "55555", HasCommunicationPermission = false };
            var request = new NotificationRequest { Type = "text", Content = "Hi" };
            _leadStoreMock.Setup(s => s.GetLeadById(leadId)).Returns(lead);
            _controller.ModelState.Clear();

            
            var result = _controller.SendNotification(leadId, request) as BadRequestObjectResult;

            
            result.Should().NotBeNull();
            result.StatusCode.Should().Be(400);
            result.Value.Should().Be("Lead has not granted communication permission.");
            _notificationServiceMock.Verify(n => n.NotifyLead(It.IsAny<Lead>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never());
        }

        [Fact]
        public void SendNotification_EmailWithoutEmailAddress_ReturnsBadRequest()
        {
            
            var leadId = Guid.NewGuid();
            var lead = new Lead { Id = leadId, Name = "NoEmail", PhoneNumber = "666", ZipCode = "66666", HasCommunicationPermission = true };
            var request = new NotificationRequest { Type = "email", Content = "Hi" };
            _leadStoreMock.Setup(s => s.GetLeadById(leadId)).Returns(lead);
            _controller.ModelState.Clear();

            
            var result = _controller.SendNotification(leadId, request) as BadRequestObjectResult;

            
            result.Should().NotBeNull();
            result.StatusCode.Should().Be(400);
            result.Value.Should().Be("Lead has no email address for email notification.");
            _notificationServiceMock.Verify(n => n.NotifyLead(It.IsAny<Lead>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never());
        }
}
