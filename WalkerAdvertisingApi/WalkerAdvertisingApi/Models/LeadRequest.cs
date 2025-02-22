using System.ComponentModel.DataAnnotations;

namespace WalkerAdvertisingApi.Models;

public class LeadRequest
{
    [Required]
    public string Name { get; set; }

    [Required]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be a 10-digit numeric value.")]
    public string PhoneNumber { get; set; }

    [Required]
    [RegularExpression(@"^\d{5}$", ErrorMessage = "Zip code must be a 5-digit numeric value.")]
    public string ZipCode { get; set; }

    public bool HasCommunicationPermission { get; set; }

    [OptionalEmailAddress]
    public string? Email { get; set; }
}
