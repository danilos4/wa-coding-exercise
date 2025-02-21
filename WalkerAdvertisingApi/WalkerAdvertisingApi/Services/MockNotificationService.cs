using System;
using WalkerAdvertisingApi.Models;

namespace WalkerAdvertisingApi.Services;

public class MockNotificationService : INotificationService
{
    public void NotifyLead(Lead lead)
    {
        if (lead.HasCommunicationPermission)
        {
            Console.WriteLine($"[Mock] Sending notification to {lead.Name}:");
            Console.WriteLine($"- Text to {lead.PhoneNumber}: 'An agent will call you soon.'");
            if (!string.IsNullOrEmpty(lead.Email))
            {
                Console.WriteLine($"- Email to {lead.Email}: 'An agent will call you soon.'");
            }
        }
        else
        {
            Console.WriteLine($"[Mock] No notification sent to {lead.Name} (communication not permitted).");
        }
    }

    public void NotifyLead(Lead lead, string type, string content)
    {
        if (lead.HasCommunicationPermission)
        {
            if (type == "text")
            {
                Console.WriteLine($"[Mock] Sending text to {lead.Name} at {lead.PhoneNumber}: '{content}'");
            }
            else if (type == "email" && !string.IsNullOrEmpty(lead.Email))
            {
                Console.WriteLine($"[Mock] Sending email to {lead.Name} at {lead.Email}: '{content}'");
            }
        }
        else
        {
            Console.WriteLine($"[Mock] No {type} sent to {lead.Name} (communication not permitted).");
        }
    }
}
