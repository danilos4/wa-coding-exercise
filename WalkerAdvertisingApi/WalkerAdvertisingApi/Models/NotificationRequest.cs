using System;
using System.ComponentModel.DataAnnotations;

namespace WalkerAdvertisingApi.Models;

public class NotificationRequest
{
        [Required]
        public string Type { get; set; } // "text" or "email"

        [Required]
        public string Content { get; set; }
}
