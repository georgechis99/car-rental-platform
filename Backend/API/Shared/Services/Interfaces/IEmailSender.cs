﻿namespace Shared.Services.Interfaces
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string fromAddress, string toAddress, string subject, string message, bool isHtml);
    }
}
