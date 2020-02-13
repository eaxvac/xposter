main();

function main() {
    //test
    //$('#div_modelNodeInfo').modal('show');
}

/**
 * Randomizes metadata of the chart
 * Avoids mass deletion
 */
function randomizeMetaDatas() {
    var priceObj = document.getElementById('price');
    var descObj = document.getElementById('description');
    var tickerObj = document.getElementById('ticker');
    var priceChangeObj = document.getElementById('percChange');
    var exchangeObj = document.getElementById('exchange');
    var timeframeObj = document.getElementById('timeframe');
    var symbolObj = document.getElementById('symbol');

    // Random price
    priceObj.value = Math.floor(Math.random() * 30000);

    // Random desc
    // Random ticker
    var possiblePairName = ["Bitcoin", "Dollar", "Euro", "Chinese Yuan", "Japanese Yen", "Monero", "Litecoin", "Ethereum", "Ethereum Classic", "Bitcoin Cash", "SONM", "DOGE", "Aeon", "Omni", "Counterparty", "Ripple", "Lisk", "eBoost", "Genosis", "Edgeless"];
    var possiblePairTicker = ["BTC", "USD", "EUR", "CNH", "JPY", "XMR", "LTC", "ETH", "ETC", "BCH", "SNM", "DOGE", "AEON", "OMNI", "XCP", "XRP", "LSK", "EBST", "GNO", "EDG"];

    var selectPair1 = -1, selectPair2 = -1;
    while (selectPair1 == -1 || selectPair2 == -1 || (selectPair1 == selectPair2)) {
        selectPair1 = Math.floor(Math.random() * possiblePairName.length);
        selectPair2 = Math.floor(Math.random() * possiblePairName.length);
    }
    descObj.value = possiblePairName[selectPair1] + " / " + possiblePairName[selectPair2];
    tickerObj.value = possiblePairTicker[selectPair1] + possiblePairTicker[selectPair2];

    // Random Price change
    priceChangeObj.value = -99 + Math.floor(Math.random() * 199);

    // Random exchange
    var possibleExchanges = ["Bitfinex", "Bitstamp", "Kraken", "Binance", "Coinbase", "FXCM", "SP", "Bitmex", "Oanda", "TVC", "Bitflyer", "MTGox"];
    exchangeObj.value = possibleExchanges[Math.floor(Math.random() * possibleExchanges.length)].toUpperCase();

    // Random timeframe
    timeframeObj.value = Math.floor(Math.random() * 720);

    // Random symbol
}

/**
 * Drag and drop image
 * @param {any} ev
 */
function dropHandler(ev) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);

                var reader = new FileReader();
                reader.onload = function (event) {
                    var image = event.target.result;

                    processPasteOrDraggedImage(image);
                }; // data url!
                reader.readAsDataURL(file);
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
    }

    // Pass event to removeDragData for cleanup
    removeDragData(ev)
}
function dragOverHandler(ev) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}
function removeDragData(ev) {
    console.log('Removing drag data');

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to remove the drag data
        ev.dataTransfer.items.clear();
    } else {
        // Use DataTransfer interface to remove the drag data
        ev.dataTransfer.clearData();
    }
}

/*
Paste image from clipboard
*/
document.onpaste = function (event) {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    //console.log(JSON.stringify(items)); // will give you the mime types

    for (index in items) {
        var item = items[index];
        if (item.kind === 'file') {
            var blob = item.getAsFile();
            var reader = new FileReader();
            reader.onload = function (event) {
                var image = event.target.result;

                processPasteOrDraggedImage(image);
            }; // data url!
            reader.readAsDataURL(blob);
        }
    }
}

/**
 * Process an image to post
 * @param {any} image
 */
function processPasteOrDraggedImage(image) {
    console.log(image)

    if (image.startsWith("data:image/png;base64") || image.startsWith("data:image/jpeg;base64")) {
        // Gets the base64 image dimension
        var i = new Image()
        i.onload = function () {
            createPostObject(image, i.width, i.height);
        };
        i.src = image;
    }
}

/**
 * On select image
 */
function validateSelectedFile() {
    var fileInput = document.getElementById("myImageInput");
    var fileName = fileInput.value;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();

    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
        var files = fileInput.files[0];

        // Gets the base64 of the image
        var reader = new FileReader();
        reader.readAsDataURL(files);
        reader.onload = function () {
            var img = new Image();
            img.onload = function () {
                createPostObject(reader.result, img.width, img.height);
            };
            img.src = reader.result;
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    } else if (extFile != null && extFile != "") {
        alert("Only jpg/jpeg and png files are possible :(");
    }
}

function createPostObject(imgbase64, width, height) {
    document.getElementById("input_url").value = ""; // Reset 
    $('#div_modelNodeInfo').modal('show'); // show uploading menu


    var basePostContent = document.getElementById("postContentHidev3").innerHTML;

    // Replace image
    basePostContent = basePostContent.replace("---POSTIMAGE---", imgbase64);

    // Replace width
    // replace height
    for (var i = 0; i < 5; i++) {
        basePostContent = basePostContent.replace("---POSTIMAGEWIDTH---", width);
        basePostContent = basePostContent.replace("---POSTIMAGEHEIGHT---", height);
    }

    // Replace Symbol
    for (var i = 0; i < 5; i++) {
        basePostContent = basePostContent.replace("---SYMBOL---", document.getElementById('symbol').value);
    }

    // Replace Timeframe
    for (var i = 0; i < 5; i++) {
        basePostContent = basePostContent.replace("---TIMEFRAME---", document.getElementById('timeframe').value);
    }

    // Replace Exchange
    for (var i = 0; i < 5; i++) {
        basePostContent = basePostContent.replace("---EXCHANGE---", document.getElementById('exchange').value);
    }

    // Replace percentage change
    for (var i = 0; i < 5; i++) {
        basePostContent = basePostContent.replace("---PERCCHANGE---", document.getElementById('percChange').value);
    }

    // Replace ticker
    for (var i = 0; i < 5; i++) {
        basePostContent = basePostContent.replace("---TICKER---", document.getElementById('ticker').value);
    }

    // Replace desc
    for (var i = 0; i < 5; i++) {
        basePostContent = basePostContent.replace("---DESC---", document.getElementById('description').value);
    }

    // Replace price
    for (var i = 0; i < 10; i++) {
        basePostContent = basePostContent.replace("---PRICE---", document.getElementById('price').value);
    }

    // Replace text color
    basePostContent = basePostContent.replace("---TEXTCOLOR---", document.getElementById('textColor').value);

    // Replace BG color
    basePostContent = basePostContent.replace("---BGCOLOR---", document.getElementById('bgColor').value);

    // Replace Scale color
    basePostContent = basePostContent.replace("---SCALECOLOR---", document.getElementById('scaleColor').value);

    // Replace boundary
   /* var boundary = generateRandomText(16);
    for (var i = 0; i < 3; i++) {
        basePostContent = basePostContent.replace("---POSTBOUNDARY---", boundary);
    }*/
    console.log(basePostContent);

    // Set image
    document.getElementById("fileUploadFormImage").value = JSON.stringify(JSON.parse(basePostContent));

    var form = $('#fileUploadForm')[0];
    var data = new FormData(form);

    console.log(data);

    $.ajax({
        type: "POST",
        url: Base64Decode("aHR0cHM6Ly93d3cudHJhZGluZ3ZpZXcuY29tL3NuYXBzaG90Lw=="),
        enctype: 'multipart/form-data',
        processData: false,  // Important!
        contentType: false,
        cache: false,
        data: data,

        success: function (result) {
           // alert(result);
           // window.open("https://tradingview.com/x/" + result, '_blank');

            //window.location.href = Base64Decode("aHR0cHM6Ly90cmFkaW5ndmlldy5jb20veC8=") + result;
            document.getElementById("input_url").value = Base64Decode("aHR0cHM6Ly90cmFkaW5ndmlldy5jb20veC8=") + result;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Error posting image. " + XMLHttpRequest.statusText + " " + textStatus + " " + errorThrown);
        }
    });

    /*$.ajax({
        type: "POST",
        url: Base64Decode("aHR0cHM6Ly93d3cudHJhZGluZ3ZpZXcuY29tL3NuYXBzaG90Lw=="),
        crossDomain: true,
        data: basePostContent,
        processData: false,
        cache: false,
        contentType: "multipart/form-data; boundary=----WebKitFormBoundary" + boundary,
        beforeSend: function (jqXHR) {
            jqXHR.setRequestHeader('Accept-Encoding', 'gzip, deflate, br');
            jqXHR.setRequestHeader('Accept-Language', 'en-US,en;q=0.9');
        },
        headers: {
            'Accept': '* /*',
            'Referer': Base64Decode("aHR0cHM6Ly90cmFkaW5ndmlldy5jb20veC8=")
        },

        success: function (result) {
            alert(result.success);
        }
    });*/
}

function addRandomMetadata() {
    randomizeMetaDatas();
}

function clearAllText() {
    var priceObj = document.getElementById('price');
    var descObj = document.getElementById('description');
    var tickerObj = document.getElementById('ticker');
    var priceChangeObj = document.getElementById('percChange');
    var exchangeObj = document.getElementById('exchange');
    var timeframeObj = document.getElementById('timeframe');
    var symbolObj = document.getElementById('symbol');

    priceObj.value = "";
    descObj.value = "";
    tickerObj.value = "";
    priceChangeObj.value = "";
    exchangeObj.value = "";
    timeframeObj.value = "";
    symbolObj.value = "";
}


//////////////////////////////// UTILS
function Base64Encode(str, encoding = 'utf-8') {
    var bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str);
    return base64js.fromByteArray(bytes);
}

function Base64Decode(str, encoding = 'utf-8') {
    var bytes = base64js.toByteArray(str);
    return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes);
}

function generateRandomText(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}