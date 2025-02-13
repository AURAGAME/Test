const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

let messages = []; // تخزين مؤقت للرسائل (لأن Vercel لا يدعم fs)

// استقبال رسالة جديدة
app.post('/api/messages', (req, res) => {
    const { message, source } = req.body;

    if (!message) {
        return res.status(400).json({ error: "❌ Message content is required" });
    }

    // تحديد نوع الرسالة بناءً على المصدر
    if (source === "html") {
        messages.push(`Answer: ${message}`); // حفظ كـ Answer إذا كانت من HTML
    } else {
        messages.push(`Question: ${message}`); // حفظ كـ Question إذا كانت من Unity
    }

    res.json({ success: true, message: "✅ Message saved successfully!" });
});

// استرجاع جميع الرسائل
app.get('/api/messages', (req, res) => {
    res.json(messages);
});

// بدء تشغيل السيرفر
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
