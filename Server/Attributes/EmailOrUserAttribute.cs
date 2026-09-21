using System.ComponentModel.DataAnnotations;

namespace Server.Attributes
{
    public class EmailOrUserAttribute: ValidationAttribute
    {

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {

            //validate if string and not empty or null
            if (value is not string inputIdentifier || string.IsNullOrWhiteSpace(inputIdentifier)) {
                return new ValidationResult("Email or username is required.");
            }

            if (inputIdentifier.Contains("@")){
                
                // validate email
                var emailValidator = new EmailAddressAttribute();

                if (!emailValidator.IsValid(inputIdentifier)) {
                    return new ValidationResult("Please enter a valid email address.");
                }
            }
            else {

                // validate username
                if (inputIdentifier.Length < 8) {
                    return new ValidationResult("Username must be at least 3 characters long.");
                }
            }


            return ValidationResult.Success;
        }

    }
}
