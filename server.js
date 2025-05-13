const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware لمعالجة البيانات
app.use(bodyParser.json()); // لمعالجة JSON من fetch
app.use(cors()); // السماح بطلبات CORS من أي مصدر
app.use(express.static(path.join(__dirname, 'public'))); // تقديم الملفات الثابتة

// إعداد nodemailer مع Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yousseflachgar288@gmail.com', // استبدل ببريدك الإلكتروني
    pass: 'pkim zwdi nepu gaha' // استبدل بكلمة مرور التطبيق
  },
  // تجاوز التحقق من الشهادة (للاختبار فقط)
  tls: {
    rejectUnauthorized: false
  }
});

// التحقق من اتصال nodemailer
transporter.verify((error, success) => {
  if (error) {
    console.error('خطأ في إعداد nodemailer:', error);
  } else {
    console.log('nodemailer جاهز لإرسال البريد');
  }
});

// نقطة نهاية لاستقبال بيانات النموذج وإرسالها بالبريد
app.post('/send', async (req, res) => {
  try {
    const { name, phone, address, city, size } = req.body;

    // التحقق من البيانات
    if (!name || !phone || !address || !city || !size) {
      return res.status(400).json({ message: 'يرجى ملء جميع الحقول واختيار المقاس' });
    }

    // التحقق من أن المقاس صالح
    const validSizes = ['L', 'XL', '2XL', '3XL'];
    if (!validSizes.includes(size)) {
      return res.status(400).json({ message: 'المقاس غير صالح' });
    }

    // إعداد محتوى البريد الإلكتروني
    const mailOptions = {
      from: 'yousseflachgar288@gmail.com', // استبدل ببريدك
      to: 'yousseflachgar288@gmail.com', // استبدل بالبريد الذي سيتلقى الطلبات
      subject: 'طلب جديد من نموذج المنتج',
      html: `
        <h2>تفاصيل الطلب الجديد</h2>
        <p><strong>الاسم:</strong> ${name}</p>
        <p><strong>الهاتف:</strong> ${phone}</p>
        <p><strong>العنوان:</strong> ${address}</p>
        <p><strong>المدينة:</strong> ${city}</p>
        <p><strong>المقاس:</strong> ${size}</p>
        <p><strong>تاريخ الطلب:</strong> ${new Date().toLocaleString('ar-EG')}</p>
      `
    };

    // إرسال البريد الإلكتروني
    await transporter.sendMail(mailOptions);
    console.log('تم إرسال البريد بنجاح إلى:', mailOptions.to);

    res.status(200).json({ message: 'تم إرسال الطلب بنجاح!' });
  } catch (err) {
    console.error('خطأ في معالجة الطلب:', err);
    res.status(500).json({ message: 'حدث خطأ أثناء إرسال الطلب', error: err.message });
  }
});

// تشغيل الخادم
app.listen(port, () => {
  console.log(`الخادم يعمل على http://localhost:${port}`);
});