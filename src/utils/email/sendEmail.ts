import { createTransport } from 'nodemailer';
import { SendEmailDTO } from 'src/dto/emails/send-email.dto';

function config(send: SendEmailDTO) {
    const optionsMail = {
        from: send.from,
        to: send.to,
        subject: send.subject,
        text: send.text,
        html: send.html,
    };

    const optionsTransport = {
        host: 'smtp.gmail.com',
        port: 465,
        auth: send.auth,
    };
    return { optionsMail, optionsTransport };
}

async function send(optionsMail: any, optionsTransport: any) {
    return new Promise(async (resolve, reject) => {
        try {
            const transporter = createTransport(optionsTransport);
            const info = await transporter.sendMail(optionsMail);
            resolve(info);
        } catch (error) {
            reject(error);
        }
    });
}

export default { config, send };