// example for how form works when submitted

$(function() {

    $(".form").submit(function(e) {
        e.preventDefault();
        $(this).parsley().validate();
        if ($(this).parsley().isValid()) {
          sendPaymentDataToAnet();
        }
    });

    $('#cancelBtn').on('click', function(e) {
        $('.form').parsley().reset();
    })

    function sendPaymentDataToAnet() {
        let secureData = {};
        let authData = {};
        let cardData = {};

        // Extract the card number, expiration date, and card code.

        let expiration = $('#expirationBox').val().split("/");
        cardData.cardNumber = $('#cardNumberBox').val();
        cardData.month = expiration[0];
        cardData.year = expiration[1];
        cardData.cardCode = $('#ccvBox').val();
        cardData.zip = $('#zipCodeBox').val();
        cardData.fullName = $('#firstNameBox').val() + ' ' + $('#lastNameBox').val();
        secureData.cardData = cardData;

        console.log('data', secureData);

        // The Authorize.Net Client Key is used in place of the traditional Transaction Key. The Transaction Key
        // is a shared secret and must never be exposed. The Client Key is a public key suitable for use where
        // someone outside the merchant might see it.
        authData.clientKey = "3sY2g2yz7Y6y4FBLyZz6Tn5zys34DERHfV8LKKeyhnw4MHLudHT5tj5KS98Mm3Nh";
        authData.apiLoginID = "6u6wJ6YW";
        secureData.authData = authData;

        // Pass the card number and expiration date to Accept.js for submission to Authorize.Net.
        Accept.dispatchData(secureData, responseHandler);

        // Process the response from Authorize.Net to retrieve the two elements of the payment nonce.
        // If the data looks correct, record the OpaqueData to the console and call the transaction processing function.
        function responseHandler(response) {
            if (response.messages.resultCode === "Error") {
                for (var i = 0; i < response.messages.message.length; i++) {
                    console.log(response.messages.message[i].code + ": " + response.messages.message[i].text);
                    $('.apiError').show();
                }
            } else {
                console.log(response.opaqueData.dataDescriptor);
                console.log(response.opaqueData.dataValue);
                //show success page is data is correct

                $('.form, .text, .divider,.errorMessage,.apiError').hide();
                $('.successMessage').show();
                // processTransaction(response.opaqueData);
            }
        }


        /* This is where you would insert whatever code necessary to
        cause the payment nonce to be posted to your server-side
        payment processing script or application, along with any
        non-payment information collected by your form. This
        example is in straight JavaScript, and creates a new form
        with hidden fields, then submits that form to post the data to
        the script. This example assumes you are posting data to a PHP
        script on your server called "paymentprocessor.php", and that
        the script expects parameters called "amount", "dataDesc",
        and "dataValue". Other methods could include using jQuery
        and AJAX to pass data to the transaction processing script
        or application, but have the browser remain on this page.

function processTransaction(responseData) {
    
    //create the form and attach to the document
    var transactionForm = document.createElement("form");
    transactionForm.Id = "transactionForm";
    transactionForm.action = "paymentprocessor.php";
    transactionForm.method = "POST";
    document.body.appendChild(transactionForm);

    //create form "input" elements corresponding to each parameter
    amount = document.createElement("input")
    amount.hidden = true;
    amount.value = document.getElementById('amount').value;
    amount.name = "amount";
    transactionForm.appendChild(amount);

    dataDesc = document.createElement("input")
    dataDesc.hidden = true;
    dataDesc.value = responseData.dataDescriptor;
    dataDesc.name = "dataDesc";
    transactionForm.appendChild(dataDesc);

    dataValue = document.createElement("input")
    dataValue.hidden = true;
    dataValue.value = responseData.dataValue;
    dataValue.name = "dataValue";
    transactionForm.appendChild(dataValue);

    //submit the new form
    transactionForm.submit();
}*/

    }
});
