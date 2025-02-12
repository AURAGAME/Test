const sendMessageBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat");

const apiUrl = "http://localhost:3000/api/messages"; // رابط السيرفر

// إرسال الرسالة مع "source: HTML"
const sendMessage = async () => {
    const message = messageInput.value.trim();
    if (message !== "") {
        try {
            console.log("📤 Sending:", { message, source: "html" }); // ✅ التأكد من الإرسال الصحيح
            
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message, source: "html" }) // ✅ إرسال "source"
            });

            const data = await response.json();
            if (data.success) {
                messageInput.value = ""; // مسح الإدخال
                loadMessages(); // تحديث الرسائل
            } else {
                console.error("❌ Error:", data.message);
            }
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }
    }
};

// تحميل الرسائل من السيرفر
const loadMessages = async () => {
    try {
        const response = await fetch(apiUrl);
        const messages = await response.json();
        chatBox.innerHTML = ""; // مسح الرسائل السابقة

        messages.forEach((msg) => {
            const messageElement = document.createElement("p");
            messageElement.textContent = msg;
            chatBox.appendChild(messageElement);
        });
    } catch (error) {
        console.error("❌ Error loading messages:", error);
    }
};

// عند الضغط على زر الإرسال
sendMessageBtn.addEventListener("click", sendMessage);

// تحميل الرسائل عند فتح الصفحة
window.onload = () => {
    loadMessages();
    setInterval(loadMessages, 2000); // تحديث كل 2 ثانية
};