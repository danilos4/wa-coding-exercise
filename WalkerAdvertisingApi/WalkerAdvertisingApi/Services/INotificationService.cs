using System;
using WalkerAdvertisingApi.Models;

namespace WalkerAdvertisingApi.Services;

public interface INotificationService
{
    void NotifyLead(Lead lead);
    void NotifyLead(Lead lead, string type, string content);
}
