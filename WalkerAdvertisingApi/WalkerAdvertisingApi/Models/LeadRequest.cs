using System.ComponentModel.DataAnnotations;

namespace WalkerAdvertisingApi.Models;

public class LeadRequest
{
        [Required]
        public string Name { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        [Required]
        public string ZipCode { get; set; }

        [Required]
        public bool HasCommunicationPermission { get; set; }

        public string? Email { get; set; }
}
