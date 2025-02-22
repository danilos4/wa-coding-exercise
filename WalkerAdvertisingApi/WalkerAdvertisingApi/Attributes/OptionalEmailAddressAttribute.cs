using System.ComponentModel.DataAnnotations;

public class OptionalEmailAddressAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        var email = value as string;

        if (string.IsNullOrEmpty(email))
        {
            return ValidationResult.Success;
        }

        var emailAddressAttribute = new EmailAddressAttribute();
        if (emailAddressAttribute.IsValid(email))
        {
            return ValidationResult.Success;
        }

        return new ValidationResult("Invalid email address format.");
    }
}