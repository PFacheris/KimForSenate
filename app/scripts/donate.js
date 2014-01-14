$(document).ready(function() {
  var $container = $('.form-container');
  var startLoad = function() {
    $container.find('.loading').css('display', 'block');
    $container.find('.step-container').addClass('blur');
  };

  var stopLoad = function() {
    $container.find('.loading').css('display', 'none');
    $container.find('.step-container').removeClass('blur');
  };

  var $form = $('#payment-form');
  // Stripe
  var stripeResponseHandler = function(status, response) {
    if (response.error)
    {
      // Show the errors on the form
      $('.payment-errors').text(response.error.message);
      $form.find('input[type="submit"]').prop('disabled', false);
    }
    else
    {
      // token contains id, last4, and card type
      var token = response.id;
      // and re-submit
      try {
        $.ajax({
          type: $form.attr('method'),
          url: $form.attr('action'),
          data: {
            stripeToken: token,
            amount: $form.find('input[name="amount"]').val(),
            name: $form.find('input[name="name"]').val(),
            street: $form.find('input[name="street"]').val(),
            city: $form.find('input[name="city"]').val(),
            state: $form.find('input[name="state"]').val(),
            zip: $form.find('input[name="zip"]').val(),
            employer: $form.find('input[name="employer"]').val(),
            occupation: $form.find('input[name="occupation"]').val()
          },
          success: function(data, status, xhr) {
            window.location.protocol = 'http:';
            window.location.href = '/donate_complete.html?amount=' + $form.find('input[name="amount"]').val();
          },
          error: function(xhr, status, err) {
            $('.payment-errors').text(xhr.responseText);
          },
          complete: function() {
            stopLoad();
          },
          dataType: 'json'
        });
      }
      catch (err)
      {
        $('.payment-errors').text("The system may currently be down, please try again later.");
      }

      $form.find('input[type="submit"]').prop('disabled', false);
    }
  };

  // Form Step Transition
  $('[data-step-nav]').on('click', function(event) {
    if ($(this).hasClass('disabled')) { return false; }

    var toActivate = $('.form-container .step[data-step="' + $(this).attr('data-step-nav') + '"]');
    if (toActivate.hasClass('active')) { return false; }

    $('a.step-link.active').removeClass('active');
    $('.form-container .step.active').removeClass('active');

    $(this).addClass('active');
    toActivate.addClass('active');
  });

  // Step 1: Preset buttons
  $('[data-amount-set]').on('click', function(event) {
    var value = $(this).attr('data-amount-set');
    $('#amount').val(value);
    $('#amount').trigger('change');
  });

  var generateErrorContainer = function (element, isRadioOrCheckbox) {
    var $container = element.parent().find('.error');

    if ($container.length === 0) {
      $container = $("<div class='error'></div>").insertBefore(element);
    }
    
    return $container;
  }

  var positionErrorContainer = function() {
    var element = $('.input-container .error');
    var bottom = element.parent().find('input').height() + 10;
    element.css('bottom', bottom + 'px');
  }

  $(window).on('resize', function() {
    positionErrorContainer();
  });

  // Step 1
  $('#amount-form').parsley({
    trigger: 'submit',
    listeners: {
      onFieldError: function ( elem, constraints, ParsleyField ) {
        $('[data-step-nav="2"]').addClass('disabled');
        $('[data-step-nav="3"]').addClass('disabled');
        window.setTimeout(positionErrorContainer, 0);
      },
      onFieldSuccess: function ( elem, constraints, ParsleyField ) {
        elem.parent().find('.error').remove();
      }
    },
    validators: {
      currency: function() {
        return {
          validate: function(val) {
            return /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/.test(val);
          },
          priority: 2
        };
      }
    },
    errors: {
      container: generateErrorContainer
    }
  });

  $('#amount-form').submit(function(event) {
    event.preventDefault();
    if($(this).parsley('validate'))
    {
      $('[data-step-nav="2"]').removeClass('disabled').trigger('click');
      $('[data-step="1"] input[type!="submit"]').each(function() {
        $(this).clone().appendTo('[data-step="3"] form').attr('type', 'hidden');
      });
    }
  });

  // Step 2
  $('#info-form').parsley({
    trigger: 'submit',
    listeners: {
      onFieldError: function ( elem, constraints, ParsleyField ) {
        $('[data-step-nav="3"]').addClass('disabled');
        window.setTimeout(positionErrorContainer, 0);
      },
      onFieldSuccess: function ( elem, constraints, ParsleyField ) {
        elem.parent().find('.error').remove();
      }
    },
    validators: {
      zipcode: function() {
        return {
          validate: function(val) {
            return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(val);
          },
          priority: 2
        };
      },
      state: function() {
        return {
          validate: function(val) {
            return /^(?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/.test(val);
          },
          priority: 2
        };
      }
    },
    messages: {
      zipcode: 'ZIP Code format is invalid.'
    },
    errors: {
      container: generateErrorContainer
    }
  });

  $('#info-form').submit(function(event) {
    event.preventDefault();
    if($(this).parsley('validate'))
    {
      $('[data-step-nav="3"]').removeClass('disabled').trigger('click');
      $('[data-step="2"] input[type!="submit"]').each(function() {
        $(this).clone().appendTo('[data-step="3"] form').attr('type', 'hidden');
      });
    }
  });

  // Step 3
  $form.parsley({
    trigger: 'submit',
    listeners: {
      onFieldError: function(elem, constraints, ParsleyField) {
        window.setTimeout(positionErrorContainer, 0);
      },
      onFieldSuccess: function(elem, constraints, ParsleyField) {
        elem.parent().find('.error').remove();
      }
    },
    validators: {
      cvc: function() {
        return {
          validate: function(val) {
            return Stripe.card.validateCVC(val);
          },
          priority: 2
        };
      },
      credit: function() {
        return {
          validate: function(val) {
            return Stripe.card.validateCardNumber(val);
          },
          priority: 2
        };
      },
      month: function() {
        return {
          validate: function(val) {
            var $curYear = $form.find('input[name="exp-year"]');
            if ($curYear.parsley('valid'))
            {
              return Stripe.card.validateExpiry(val, $curYear.val());
            }
            return true;
          },
          priority: 2
        }
      }
    },
    messages: {
      cvc: 'CVC should be 3 digits.',
      credit: 'Number is invalid'
    },
    errors: {
      container: generateErrorContainer
    }
  });

  $('[data-step="3"] form input[type!="submit"]').each(function() {
    $(this).parsley( 'addConstraint', { required: true } );
  });

  $('[data-step="3"] form input#exp-year').parsley( 'addConstraint', { min: new Date().getFullYear() } );

  $form.submit(function(event) {
    if($(this).parsley('validate'))
    {
      $form.find('input[type="submit"]').prop('disabled', true);
      startLoad();
      Stripe.card.createToken($form, stripeResponseHandler);
    }
    return false;
  });

});