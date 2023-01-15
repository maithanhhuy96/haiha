function get_tank_data(){
    // get tank value from #tank option
    var tank = document.getElementById("tank").value;
    // tank_from_date: "YYYY-MM-DD HH:MM:SS"
    var tank_from_date = document.getElementById("tank_from_date").value.replace("T", " ");
    // tank_to_date: "YYYY-MM-DD HH:MM:SS"
    var tank_to_date = document.getElementById("tank_to_date").value.replace("T", " ");
    console.log("tank: " + tank);
    console.log("tank_from_date: " + tank_from_date);
    console.log("tank_to_date: " + tank_to_date);
    // check if 3 values are not empty
    if (tank != "" && tank_from_date != "" && tank_to_date != "") {

        // fetch
        fetch("/tank_history", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tankno: tank,
                from_date: tank_from_date,
                to_date: tank_to_date
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data = data.data;
            // update table-body: #tank-table
            var table_body = document.getElementById("tank-table");
            table_body.innerHTML = "";
            for (var i = 0; i < data.length; i++) {
                var row = data[i];
                var row_html = "<tr>";
                row_html += "<td class='text-center'>" + row["storedate"] + "</td>";
                row_html += "<td class='text-center'>" + row["tankno"] + "</td>";
                row_html += "<td class='text-center'>" + row["product"] + "</td>";
                row_html += "<td class='text-center'>" + row["level"] + "</td>";
                row_html += "<td class='text-center'>" + row["avgtemp"] + "</td>";
                row_html += "<td class='text-center'>" + row["density"] + "</td>";
                row_html += "<td class='text-center'>" + row["vcf"] + "</td>";
                row_html += "<td class='text-center'>" + row["grossvolume"] + "</td>";
                row_html += "<td class='text-center'>" + row["netvolume"] + "</td>";
                row_html += "<td class='text-center'>" + row["mass"] + "</td>";
                row_html += "</tr>";
                table_body.innerHTML += row_html;
            }
        }
        )
    }
    else {
        alert("Please fill all the fields");
    }
}

function get_product_data(){
    // get product value from #product option
    var product = document.getElementById("product").value;
    // product_from_date: "YYYY-MM-DD HH:MM:SS"
    var product_from_date = document.getElementById("product_from_date").value.replace("T", " ");
    // product_to_date: "YYYY-MM-DD HH:MM:SS"
    var product_to_date = document.getElementById("product_to_date").value.replace("T", " ");
    console.log("product: " + product);
    console.log("product_from_date: " + product_from_date);
    console.log("product_to_date: " + product_to_date);
    // check if 3 values are not empty
    if (product != "" && product_from_date != "" && product_to_date != "") {

        // fetch
        fetch("/product_history", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idproduct: product,
                from_date: product_from_date,
                to_date: product_to_date
            })
        })
        .then(response => response.json())
        .then(data => {
            // update table-body: #product-table
            var table_body = document.getElementById("product-table");
            table_body.innerHTML = "";
            data = data.data;
            for (var i = 0; i < data.length; i++) {
                var row = data[i];
                var row_html = "<tr>";
                row_html += "<td class='text-center'>" + row["storedate"] + "</td>";
                row_html += "<td class='text-center'>" + row["product"] + "</td>";
                row_html += "<td class='text-center'>" + row["totalgrossvolume"] + "</td>";
                row_html += "<td class='text-center'>" + row["totalnetvolume"] + "</td>";
                row_html += "<td class='text-center'>" + row["totalmass"] + "</td>";
                row_html += "</tr>";
                table_body.innerHTML += row_html;
            }
        }
        )
    }
    else {
        alert("Please fill all the fields");
    }
}

function export_tank_data(){
    // // export tank history in table #tank-table to csv
    // var table = document.getElementById("tanktable");
    // var csv = [];
    // for (var i = 0; i < table.rows.length; i++) {
    //     var row = [];
    //     for (var j = 0; j < table.rows[i].cells.length; j++) {
    //         row.push(table.rows[i].cells[j].innerText);
    //     }
    //     csv.push(row.join(","));
    // }
    // // Download CSV file

    // dowload excel file
    var table = document.getElementById("tanktable");
    var wb = XLSX.utils.table_to_book(table);
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    // saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'tank_history.xlsx');
    // dowload excel file don't use saveAs
    var blob = new Blob([s2ab(wbout)],{type:"application/octet-stream"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'tank_history.xlsx';
    link.click();



    
}

function export_product_data(){
    // export product history in table #product-table to csv
    var table = document.getElementById("producttable");
    var csv = [];
    for (var i = 0; i < table.rows.length; i++) {
        var row = [];
        for (var j = 0; j < table.rows[i].cells.length; j++) {
            row.push(table.rows[i].cells[j].innerText);
        }
        csv.push(row.join(","));
    }
    // Download CSV file
    downloadCSV(csv.join("\n"), 'product_history.csv');
}

// when page load
document.addEventListener('DOMContentLoaded', () => {
    // if role is admin then show #configuration_feature
    if (role == "admin"){
        document.getElementById("configuration_feature").style.display = "block";
    }
});