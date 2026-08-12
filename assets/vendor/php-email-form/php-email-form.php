<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

class PHP_Email_Form {
  public $to;
  public $from_name;
  public $from_email;
  public $subject;
  public $ajax = false;
  private $messages = [];
  public $smtp = [];

  public function add_message($content, $label, $min_length = 0) {
    if (strlen(trim($content)) >= $min_length) {
      $this->messages[] = "$label: " . strip_tags($content);
    }
  }

  public function send() {
    $mail = new PHPMailer(true);

    try {
      if (!empty($this->smtp)) {
        $mail->isSMTP();
        $mail->Host = $this->smtp["host"];
        $mail->SMTPAuth = true;
        $mail->Username = $this->smtp["username"];
        $mail->Password = $this->smtp["password"];
        $mail->SMTPSecure = $this->smtp["encryption"] ?? "tls";
        $mail->Port = $this->smtp["port"];
      }

      $mail->setFrom($this->from_email, $this->from_name);
      $mail->addAddress($this->to);
      $mail->addReplyTo($this->from_email, $this->from_name);

      $mail->Subject = $this->subject;
      $mail->Body = implode("\n", $this->messages);

      if ($mail->send()) {
        return 'OK';
      } else {
        return 'Error al enviar el mensaje. Por favor, intenta más tarde.';
      }
    } catch (Exception $e) {
      return 'Mailer Error: ' . $mail->ErrorInfo;
    }
  }
}
?>
