<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once '../assets/vendor/php-email-form/php-email-form.php';

$contact = new PHP_Email_Form;
$contact->ajax = true;

$contact->to = 'carloslarax4@gmail.com';  // <-- CORREO DESTINO

$contact->from_name = $_POST['name'] ?? '';
$contact->from_email = $_POST['email'] ?? '';
$contact->subject = $_POST['subject'] ?? 'Nuevo mensaje del formulario';

$contact->smtp = array(
  'host' => 'smtp.gmail.com',
  'username' => '',  // <-- TU CORREO GMAIL
  'password' => '',            // <-- CONTRASEÑA DE APLICACIÓN (incluye espacios)
  'port' => '587',
  'encryption' => 'tls'
);

$contact->add_message($_POST['name'], 'Nombre', 3);
$contact->add_message($_POST['email'], 'Correo', 5);
$contact->add_message($_POST['message'], 'Mensaje', 10);

echo $contact->send();
