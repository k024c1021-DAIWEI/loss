const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

app.use(express.static('public'));
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
    }
});

app.post('/send', upload.single('image'), (req, res) => {
    const { email, note } = req.body;
    const filePath = req.file ? `uploads/${req.file.filename}` : '';

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: '忘れ物チェック',
        text: `便笺内容:\n${note}\n\n画像ファイル:\n${filePath}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('送信に失敗しました');
        }
        res.send('送信が完了しました');
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});