using Apex.Models.Dto;

namespace Apex.Service.MailService
{
    public interface IMailService
    {
        void SendMail(EmailDto request);
    }
}