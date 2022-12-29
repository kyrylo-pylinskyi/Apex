using Apex.Models.RequestDto;

namespace Apex.Service.MailService
{
    public interface IMailService
    {
        void SendMail(EmailRequest request);
    }
}