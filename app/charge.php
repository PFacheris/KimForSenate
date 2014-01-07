<?php
require_once(dirname(__FILE__) . "/php-lib/stripe-php/lib/Stripe.php");
// Set your secret key: remember to change this to your live secret key in production
// See your keys here https://manage.stripe.com/account
Stripe::setApiKey("sk_test_agZtGI049l0Lnm99JCTWkhOr");

// Get the credit card details submitted by the form
$token = $_POST['stripeToken'];

// Create the charge on Stripe's servers - this will charge the user's card
try {
$charge = Stripe_Charge::create(array(
  "amount" => $_POST['amount'], // amount in cents, again
  "currency" => "usd",
  "card" => $token,
  "description" => "Donation by" . $_POST['name'])
);
} catch(Stripe_CardError $e) {
  // The card has been declined
  echo json_encode($e);
}

header('Content-Type: application/json');
echo json_encode($data);
?>