import { Mailjet } from 'node-mailjet';

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_PUBLIC_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY
});

export default mailjet;