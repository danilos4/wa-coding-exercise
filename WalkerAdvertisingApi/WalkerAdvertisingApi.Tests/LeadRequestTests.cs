using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using WalkerAdvertisingApi.Models;
using Xunit;
using FluentAssertions;

namespace WalkerAdvertisingApi.Tests
{
    public class LeadRequestTests
    {
        [Theory]
        [InlineData("1234567890", true)]
        [InlineData("123456789", false)]
        [InlineData("12345678901", false)]
        [InlineData("abcdefghij", false)]
        public void PhoneNumber_Should_Validate_Correctly(string phoneNumber, bool isValid)
        {
            var leadRequest = new LeadRequest
            {
                Name = "Test Name",
                PhoneNumber = phoneNumber,
                ZipCode = "12345",
                Email = null
            };

            var validationResults = ValidateModel(leadRequest);

            if (isValid)
            {
                validationResults.Should().BeEmpty();
            }
            else
            {
                validationResults.Should().ContainSingle(v => v.MemberNames.Contains(nameof(LeadRequest.PhoneNumber)));
            }
        }

        [Theory]
        [InlineData("12345", true)]
        [InlineData("1234", false)]
        [InlineData("123456", false)]
        [InlineData("abcde", false)]
        public void ZipCode_Should_Validate_Correctly(string zipCode, bool isValid)
        {
            var leadRequest = new LeadRequest
            {
                Name = "Test Name",
                PhoneNumber = "1234567890",
                ZipCode = zipCode,
                Email = null
            };

            var validationResults = ValidateModel(leadRequest);

            if (isValid)
            {
                validationResults.Should().BeEmpty();
            }
            else
            {
                validationResults.Should().ContainSingle(v => v.MemberNames.Contains(nameof(LeadRequest.ZipCode)));
            }
        }

        [Theory]
        [InlineData(null, true)]
        [InlineData("", true)]
        [InlineData("test@example.com", true)]
        [InlineData("invalid-email", false)]
        public void Email_Should_Validate_Correctly(string email, bool isValid)
        {
            var leadRequest = new LeadRequest
            {
                Name = "Test Name",
                PhoneNumber = "1234567890",
                ZipCode = "12345",
                Email = email
            };

            var validationResults = ValidateModel(leadRequest);

            if (isValid)
            {
                validationResults.Should().BeEmpty();
            }
            else
            {
                validationResults.Single().ErrorMessage.Should().Be("Invalid email address format.");

            }
        }

        private IList<ValidationResult> ValidateModel(object model)
        {
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(model, null, null);
            Validator.TryValidateObject(model, validationContext, validationResults, true);
            return validationResults;
        }
    }
}