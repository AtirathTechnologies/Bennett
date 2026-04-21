<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer files
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 🔹 Get form data
    $name    = htmlspecialchars($_POST['fullname'] ?? '');
    $email   = htmlspecialchars($_POST['email'] ?? '');
    $mobile  = htmlspecialchars($_POST['mobile'] ?? '');
    $city    = htmlspecialchars($_POST['city'] ?? '');
    $course  = htmlspecialchars($_POST['mba_specialization'] ?? '');

    // 🔹 Validation
    if (empty($name) || empty($email) || empty($mobile)) {
        echo "Please fill all required fields!";
        exit();
    }

    $mail = new PHPMailer(true);

    try {
        // ================= SMTP CONFIG (GoDaddy) =================
        $mail->isSMTP();
        $mail->Host       = 'smtpout.secureserver.net';
        $mail->SMTPAuth   = true;

        // 🔴 YOUR GODADDY EMAIL
        $mail->Username   = 'info@atirathtechnologies.com';

        // 🔴 PASSWORD (your GoDaddy email password)
        $mail->Password   = 'Atirath@2025';

        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        // ================= EMAIL SETTINGS =================

        // 👉 Sender (domain email)
        $mail->setFrom('info@atirathtechnologies.com', "$name (MBA Lead)");

        // 👉 Receiver
        $mail->addAddress('vkpraveen216@gmail.com');

        // 👉 Reply goes to user
        $mail->addReplyTo($email, $name);

        // ================= EMAIL CONTENT =================
        $mail->isHTML(true);
        $mail->Subject = "New Lead from $name ($email)";

        $mail->Body = "
            <h2>New MBA Lead</h2>
            <table border='1' cellpadding='10' cellspacing='0'>
                <tr><td><b>Name</b></td><td>$name</td></tr>
                <tr><td><b>Email</b></td><td>$email</td></tr>
                <tr><td><b>Mobile</b></td><td>$mobile</td></tr>
                <tr><td><b>City</b></td><td>$city</td></tr>
                <tr><td><b>Course</b></td><td>$course</td></tr>
            </table>
        ";

        $mail->AltBody = "Name: $name\nEmail: $email\nMobile: $mobile\nCity: $city\nCourse: $course";

        // ================= SEND =================
        $mail->send();

        // ================= WHATSAPP =================
        $whatsapp_number = "919963323226";

        $message = urlencode(
            "New MBA Enquiry:\n\n" .
            "Name: $name\n" .
            "Email: $email\n" .
            "Mobile: $mobile\n" .
            "City: $city\n" .
            "Course: $course"
        );

        header("Location: https://wa.me/$whatsapp_number?text=$message");
        exit();

    } catch (Exception $e) {
        echo "<h3>❌ Mail Error:</h3>";
        echo $mail->ErrorInfo;
    }
}
?>