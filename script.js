$(document).ready(function () {
  const FUNCTION_API_URL = "http://localhost:3000";
  const envAPI = "/qrcode";
  const generateBtn = $('#generateBtn');
  const inputNumber = $("#inputNumber");
  const qrCodeContainer = $("#qrCodeContainer");
  const downloadLinkContainer = $("#downloadLinkContainer");
  const generateForm = $("#generateForm");

  generateBtn.on('click', function () {
    const txt = inputNumber.val().trim();
    if (txt !== "") {
      const API = FUNCTION_API_URL + envAPI;
      const requestData = {
        text: txt
      };

      showLoadingIndicator();

      $.ajax({
        url: API,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function (data) {
          hideLoadingIndicator();
          console.log("Success:", data);
          const qrcode = data.qrcode;
          displayQRCodeImage(qrcode);
        },
        error: function (error) {
          hideLoadingIndicator();
          console.error("Error:", error);
          showError("An error occurred while generating QR Code.");
        }
      });
    }
  });

  function displayQRCodeImage(qrcode) {
    qrCodeContainer.html('<img width="400" style="display:block; margin:auto;padding-top:10px" src="' + qrcode + '" />');
    const downloadBtn = $('<button>').text('Download').on('click', function () {
      downloadImage(qrcode, "image.png");
    });
    const printBtn = $('<button>').text('Print').on('click', printImage);
    downloadLinkContainer.empty().append(downloadBtn).append(printBtn);
  }

  function showLoadingIndicator() {
    generateBtn.prop('disabled', true);
    generateBtn.text('Generating...');
  }

  function hideLoadingIndicator() {
    generateBtn.prop('disabled', false);
    generateBtn.text('Generate QR Code');
  }

  function showError(message) {
    qrCodeContainer.empty();
    downloadLinkContainer.empty();
    qrCodeContainer.text(message);
  }
});

function downloadImage(url, name) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(() => alert('An error occurred'));
}

function printImage() {
  const imageUrl = $('#qrCodeContainer img').attr('src');
  const popupWindow = window.open('', '_blank');
  popupWindow.document.open();
  popupWindow.document.write("<html><body onload='window.print()'><img src='" + imageUrl + "' /></body></html>");
  popupWindow.document.close();
}
