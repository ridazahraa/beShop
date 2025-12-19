$(document).ready(function() {
    const form = $('#checkoutForm');
    
    // Show/hide card fields based on payment method
    $('input[name="payment"]').change(function() {
        const isCard = $(this).val() === 'card';
        $('#cardFields').slideToggle(isCard);
        $('#cardNumber, #expiry, #cvv').prop('required', isCard);
    });

    // Validation helper functions
    function showError(input, message) {
        const $input = $(input);
        $input.addClass('is-invalid').removeClass('is-valid');
        
        // Force display of error message
        let $feedback = $input.siblings('.invalid-feedback');
        if ($feedback.length === 0) {
            $feedback = $('<div class="invalid-feedback"></div>').insertAfter($input);
        }
        $feedback.text(message).show();
    }

    function clearError(input) {
        const $input = $(input);
        $input.removeClass('is-invalid').addClass('is-valid');
    }

    // Form submission handler
    form.on('submit', function(e) {
        e.preventDefault();
        let valid = true;

        // Validate full name
        const fullName = $('#fullName');
        if (fullName.val().trim().length < 3) {
            showError(fullName, 'Full name must be at least 3 characters');
            valid = false;
        } else clearError(fullName);

        // Validate email
        const email = $('#email');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.val().trim())) {
            showError(email, 'Please enter a valid email address');
            valid = false;
        } else clearError(email);

        // Validate phone
        const phone = $('#phone');
        if (!/^\d{10,}$/.test(phone.val().trim())) {
            showError(phone, 'Phone number must have at least 10 digits');
            valid = false;
        } else clearError(phone);

        // Validate address
        const address = $('#address');
        if (!address.val().trim()) {
            showError(address, 'Please enter your address');
            valid = false;
        } else clearError(address);

        // Validate city
        const city = $('#city');
        if (!city.val().trim()) {
            showError(city, 'Please enter your city');
            valid = false;
        } else clearError(city);

        // Validate postal code
        const postalCode = $('#postalCode');
        if (!/^\d{4,6}$/.test(postalCode.val().trim())) {
            showError(postalCode, 'Postal code must be 4-6 digits');
            valid = false;
        } else clearError(postalCode);

        // Validate country
        const country = $('#country');
        if (!country.val()) {
            showError(country, 'Please select your country');
            valid = false;
        } else clearError(country);

        // Validate card fields if card payment selected
        if ($('input[name="payment"]:checked').val() === 'card') {
            // Card number validation - only numbers, exactly 16 digits
            const cardNumber = $('#cardNumber');
            const cardVal = cardNumber.val().replace(/\D/g, ''); // Remove non-digits
            if (cardVal.length !== 16) {
                showError(cardNumber, 'Card number must be 16 digits');
                valid = false;
            } else clearError(cardNumber);

            // Expiry date validation - MM/YY format
            const expiry = $('#expiry');
            const expiryVal = expiry.val().trim();
            const expiryRegex = /^(0[1-9]|1[0-2])\/([2-9]\d)$/;
            if (!expiryRegex.test(expiryVal)) {
                showError(expiry, 'Use MM/YY format (e.g., 05/25)');
                valid = false;
            } else {
                // Check if date is not in past
                const [month, year] = expiryVal.split('/');
                const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
                if (expDate < new Date()) {
                    showError(expiry, 'Card has expired');
                    valid = false;
                } else clearError(expiry);
            }

            // CVV validation - 3 or 4 digits only
            const cvv = $('#cvv');
            const cvvVal = cvv.val().replace(/\D/g, '');
            if (cvvVal.length < 3 || cvvVal.length > 4) {
                showError(cvv, 'CVV must be 3-4 digits');
                valid = false;
            } else clearError(cvv);
        }

        // Validate terms checkbox
        const terms = $('#terms');
        if (!terms.is(':checked')) {
            showError(terms, 'You must agree to the terms and conditions');
            valid = false;
        } else clearError(terms);

        // Handle form submission
        if (!valid) {
            // Scroll to first error
            $('html, body').animate({
                scrollTop: $('.is-invalid').first().offset().top - 100
            }, 500);
        } else {
            // Redirect to thank you page
            window.location.href = 'thankyou.html';
        }
    });

    // Clear validation state on input
    form.find('input, select').on('input change', function() {
        $(this).removeClass('is-invalid is-valid');
    });

    // Add these event listeners for real-time formatting
    $('#cardNumber').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length > 16) value = value.substr(0, 16);
        $(this).val(value.replace(/(\d{4})/g, '$1 ').trim());
    });

    $('#expiry').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substr(0, 2) + '/' + value.substr(2, 2);
        }
        $(this).val(value);
    });

    $('#cvv').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length > 4) value = value.substr(0, 4);
        $(this).val(value);
    });

    // Add required CSS for error display
    $('<style>')
        .text(`
            .form-control.is-invalid,
            .form-check-input.is-invalid {
                border-color: #dc3545 !important;
            }
            .invalid-feedback {
                display: block !important;
                color: #dc3545;
                margin-top: 0.25rem;
            }
            #cardFields.invalid-card {
                border: 1px solid #dc3545;
                padding: 15px;
                border-radius: 5px;
            }
        `)
        .appendTo('head');
});