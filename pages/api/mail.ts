import nodemailer from 'nodemailer'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function mail(req: NextApiRequest, res: NextApiResponse) {
    
    const { name, email, message } = req.body;
  
    const transporter = nodemailer.createTransport({
        host: "in-v3.mailjet.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env["MAILJET_USER"], // generated ethereal user
            pass: process.env["MAILJET_PASS"], // generated ethereal password
        },
    });
  
    const mailOption = {
        from: `${process.env.EMAIL_FROM}`,
        to: `${process.env.EMAIL_TO}`,
        subject: `New mail from ${email}`,
        text: `
        ${name} wrote:
        ${message}
        `,
    };

    try {
        await transporter.sendMail(mailOption)
        res.status(200).send("Successfully sent mail")
    } catch (error) {
        res.status(500).send("There was an error while sending mail")
    }
}