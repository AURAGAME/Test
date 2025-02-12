const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const filePath = 'messages.json';

// تحميل الرسائل المخزنة من الملف
function loadMessages() {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error("❌ Error parsing JSON:", error);
            return [];
        }
    }
    return [];
}

// حفظ الرسائل إلى الملف
function saveMessages(messages) {
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf8');
}

// استقبال رسالة جديدة
app.post('/api/messages', (req, res) => {
    const { message, source } = req.body;

    if (!message) {
        return res.status(400).json({ error: "❌ Message content is required" });
    }

    let messages = loadMessages();

    // تحديد نوع الرسالة بناءً على المصدر
    if (source === "html") {
        messages.push(`Answer: ${message}`); // حفظ كـ Answer إذا كانت من HTML
    } else {
        messages.push(`Question: ${message}`); // حفظ كـ Question إذا كانت من Unity
    }

    saveMessages(messages);

    res.json({ success: true, message: "✅ Message saved successfully!" });
});

// استرجاع جميع الرسائل
app.get('/api/messages', (req, res) => {
    const messages = loadMessages();
    res.json(messages);
});

// بدء تشغيل السيرفر على جميع الشبكة
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});
