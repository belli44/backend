const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  },
  tls: {
    rejectUnauthorized: false // للاختبار فقط
  }
});

const mailOptions = {
  from: 'your-email@gmail.com',
  to: 'your-email@gmail.com',
  subject: 'اختبار',
  text: 'هذا بريد اختباري'
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error('خطأ:', err);
  } else {
    console.log('تم الإرسال:', info.response);
  }
});