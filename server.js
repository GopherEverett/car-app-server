const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
require('./db')
const app = express()
const nodemailer = require('nodemailer')

const PORT = process.env.PORT || 3000

const authRouter = require('./routes/authRouter')


app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRouter)
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         type: 'OAuth2',
//         user: process.env.MAIL_USERNAME,
//         pass: process.env.MAIL_PASSWORD,
//         clientId: process.env.OAUTH_CLIENTID,
//         clientSecret: process.env.OAUTH_CLIENT_SECRET,
//         refreshToken: process.env.OAUTH_REFRESH_TOKEN,
//         tls: {
//             rejectUnauthorized: false
//         }
//     }
// });

// let mailOptions = {
//     from: "john.a.jacobs1973@gmail.com",
//     to: "john.a.jacobs1973@gmail.com",
//     subject: 'Nodemailer Project',
//     text: 'Hi from your nodemailer project'
// };

// transporter.sendMail(mailOptions, function (err, data) {
//     if (err) {
//         console.log("Error " + err);
//     } else {
//         console.log("Email sent successfully");
//     }
// });

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})