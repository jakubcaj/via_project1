var SYMBOLS = [];

var SELECTED_SYMBOL = {};

$(document).ready(function () {
    // $.LoadingOverlay("show");
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(drawChart);
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
            debugger;
            $("#companyInput").autocomplete({
                source: SYMBOLS,
                select: function( event, ui ) {
                    SELECTED_SYMBOL = ui.item.value;
                }
            });
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
    $.ajax({
        type: "GET",
        url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+SELECTED_SYMBOL +"&interval=1min&apikey=FETPKH7UIPKWIKQS",
        dataType: "json",
        success: function (data) {
            debugger;
            var chartData = google.visualization.arrayToDataTable([
                ['Year', 'Sales', 'Expenses'],
                ['2004',  1000,      400],
                ['2005',  1170,      460],
                ['2006',  660,       1120],
                ['2007',  1030,      540]
            ]);

            var options = {
                title: 'Company Performance',
                curveType: 'function',
                legend: { position: 'bottom' }
            };

            var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

            chart.draw(chartData, options);
        }
    });
}