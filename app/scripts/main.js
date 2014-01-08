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
      $form.get(0).submit();
    }
    return false;
  });
});