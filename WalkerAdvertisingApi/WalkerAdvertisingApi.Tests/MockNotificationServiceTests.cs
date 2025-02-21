using System;
using FluentAssertions;
using WalkerAdvertisingApi.Models;
using WalkerAdvertisingApi.Services;

namespace WalkerAdvertisingApi.Tests;

public class MockNotificationServiceTests
{
    private readonly MockNotificationService _service;

    public MockNotificationServiceTests()
    {
        _service = new MockNotificationService();
    }

    [Fact]
    public void NotifyLead_WithPermissionAndEmail_ShouldLogTextAndEmail()
    {
        
        var lead = new Lead
        {
            Name = "John Doe",
            PhoneNumber = "555-123-4567",
            HasCommunicationPermission = true,
            Email = "john.doe@example.com"
        };
        var consoleOutput = new StringWriter();
        Console.SetOut(consoleOutput);

        
        _service.NotifyLead(lead);

        
        var output = consoleOutput.ToString();
        output.Should().Contain("[Mock] Sending notification to John Doe:")
            .And.Contain("- Text to 555-123-4567: 'An agent will call you soon.'")
            .And.Contain("- Email to john.doe@example.com: 'An agent will call you soon.'");
    }

    [Fact]
    public void NotifyLead_WithPermissionNoEmail_ShouldLogTextOnly()
    {
        
        var lead = new Lead
        {
            Name = "Jane Smith",
            PhoneNumber = "555-987-6543",
            HasCommunicationPermission = true
        };
        var consoleOutput = new StringWriter();
        Console.SetOut(consoleOutput);

        
        _service.NotifyLead(lead);

        
        var output = consoleOutput.ToString();
        output.Should().Contain("[Mock] Sending notification to Jane Smith:")
            .And.Contain("- Text to 555-987-6543: 'An agent will call you soon.'")
            .And.NotContain("Email");
    }

    [Fact]
    public void NotifyLead_NoPermission_ShouldLogNoNotification()
    {
        
        var lead = new Lead
        {
            Name = "Bob Johnson",
            PhoneNumber = "555-456-7890",
            HasCommunicationPermission = false
        };
        var consoleOutput = new StringWriter();
        Console.SetOut(consoleOutput);

        
        _service.NotifyLead(lead);

        
        var output = consoleOutput.ToString();
        output.Should().Contain("[Mock] No notification sent to Bob Johnson (communication not permitted).");
    }
}
