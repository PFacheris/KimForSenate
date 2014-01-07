$(document).ready(function() {

  // Top Bar Affix
  var affixTopbar = function() {
    if ($(window).scrollTop() >= 76) {
      $('header').addClass('affix');
    }
    else {
      $('header').removeClass('affix');
    }
  };

  // Background Image Subtle Scroll
  var initialY = $('.gallery').css('background-position-y');
  initialY = parseInt(initialY.substring(0, initialY.indexOf('px')));
  var scrollBackgroundImage = function() {
    var scroll = parseInt($(window).scrollTop());
    var scrollRatio = - (scroll / 5);
    scrollRatio += initialY;
    $('.gallery').css('background-position', '50% ' + scrollRatio + "px");
  };

  scrollBackgroundImage();

  $(window).bind('scroll', function() {
    affixTopbar();
    scrollBackgroundImage();
  });

  // Newsletter Mailchimp Validation
  $('form.mailchimp').each(function() {
    $(this).parsley({
      trigger: 'submit',
      validators: {
        zipcode: function() {
          return {
            validate: function(val) {
              return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(val);
            },
            priority: 2
          };
        }
      },
      messages: {
        zipcode: 'ZIP Code format is invalid.'
      },
      errors: {
        container: function() { return false; }
      }
    });
  });

  $('form.mailchimp').on('submit', function(event) {
    var $form = $(this);
    if($form.parsley('validate'))
    {
      var $submitButton = $form.find('input[type="submit"]');
      $submitButton.prop('disabled', true);
      $.ajax({
        type: $form.attr('method'),
        url: $form.attr('action'),
        data: $form.serialize(),
        cache       : false,
        dataType    : 'json',
        contentType: "application/json; charset=utf-8",
        error       : function(err) { 
          console.log(err);
          alert('Unfortunately an error occured when attempting to subscribe, please try again later.')
          $submitButton.prop('disabled', false);
        },
        success     : function(data) {
          $submitButton.prop('disabled', false);
          window.location.href = "/mail_complete.html";
        }
      });
    }
    return false;
  });
});