using System;

namespace WalkerAdvertisingApi.Models;

public class Lead
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public string ZipCode { get; set; }
    public bool HasCommunicationPermission { get; set; }
    public string? Email { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
