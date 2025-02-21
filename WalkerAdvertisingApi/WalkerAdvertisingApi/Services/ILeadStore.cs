using System;
using WalkerAdvertisingApi.Models;

namespace WalkerAdvertisingApi.Services;

public interface ILeadStore
{
    void AddLead(Lead lead);
    List<Lead> GetAllLeads();
    Lead? GetLeadById(Guid id);
}
