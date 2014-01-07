<?php
http_response_code(400);
// Includes
require_once(dirname(__FILE__) . "/php-lib/stripe-php/lib/Stripe.php");

// Return JSON
header('Content-Type: application/json');

// Set your secret key: remember to change this to your live secret key in production
// See your keys here https://manage.stripe.com/account
Stripe::setApiKey("sk_test_agZtGI049l0Lnm99JCTWkhOr");

// Get the details submitted by the form
$token = $_POST['stripeToken'];
$amount = $_POST['amount'];
$name = $_POST['name'];

// Check if fields are set
if(!isset($token) || !isset($amount) || !isset($name))
{
  exit;
}

// Create the charge on Stripe's servers - this will charge the user's card
try {
$charge = Stripe_Charge::create(array(
  "amount" => $amount, // amount in cents, again
  "currency" => "usd",
  "card" => $token,
  "description" => "Donation by " . $name)
);
// Send result
http_response_code(200);
echo $charge;

} catch(Stripe_CardError $e) {
  // The card has been declined
  http_response_code(500);
  echo $e;
  exit; 
}
?>