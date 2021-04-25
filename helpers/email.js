const sgMail = require('@sendgrid/mail')
const Mailgen = require('mailgen')
const dotenv = require('dotenv')
dotenv.config()

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Contacts base',
    link: 'https://localhost:3000/'
  }
})

const sendVerifyMail = async (verifyToken, email) => {
  const template = {
    body: {
      name: email,
      intro: 'Hello my dear friend!',
      action: {
        instructions: 'To get started with Contacts, please click here:',
        button: {
          color: '#ff9696',
          text: 'Confirm your account',
          link: `http://localhost:3000/api/users/verify/${verifyToken}`
        }
      },
      outro: 'For all questions, please contact this mail.'
    }
  }

  const emailBody = mailGenerator.generate(template)

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  const msg = {
    from: 'lyon@goit.com',
    to: email,
    subject: '1st auto mail',
    html: emailBody,
  }
  emailBody
  .sendMail(newMail)
  .then(info => console.log(info))
  .catch(error => console.log(error))

  await sgMail.send(msg)
}

module.exports = { sendVerifyMail }