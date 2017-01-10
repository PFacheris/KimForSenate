<?php
http_response_code(400);
// Includes
require_once(dirname(__FILE__) . "/php-lib/stripe-php/lib/Stripe.php");

// Return JSON
header('Content-Type: application/json');

// Set your secret key: remember to change this to your live secret key in production
// See your keys here https://manage.stripe.com/account
Stripe::setApiKey("");

// Get the details submitted by the form
$token = $_POST['stripeToken'];
$amount = $_POST['amount'];
$name = $_POST['name'];
$street = $_POST['street'];
$city = $_POST['city'];
$state = $_POST['state'];
$zip = $_POST['zip'];
$employer = $_POST['employer'];
$occupation = $_POST['occupation'];

// Check if fields are set
if(!isset($token) || !isset($amount) || !isset($name) || !isset($employer)  || !isset($occupation))
{
  exit;
}

$headers = "From: no-reply@kimforsenate.org\r\n";
date_default_timezone_set('America/Chicago');
// Create the charge on Stripe's servers - this will charge the user's card
try {
  $charge = Stripe_Charge::create(array(
    "amount" => intval(doubleval($amount) * 100), // amount in cents, again
    "currency" => "usd",
    "card" => $token,
    "description" => "Donation by " . $name)
  );
  // Send result
  http_response_code(200);
  echo $charge;
  $body = "DONATION RECEIVED FROM:\nName: " . $name . "\n" . "Amount (USD): $" . $amount . "\n" . "Street Address: " . $street . "\n" . "City: " . $city . "\n" . "State: " . $state . "\n" . "ZIP Code: " . $zip . "\n" . "Employer: " . $employer . "\n" . "Occupation: " . $occupation . "\n";
  mail('donations@kimforsenate.org', 'Donation from ' . $name . ' on ' . date("m/d/Y"), $body, $headers);
} catch(Stripe_CardError $e) {
  // Since it's a decline, Stripe_CardError will be caught
  $body = $e->getJsonBody();
  $err  = $body['error'];

  http_response_code(500);
  echo 'An error occured when processing your card: ' . $err['message'] . "\n";
  exit;
} catch (Stripe_InvalidRequestError $e) {
  // Malformed request.
  $body = $e->getJsonBody();
  $err  = $body['error'];

  http_response_code(500);
  echo 'An error occured on our end, please report this to us immediately.' . "\n";
  mail('admin@kimforsenate.org', '[ERROR] CHARGE.PHP', json_encode($err), $headers);
  exit;
} catch (Stripe_AuthenticationError $e) {
  // Authentication with Stripe's API failed
  // (maybe you changed API keys recently)
  $body = $e->getJsonBody();
  $err  = $body['error'];

  http_response_code(500);
  echo 'An error occured on our end, please report this to us immediately.' . "\n";
  mail('admin@kimforsenate.org', '[ERROR] CHARGE.PHP', json_encode($err), $headers);
  exit;
} catch (Stripe_ApiConnectionError $e) {
  // Network communication with Stripe failed
  http_response_code(500);
  echo 'Network communication with our payment processing service failed, please try again later' . "\n";
  exit;
} catch (Stripe_Error $e) {
  // Display a very generic error to the user, and maybe send
  // yourself an email
  $body = $e->getJsonBody();
  $err  = $body['error'];

  http_response_code(500);
  echo 'Generic error occured, please report this to admin@kimforsenate.org.' . "\n";
  mail('admin@kimforsenate.org', '[ERROR] CHARGE.PHP', json_encode($err), $headers);
  exit;
} catch (Exception $e) {
  // Something else happened, completely unrelated to Stripe
  http_response_code(500);
  echo "Something is broken on our end, we're working hard to fix it!" . "\n";
  mail('admin@kimforsenate.org', '[ERROR] CHARGE.PHP', 'GENERIC ERROR: \n' . json_encode($e), $headers);
  exit;
}
?>
