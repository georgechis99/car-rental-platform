using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Web;
using API.BusinessLayer.Controllers;
using Entities;
using API.Entities;
using Shared.Dtos;
using Shared.Errors;
using Shared.Services.Interfaces;
using Shared.Extensions;

namespace Client.BusinessLayer.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _config;
        private readonly IEmailSender emailSender;

        public AccountController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IConfiguration config,
            IEmailSender emailSender)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _config = config;
            this.emailSender = emailSender;
        }

        [HttpGet("checkemailandsend")]
        public async Task<ActionResult<bool>> CheckEmailExistsAndSendAsync([FromQuery] string email)
        {
            var emailExists = await _userManager.FindByEmailAsync(email) != null;

            if (emailExists)
            {
                // Send a test email
                var senderEmail = _config["ReturnPaths:SenderEmail"];

                var fromAddress = senderEmail;
                var toAddress = email;
                var subject = "Test Email";
                var message = "This is a test email.";

                string confirmationEmailTemplate = "<html><body><h1>Welcome to our website!</h1><p>Please click the following link to confirm your email:</p><a href=\"{0}\">Confirm Email</a></body></html>";

                string confirmationLink = "https://example.com/confirm-email";

                string formattedMessage = string.Format(confirmationEmailTemplate, confirmationLink);

                try
                {
                    await emailSender.SendEmailAsync(fromAddress, toAddress, subject, formattedMessage, true);
                    return Ok(true);
                }
                catch (Exception ex)
                {
                    // Handle the exception appropriately (e.g., log the error)
                    return BadRequest("Failed to send email.");
                }
            }

            return Ok(false);
        }

        [HttpGet("registernewrenter")]
        public async Task<ActionResult<bool>> RegisterNewRenter([FromQuery] string FullName, string Email,string PhoneNumber)
        {
            var fromAddress = "george.chis@stns-development.com";
            var toAddress = "armin.torok@stns-development.com";
            var subject = "New Renter Just Registered!";

            string registrationEmailTemplate = "<html>\r\n\t<body>\r\n    \t<h1>Hello Laurentiu! A new renter wants to register!</h1>\r\n        <p>This is what he filled out as his personal information:</p>\r\n        <p><strong>Full Name : </strong>\"{0}\"</p>\r\n        <p><strong>Email : </strong>\"{1}\"</p>\r\n        <p><strong>Phone Number : </strong>\"{2}\"</p>\r\n        <h1>Salut Laurentiu! Un nou vanzator s-a inregistrat pe site!</h1>\r\n        <p>Asta a completat la informatiile lui personale:</p>\r\n        <p><strong>Nume intreg : </strong>\"{0}\"</p>\r\n        <p><strong>Email : </strong>\"{1}\"</p>\r\n        <p><strong>Numar de telefon : </strong>\"{2}\"</p>\r\n    </body>\r\n</html>";

            string registrationName = returnValidatedName(FullName);

            string registrationEmail = returnValidatedEmail(Email);

            string registrationPhoneNumber = returnValidatedPhoneNumber(PhoneNumber);

            string formattedMessage = string.Format(registrationEmailTemplate, registrationName, registrationEmail, registrationPhoneNumber);

            try
            {
                await emailSender.SendEmailAsync(fromAddress, toAddress, subject, formattedMessage, true);
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to send email new renter email.");
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByIdFromClaimsPrinciple(User);

            var role = await _userManager.GetUserRole(user);

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                Role = role,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
            };
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized(new ApiResponse(401));

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized(new ApiResponse(401));

            var role = await _userManager.GetUserRole(user);

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                Role = role
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse { Errors = new[] { "Email address is in use" } });
            }

            var user = new AppUser
            {
                Email = registerDto.Email,
                UserName = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                PhoneNumber = registerDto.PhoneNumber,
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(new ApiResponse(400));

            //send confirmation email
            var userFromDb = await _userManager.FindByEmailAsync(user.Email);

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(userFromDb);

            string tokenHtmlVersion = HttpUtility.UrlEncode(token);
            string callbackUrl = "https://localhost:5001/confirmemail?userId=" +
                    userFromDb.Id + "&token=" + tokenHtmlVersion;

            var senderEmail = _config["ReturnPaths:SenderEmail"];

            string confirmationEmailTemplate = "<html><body><h1>Welcome to our website!</h1><p>Please click the following link to confirm your email:</p><a href=\"{0}\">Confirm Email</a></body></html>";

            string confirmationLink = callbackUrl;

            string formattedMessage = string.Format(confirmationEmailTemplate, confirmationLink);

            await emailSender.SendEmailAsync(senderEmail, userFromDb.Email, "Confirm your email address", formattedMessage, true);

            //add role to user
            await _userManager.AddToRoleAsync(user, "User");
            var role = await _userManager.GetUserRole(user);

            return new UserDto
            {
                Id = user.Id,
                Token = _tokenService.CreateToken(user),
                Email = user.Email,
                Role = role
            };
        }

        [HttpPost("registerBusiness")]
        public async Task<ActionResult<UserDto>> RegisterBusiness(RegisterDto registerDto)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse { Errors = new[] { "Email address is in use" } });
            }

            var user = new AppUser
            {
                Email = registerDto.Email,
                UserName = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                PhoneNumber = registerDto.PhoneNumber,
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(new ApiResponse(400));

            await _userManager.AddToRoleAsync(user, "Business");

            var role = await _userManager.GetUserRole(user);

            return new UserDto
            {
                Id = user.Id,
                Token = _tokenService.CreateToken(user),
                Email = user.Email,
                Role = role
            };
        }

        [HttpPost("confirmemail")]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailViewModel model)
        {

            var user = await _userManager.FindByIdAsync(model.UserId);

            var result = await _userManager.ConfirmEmailAsync(user, model.Token);

            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest();
        }

        private string returnValidatedPhoneNumber(string phoneNumber)
        {
            return phoneNumber;
        }

        private string returnValidatedEmail(string email)
        {
            return email;
        }

        private string returnValidatedName(string fullName)
        {
            return fullName;
        }
    }
}