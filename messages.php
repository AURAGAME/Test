<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$messagesFile = "C:/Users/Ahmed/Desktop/SupportWeb/messages.json";

// استقبال الطلبات
$method = $_SERVER["REQUEST_METHOD"];

if ($method === "POST") {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input["text"])) {
        echo json_encode(["status" => "error", "message" => "Invalid request"]);
        exit;
    }

    $messages = file_exists($messagesFile) ? json_decode(file_get_contents($messagesFile), true) : [];
    if (!is_array($messages)) {
        $messages = [];
    }

    if (isset($input["replyIndex"])) {
        // تحديث الرد إذا كان الرد على رسالة معينة
        $index = intval($input["replyIndex"]);
        if (isset($messages[$index])) {
            $messages[$index]["reply"] = $input["text"];
        }
    } else {
        // إضافة رسالة جديدة
        $messages[] = ["text" => $input["text"], "reply" => ""];
    }

    // حفظ التعديلات
    file_put_contents($messagesFile, json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    echo json_encode(["status" => "success"]);
    exit;
}

// جلب الرسائل عند استخدام `GET`
if ($method === "GET") {
    if (file_exists($messagesFile)) {
        echo file_get_contents($messagesFile);
    } else {
        echo json_encode([]);
    }
    exit;
}

echo json_encode(["status" => "error", "message" => "Invalid request"]);
exit;
?>
