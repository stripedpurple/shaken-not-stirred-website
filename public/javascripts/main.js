$(document).ready(function () {
    // smooth scrolling
    $('a[href*="#"]')
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            var $position = $($(this).attr('href')).offset().top;
            $('html, body').stop().animate({
                scrollTop: $position
            }, 600);
            event.preventDefault();
        });

    // Contact Us Submit
    $('#contact-form').submit(function () {
        return false;
    });

    $('#contact-submit').click(function () {

        var posting = $.post('/contact', $('#contact-form').serialize());

        posting.done(function (data) {
            console.log('success', data);
            $('#contact-us .msg').html('<div class="notification is-success"><button class="delete"></button>Thank you for contacting Shaken Not Stirred?. Someone will contact you shortly!</div>');
        }).fail(function (err) {
            console.log(err);
            $('#contact-us .msg').html('<div class="notification is-danger"><button class="delete"></button>' + err.responseText + '</div>');
        });

        return false;
    });

    // notifaction closer
    $(document).on('click', '.notification > button.delete', function () {
        $(this).parent().addClass('is-hidden');
        return false;
    });

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function () {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });

    // Navbar Affixer
    jQuery.fn.exists = function () {
        return this.length > 0;
    };

    var first = $('.first');
    var firstOffset;

    firstOffset = first.exists() ? first.offset().top : 100;

    var navbar = $('.navbar');

    $(document).on('scroll', function () {
        if ($(document).scrollTop() >= firstOffset && !navbar.attr('class').includes('is-fixed-top')) {
            navbar.toggleClass('is-fixed-top');
        } else if ($(document).scrollTop() < firstOffset && navbar.attr('class').includes('is-fixed-top')) {
            navbar.toggleClass('is-fixed-top');
        }

    });
});