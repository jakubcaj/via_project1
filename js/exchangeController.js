var CURRENCY = [];
var CURR_FROM = {};
var CURR_TO = {};

$(document).ready(function () {
    $.LoadingOverlay("show");
    initializeExchangeComponents();
});

function initializeExchangeComponents() {
    initializeCurrencySelect();
}

function initializeCurrencySelect() {

    $.ajax({
        type: "GET",
        url: "https://www.alphavantage.co/physical_currency_list/",
        dataType: "text",
        success: function (data) {
            addOptionsToSelect(data);
            $("#currencyInput").autocomplete({
                source: CURRENCY,
                select: function( event, ui ) {
                    CURR_FROM = ui.item.value;
                }
            });
            $("#currencyInputTo").autocomplete({
                source: CURRENCY,
                select: function( event, ui ) {
                    CURR_TO = ui.item.value;
                }
            });
            $.LoadingOverlay("hide");
        }
    });
}

function addOptionsToSelect(allText) {

    var allTextLines = allText.split(/\r\n|\n/);
    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');

        var item = {};
        item.label = data[1];
        item.value = data[0];

        CURRENCY.push(item);
    }
}

function generateTable() {
    var table = document.getElementById("exchangeTable");

    if (CURR_FROM !== CURR_TO) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "GET",
            url: "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=" + CURR_FROM + "&to_currency=" + CURR_TO + "&apikey=FETPKH7UIPKWIKQS",
            dataType: "json",
            success: function (data) {
                var temp = data["Realtime Currency Exchange Rate"];
                var tr = document.createElement("tr");
                var from = document.createElement("td");
                from.innerHTML = CURR_FROM;
                var to = document.createElement("td");
                to.innerHTML = CURR_TO;
                var rate = document.createElement("td");
                rate.innerHTML = temp["5. Exchange Rate"];

                tr.appendChild(from);
                tr.appendChild(to);
                tr.appendChild(rate);

                table.appendChild(tr);
                $.LoadingOverlay("hide");
            }
        });

    }
}

function switchInputs() {
    var from = $("#currencyInput");
    var to = $("#currencyInputTo");

    from.val(CURR_TO);
    to.val(CURR_FROM);

    var temp = CURR_TO;
    CURR_TO = CURR_FROM;
    CURR_FROM = temp;

}