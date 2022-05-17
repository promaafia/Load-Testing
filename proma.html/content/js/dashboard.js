/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 95.91836734693878, "KoPercent": 4.081632653061225};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "http://159.89.38.11/login-9"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/login-8"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/login-5"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/login-4"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/login-7"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/login-6"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/login-1"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/login-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/login-3"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/login-2"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/login/submit"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "http://159.89.38.11/chart/data"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-12"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-13"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-10"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/login-21"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/login-20"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-18"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-19"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-16"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-17"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-14"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-15"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/login"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/login-19"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/login-16"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/login-15"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/login-18"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/login-17"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/login-12"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/login-11"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/login-14"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-21"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/login-13"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-22"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-20"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/login-10"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-7"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-8"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-9"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-4"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 49, 2, 4.081632653061225, 764.65306122449, 82, 6785, 316.0, 1693.0, 3450.0, 6785.0, 1.2178148921363954, 69.37418838229446, 2.084017771709415], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://159.89.38.11/login-9", 1, 0, 0.0, 1072.0, 1072, 1072, 1072.0, 1072.0, 1072.0, 1072.0, 0.9328358208955224, 47.62381937966418, 1.6251749067164178], "isController": false}, {"data": ["http://159.89.38.11/login-8", 1, 0, 0.0, 5074.0, 5074, 5074, 5074.0, 5074.0, 5074.0, 5074.0, 0.19708316909735907, 100.20813060455262, 0.3593303483445014], "isController": false}, {"data": ["http://159.89.38.11/login-5", 1, 0, 0.0, 1693.0, 1693, 1693, 1693.0, 1693.0, 1693.0, 1693.0, 0.5906674542232723, 70.30615493945659, 0.24053547696396926], "isController": false}, {"data": ["http://159.89.38.11/login-4", 1, 0, 0.0, 765.0, 765, 765, 765.0, 765.0, 765.0, 765.0, 1.3071895424836601, 3.638174019607843, 1.2203839869281046], "isController": false}, {"data": ["http://159.89.38.11/login-7", 1, 0, 0.0, 821.0, 821, 821, 821.0, 821.0, 821.0, 821.0, 1.2180267965895248, 28.395249695493302, 0.5007707825822169], "isController": false}, {"data": ["http://159.89.38.11/login-6", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 76.88166920731707, 1.9912347560975612], "isController": false}, {"data": ["http://159.89.38.11/login-1", 1, 0, 0.0, 767.0, 767, 767, 767.0, 767.0, 767.0, 767.0, 1.303780964797914, 7.226817144719687, 1.1777318285528031], "isController": false}, {"data": ["http://159.89.38.11/login-0", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 11.776283914728682, 0.5632267441860465], "isController": false}, {"data": ["http://159.89.38.11/login-3", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 52.82373366013072, 2.964792687908497], "isController": false}, {"data": ["http://159.89.38.11/login-2", 1, 0, 0.0, 1392.0, 1392, 1392, 1392.0, 1392.0, 1392.0, 1392.0, 0.7183908045977011, 23.903331537356323, 0.6650727370689655], "isController": false}, {"data": ["http://159.89.38.11/login/submit", 1, 1, 100.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 1.606416420118343, 2.935465976331361], "isController": false}, {"data": ["Test", 1, 1, 100.0, 9287.0, 9287, 9287, 9287.0, 9287.0, 9287.0, 9287.0, 0.10767739851405189, 150.3403615268655, 4.619086996608162], "isController": true}, {"data": ["http://159.89.38.11/chart/data", 1, 1, 100.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 1.5948594674556211, 2.8112287352071004], "isController": false}, {"data": ["http://159.89.38.11/-12", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 0.4429408482142857, 3.571428571428571], "isController": false}, {"data": ["http://159.89.38.11/-13", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 0.428734756097561, 3.433280705574913], "isController": false}, {"data": ["http://159.89.38.11/-10", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 0.43174342105263164, 3.4470942982456143], "isController": false}, {"data": ["http://159.89.38.11/-11", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 0.4378892348754448, 3.52049043594306], "isController": false}, {"data": ["http://159.89.38.11/login-21", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 25.02919261565836, 3.193811165480427], "isController": false}, {"data": ["http://159.89.38.11/login-20", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 14.78646753533569, 3.185043065371025], "isController": false}, {"data": ["http://159.89.38.11/", 1, 0, 0.0, 1826.0, 1826, 1826, 1826.0, 1826.0, 1826.0, 1826.0, 0.547645125958379, 6.926320338170865, 11.593069722070098], "isController": false}, {"data": ["http://159.89.38.11/-18", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 0.41899809966216217, 3.3981735641891895], "isController": false}, {"data": ["http://159.89.38.11/-19", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 0.41569890202702703, 3.322292018581081], "isController": false}, {"data": ["http://159.89.38.11/-16", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 0.44261465827338126, 3.670891411870503], "isController": false}, {"data": ["http://159.89.38.11/-17", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 0.43479461130742053, 3.578428666077739], "isController": false}, {"data": ["http://159.89.38.11/-14", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 0.4321374128919861, 3.453696646341464], "isController": false}, {"data": ["http://159.89.38.11/-15", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 0.45934606481481477, 3.761574074074074], "isController": false}, {"data": ["http://159.89.38.11/login", 1, 0, 0.0, 6785.0, 6785, 6785, 6785.0, 6785.0, 6785.0, 6785.0, 0.14738393515106854, 203.755555683493, 2.9161581153279292], "isController": false}, {"data": ["http://159.89.38.11/login-19", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 86.03792664007094, 1.6120207225177305], "isController": false}, {"data": ["http://159.89.38.11/login-16", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 82.63821072048611, 3.2280815972222223], "isController": false}, {"data": ["http://159.89.38.11/login-15", 1, 0, 0.0, 826.0, 826, 826, 826.0, 826.0, 826.0, 826.0, 1.2106537530266344, 21.94191699455206, 1.1349878934624698], "isController": false}, {"data": ["http://159.89.38.11/login-18", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 68.68039035467129, 3.1155384948096887], "isController": false}, {"data": ["http://159.89.38.11/login-17", 1, 0, 0.0, 1133.0, 1133, 1133, 1133.0, 1133.0, 1133.0, 1133.0, 0.88261253309797, 72.77416151809355, 0.8136584289496911], "isController": false}, {"data": ["http://159.89.38.11/login-12", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 68.88977635782747, 1.4414436900958467], "isController": false}, {"data": ["http://159.89.38.11/login-11", 1, 0, 0.0, 1730.0, 1730, 1730, 1730.0, 1730.0, 1730.0, 1730.0, 0.5780346820809249, 49.90855310693642, 0.5294888005780347], "isController": false}, {"data": ["http://159.89.38.11/login-14", 1, 0, 0.0, 1124.0, 1124, 1124, 1124.0, 1124.0, 1124.0, 1124.0, 0.889679715302491, 68.55399243772241, 0.8288617660142348], "isController": false}, {"data": ["http://159.89.38.11/-21", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 0.4521122685185185, 3.642216435185185], "isController": false}, {"data": ["http://159.89.38.11/login-13", 1, 0, 0.0, 1196.0, 1196, 1196, 1196.0, 1196.0, 1196.0, 1196.0, 0.8361204013377926, 123.46738477215719, 0.7585506375418061], "isController": false}, {"data": ["http://159.89.38.11/-22", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 0.44907618613138683, 3.5783531021897805], "isController": false}, {"data": ["http://159.89.38.11/-20", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 0.41152801003344486, 3.3183528428093645], "isController": false}, {"data": ["http://159.89.38.11/login-10", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 67.1339158887987, 1.4711850649350648], "isController": false}, {"data": ["http://159.89.38.11/-5", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.3290304919137466, 2.737533692722372], "isController": false}, {"data": ["http://159.89.38.11/-6", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 3.8288985148514847, 4.8344678217821775], "isController": false}, {"data": ["http://159.89.38.11/-7", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 7.857711226851852, 4.539207175925926], "isController": false}, {"data": ["http://159.89.38.11/-8", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 4.704173018292683, 5.990377286585366], "isController": false}, {"data": ["http://159.89.38.11/-9", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.22147042410714285, 1.780482700892857], "isController": false}, {"data": ["http://159.89.38.11/-0", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 3.3652181440443214, 2.434643351800554], "isController": false}, {"data": ["http://159.89.38.11/-1", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 23.879716981132074, 2.7669270833333335], "isController": false}, {"data": ["http://159.89.38.11/-2", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 0.44102822580645157, 3.5352262544802864], "isController": false}, {"data": ["http://159.89.38.11/-3", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 0.406095297029703, 3.3293368399339935], "isController": false}, {"data": ["http://159.89.38.11/-4", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 0.38938884493670883, 3.1336530854430378], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["419/unknown status", 2, 100.0, 4.081632653061225], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 49, 2, "419/unknown status", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://159.89.38.11/login/submit", 1, 1, "419/unknown status", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["http://159.89.38.11/chart/data", 1, 1, "419/unknown status", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
