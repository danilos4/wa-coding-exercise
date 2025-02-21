using System;
using WalkerAdvertisingApi.Models;

namespace WalkerAdvertisingApi.Services;

public class InMemoryLeadStore : ILeadStore
{
    private readonly List<Lead> _leads = new List<Lead>();

    public InMemoryLeadStore()
    {
        _leads = new List<Lead> {
                new Lead { Name = "John Doe", PhoneNumber = "555-123-4567", ZipCode = "12345", HasCommunicationPermission = true, Email = "john.doe@example.com", CreatedAt = DateTime.UtcNow.AddDays(-5) },
                new Lead { Name = "Jane Smith", PhoneNumber = "555-987-6543", ZipCode = "67890", HasCommunicationPermission = false, CreatedAt = DateTime.UtcNow.AddDays(-4) },
                new Lead { Name = "Bob Johnson", PhoneNumber = "555-456-7890", ZipCode = "54321", HasCommunicationPermission = true, Email = "bob.johnson@example.com", CreatedAt = DateTime.UtcNow.AddDays(-3) },
                new Lead { Name = "Alice Brown", PhoneNumber = "555-321-6547", ZipCode = "98765", HasCommunicationPermission = true, CreatedAt = DateTime.UtcNow.AddDays(-2) },
                new Lead { Name = "Mike Wilson", PhoneNumber = "555-654-3210", ZipCode = "43210", HasCommunicationPermission = false, Email = "mike.wilson@example.com", CreatedAt = DateTime.UtcNow.AddDays(-1) },
                new Lead { Name = "Sara Davis", PhoneNumber = "555-789-1234", ZipCode = "56789", HasCommunicationPermission = true, CreatedAt = DateTime.UtcNow.AddHours(-20) },
                new Lead { Name = "Tom Clark", PhoneNumber = "555-234-5678", ZipCode = "34567", HasCommunicationPermission = true, Email = "tom.clark@example.com", CreatedAt = DateTime.UtcNow.AddHours(-18) },
                new Lead { Name = "Emily White", PhoneNumber = "555-876-5432", ZipCode = "89012", HasCommunicationPermission = false, CreatedAt = DateTime.UtcNow.AddHours(-16) },
                new Lead { Name = "David Lee", PhoneNumber = "555-345-6789", ZipCode = "21098", HasCommunicationPermission = true, Email = "david.lee@example.com", CreatedAt = DateTime.UtcNow.AddHours(-14) },
                new Lead { Name = "Lisa Green", PhoneNumber = "555-567-8901", ZipCode = "65432", HasCommunicationPermission = true, CreatedAt = DateTime.UtcNow.AddHours(-12) },
                new Lead { Name = "Chris Adams", PhoneNumber = "555-678-9012", ZipCode = "32109", HasCommunicationPermission = true, Email = "chris.adams@example.com", CreatedAt = DateTime.UtcNow.AddHours(-10) },
                new Lead { Name = "Nancy Taylor", PhoneNumber = "555-890-1234", ZipCode = "10987", HasCommunicationPermission = false, CreatedAt = DateTime.UtcNow.AddHours(-8) },
                new Lead { Name = "Paul Miller", PhoneNumber = "555-901-2345", ZipCode = "87654", HasCommunicationPermission = true, Email = "paul.miller@example.com", CreatedAt = DateTime.UtcNow.AddHours(-6) },
                new Lead { Name = "Kelly Brown", PhoneNumber = "555-012-3456", ZipCode = "54321", HasCommunicationPermission = true, CreatedAt = DateTime.UtcNow.AddHours(-4) },
                new Lead { Name = "James Wilson", PhoneNumber = "555-123-5678", ZipCode = "23456", HasCommunicationPermission = false, Email = "james.wilson@example.com", CreatedAt = DateTime.UtcNow.AddHours(-2) },
                new Lead { Name = "Laura Davis", PhoneNumber = "555-234-6789", ZipCode = "78901", HasCommunicationPermission = true, CreatedAt = DateTime.UtcNow.AddHours(-1) },
                new Lead { Name = "Mark Thompson", PhoneNumber = "555-345-7890", ZipCode = "45678", HasCommunicationPermission = true, Email = "mark.thompson@example.com", CreatedAt = DateTime.UtcNow.AddMinutes(-45) },
                new Lead { Name = "Susan Lee", PhoneNumber = "555-456-8901", ZipCode = "90123", HasCommunicationPermission = false, CreatedAt = DateTime.UtcNow.AddMinutes(-30) },
                new Lead { Name = "Peter Harris", PhoneNumber = "555-567-9012", ZipCode = "67890", HasCommunicationPermission = true, Email = "peter.harris@example.com", CreatedAt = DateTime.UtcNow.AddMinutes(-15) },
                new Lead { Name = "Rachel King", PhoneNumber = "555-678-0123", ZipCode = "34567", HasCommunicationPermission = true, CreatedAt = DateTime.UtcNow }
            };
    }

    public void AddLead(Lead lead)
    {
        _leads.Add(lead);
    }

    public List<Lead> GetAllLeads()
    {
        return _leads;
    }

    public Lead? GetLeadById(Guid id)
    {
        return _leads.FirstOrDefault(l => l.Id == id);
    }
}
