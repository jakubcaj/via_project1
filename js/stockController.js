var SYMBOLS = [];

var SELECTED_SYMBOL = {};

$(document).ready(function () {
    $.LoadingOverlay("show");
    google.charts.load('current', {packages: ['corechart']});
    initializeStockComponents();
});

function initializeStockComponents() {
    initializeSymbolsVariable();
}

function initializeSymbolsVariable() {
    $.ajax({
        type: "GET",
        url: "companyList.csv",
        dataType: "text",
        success: function (data) {
            addSymbolsToVariable(data);
            $("#companyInput").autocomplete({
                source: SYMBOLS,
                select: function (event, ui) {
                    SELECTED_SYMBOL = ui.item.value;
                }
            });
            $.LoadingOverlay("hide");
        }
    });
}

function addSymbolsToVariable(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length > 2) {
            var item = {};
            item.label = data[1].replace(new RegExp("\"", 'g'), "");
            item.value = data[0].replace(new RegExp("\"", 'g'), "");

            SYMBOLS.push(item);
        }
    }
}

function drawChart() {

    if(validateStockPage()) {
        $.LoadingOverlay("show");
        $.ajax({
            type: "GET",
            url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + SELECTED_SYMBOL + "&interval=1min&apikey=FETPKH7UIPKWIKQS",
            dataType: "json",
            success: function (data) {
                var dataArray = data["Time Series (1min)"];

                var result = [];
                result.push(['Time', 'value']);
                $.each(dataArray, function (key, value) {
                    var item = [key, parseInt(value["1. open"])];
                    result.push(item);
                });
                var chartData = google.visualization.arrayToDataTable(result);

                var options = {
                    title: 'Stock value',
                    curveType: 'function',
                    legend: {position: 'bottom'},
                    hAxis: {
                        direction:'-1'
                    }
                };

                var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

                chart.draw(chartData, options);
                $.LoadingOverlay("hide");
            }
        });
    }
}

function validateStockPage() {
    var company = $("#companyInput");

    company.css("border-color", "");

    var validated = true;

    if (isEmpty(company.val())) {
        validated = false;
        company.css("border-color", "red");
        toastr.error("Company field must not be empty");
    }

    return validated;
}

function isEmpty(value) {
    return value === null || value.length === 0 || value == "";
}