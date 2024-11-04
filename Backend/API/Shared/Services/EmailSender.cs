using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;
using Shared.Services.Interfaces;

namespace Shared.Services
{
    public class EmailSender : IEmailSender
    {

        private readonly IConfiguration _config;

        public EmailSender(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string fromAddress, string toAddress, string subject, string message, bool isHtml = false)
        {
            var mailMessage = new MailMessage(fromAddress, toAddress, subject, message);
            mailMessage.IsBodyHtml = isHtml;

            using (var client = new SmtpClient(_config["SMTP:Host"], int.Parse(_config["SMTP:Port"]))
            {
                Credentials = new NetworkCredential(_config["SMTP:Username"], _config["SMTP:Password"]),
                EnableSsl = true
            })
            {
                await client.SendMailAsync(mailMessage);
            }
        }
    }
}
