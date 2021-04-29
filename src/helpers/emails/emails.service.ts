import { Injectable } from '@nestjs/common';
import { SendEmailDTO } from '../../dto/emails/send-email.dto';
import sendEmail from '../../utils/email/sendEmail';
@Injectable()
export class EmailsService {
    async sendEmail(sendEmailDto: SendEmailDTO) {
        try {
            const options = sendEmail.config(sendEmailDto)
            const content = await sendEmail.send(options.optionsMail, options.optionsTransport)
            return content
        } catch (error) {
            throw error.message || error
        }
    }
}
