const { User } = require('../models');
const middleware = require('../middleware');
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {

        const { email, password, name } = req.body
        let passwordDigest = await middleware.hashPassword(password)
        let existingUser = await User.findOne({ email })
        if (existingUser) {
            return res
                .status(400)
                .send('A user with that email has already been registered!')
        } else {
            const user = await User.create({ name, email, passwordDigest })
            res.send(user)
        }
    } catch (error) {
        throw error
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        let matched = await middleware.comparePassword(
            user.passwordDigest,
            password
        )
        if (matched) {
            let payload = {
                id: user.id,
                email: user.email
            }
            let token = middleware.createToken(payload)
            return res.send({ user: payload, token })
        }
        res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
    } catch (error) {
        console.log(error)
        res.status(401).send({ status: 'Error', msg: 'An error has occurred!' })
    }
}

// const updatePassword = async (req, res) => {
//     try {
//         const { oldPassword, newPassword } = req.body
//         let user = await User.findById(req.params.user_id)
//         let matched = await middleware.comparePassword(
//             user.passwordDigest,
//             oldPassword
//         )
//         if (matched) {
//             let passwordDigest = await middleware.hashPassword(newPassword)
//             user = await User.findByIdAndUpdate(req.params.user_id, { passwordDigest })
//             let payload = {
//                 id: user.id,
//                 email: user.email
//             }
//             return res.send({ status: 'Password Updated!', user: payload })
//         }
//         res.status(401).send({ status: 'Error', msg: 'Old Password did not match!' })
//     } catch (error) {
//         console.log(error)
//         res.status(401).send({ status: 'Error', msg: 'An error has occurred updating password!' })
//     }
// }

const checkSession = async (req, res) => {
    const { payload } = res.locals
    res.send(payload)
}

const forgotPassword = async (req, res) => {
    let user
    let email
    if (process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD) {
        email = req.body.email
        try {
            user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ error: 'User with this email does not exist' })
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: 'User with this email does not exist' })
        }


        const token = jwt.sign({ _id: user._id }, process.env.APP_SECRET, { expiresIn: '15m' })

        // await user.updateOne({ resetLink: token })
        user.resetLink = token
        user.save()
        // let transporter = nodemailer.createTransport({
        //     host: 'smtp.gmail.com',
        //     port: 465,
        //     secure: true,
        //     auth: {
        //         user: process.env.MAIL_USERNAME,
        //         pass: process.env.MAIL_PASSWORD
        //     },
        // });
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                tls: {
                    rejectUnauthorized: false
                }
            }
        });

        const data = {
            to: email,
            subject: 'Reset Account Password Link',
            html: `
          <h3>Please click the link below to reset your password</h3>
          <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
          `,
        }

        transporter.sendMail(data, function (error, body) {
            if (error) {
                return res.status(400).json({ error: error.message })
            }
            return res.status(200).json({ message: 'Email has been sent, please follow the instructions' })
        })
    } else {
        return res.status(400).json({ error: 'You have not set up an account to send an email or a reset password key for jwt' })
    }
}
const updatePassword = async (req, res) => {
    const { token, password } = req.body
    if (token) {
        jwt.verify(token, process.env.APP_SECRET, function (error, decodedData) {
            if (error) {
                return res.status(400).json({ error: 'Incorrect token or it is expired' })
            }
            try {
                let user = User.findOne({ resetLink: token })
                if (!user) {
                    return res.status(400).json({ error: 'User with this token does not exist' })
                }
                user.password = password
                user.save()
                return res.status(200).json({ message: 'Your password has been changed' })
            } catch (error) {
                console.log(error)
                return res.status(400).json({ error: 'Reset Password Error' })
            }
        })
    } else {
        return res.status(401).json({ error: "Authentication Error" })
    }
}

module.exports = {
    register,
    login,
    updatePassword,
    checkSession,
    forgotPassword
}