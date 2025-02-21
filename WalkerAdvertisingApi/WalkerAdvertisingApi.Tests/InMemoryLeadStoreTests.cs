using System;
using FluentAssertions;
using WalkerAdvertisingApi.Models;
using WalkerAdvertisingApi.Services;

namespace WalkerAdvertisingApi.Tests;

public class InMemoryLeadStoreTests
{
    private readonly InMemoryLeadStore _store;

    public InMemoryLeadStoreTests()
    {
        _store = new InMemoryLeadStore();
    }

    [Fact]
    public void AddLead_ShouldIncreaseLeadCount()
    {
        
        var lead = new Lead { Name = "Test", PhoneNumber = "555-123-4567", ZipCode = "12345" };

        
        _store.AddLead(lead);

        
        _store.GetAllLeads().Should().HaveCount(21)
            .And.ContainSingle(l => l.Name == "John Doe");
    }

    [Fact]
    public void GetAllLeads_WhenEmpty_ShouldReturnEmptyList()
    {
        
        var leads = _store.GetAllLeads();

        
        leads.Should().HaveCount(20);
    }

    [Fact]
    public void GetLeadById_ExistingId_ShouldReturnLead()
    {
        
        var lead = new Lead { Name = "Jane Smith", PhoneNumber = "555-987-6543", ZipCode = "67890" };
        _store.AddLead(lead);

        
        var result = _store.GetLeadById(lead.Id);

        
        result.Should().NotBeNull()
            .And.BeEquivalentTo(lead);
    }

    [Fact]
    public void GetLeadById_NonExistingId_ShouldReturnNull()
    {
        
        var result = _store.GetLeadById(Guid.NewGuid());

        
        result.Should().BeNull();
    }
}
