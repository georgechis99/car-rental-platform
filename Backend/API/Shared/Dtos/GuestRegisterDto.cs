using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos
{
    public class GuestRegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        //[RegularExpression(@"^\+(?:[0-9] ?){6,14}[0-9]$", ErrorMessage = "Phone number does not match the valid format.")]
        public string PhoneNumber { get; set; }
    }
}
