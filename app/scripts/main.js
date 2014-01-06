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

  var validateNewsletterForm = function() {
    var $form = $('form');
    if ($form.length > 0) {
      $form.each(function() {
        $(this).validate({
          submitHandler: function() {
            $.ajax({
              type: $form.attr('method'),
              url: $form.attr('action'),
              data: $form.serialize(),
              cache       : false,
              dataType    : 'json',
              contentType: 'application/json; charset=utf-8',
              error       : function(err) { alert('Could not connect to the registration server. Please try again later.'); },
              success     : function(data) {
                if (data.result != 'success') {
                  alert(data.msg)
                }
              }
            });
          },
          errorPlacement: function(error, element) {
            return true;
          },
          rules: {
            ZIPCODE: {
              required: true,
              digits: true,
              minlength: 5,
              maxlength: 5
            },
            EMAIL: {
              required: true,
              email: true
            },
            PHONE: {
              required: false,
              phoneUS: true
            }
          }
        });
      });
    }
  };

  validateNewsletterForm();
});