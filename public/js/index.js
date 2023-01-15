
flag = false
var gauge1;
var overiew_data = [
    {
        "tankno":"1",
        "product":"Xăng RON92",
        "level":"123",
        "avgtemp":"22.1",
        "density":"0.1",
        "vcf":"0.3",
        "grossvolume":"123.4256",
        "netvolume":"123.4253",
        "mass":"124",
    },
    {
        "tankno":"2",
        "product":"Xăng RON92",
        "level":"123",
        "avgtemp":"22.1",
        "density":"0.1",
        "vcf":"0.3",
        "grossvolume":"123.4256",
        "netvolume":"123.4253",
        "mass":"124",
    },
    {
        "tankno":"3",
        "product":"Xăng RON95",
        "level":"123",
        "avgtemp":"22.1",
        "density":"0.1",
        "vcf":"0.3",
        "grossvolume":"123.4256",
        "netvolume":"123.4253",
        "mass":"124",
    },
    {
        "tankno":"4",
        "product":"index1",
        "level":"123",
        "avgtemp":"22.1",
        "density":"0.1",
        "vcf":"0.3",
        "grossvolume":"123.4256",
        "netvolume":"123.4253",
        "mass":"124",
    },
    {
        "tankno":"1",
        "product":"index1",
        "level":"123",
        "avgtemp":"22.1",
        "density":"0.1",
        "vcf":"0.3",
        "grossvolume":"123.4256",
        "netvolume":"123.4253",
        "mass":"124",
    },
]

var dropdown_index = 0;
var dropdown_maping_data = ["Xăng RON92", "Xăng RON95", "Dầu DO 0.05S", "Xăng E5 RON92"];
function change_option(value){
    // convert to int   
    dropdown_index = parseInt(value);
    update_total_value();
}
function update_data_table() {
    var table_body = document.getElementById("data-table");
    table_body.innerHTML = "";
    for (var i = 0; i < overiew_data.length; i++) {
        var row = table_body.insertRow(i);
        // add view_detail event
        row.onclick = function() {
            view_detail(this.rowIndex);
        }
        var tankno = row.insertCell(0);
        // add class
        tankno.className = "align-middle text-center text-sm";
        tankno.innerHTML = '<td class="align-middle text-center text-sm"><span class="text-secondary text-sm font-weight-bold">' + overiew_data[i].tankno + '</span></td>';
        var product = row.insertCell(1);
        product.className = "align-middle text-start text-sm";
        product.innerHTML = '<td class="align-middle text-start text-sm"><span class="text-secondary text-sm font-weight-bold">' + overiew_data[i].product + '</span></td>';
        var level = row.insertCell(2);
        level.className = "align-middle text-center text-end text-sm";
        level.innerHTML = '<td class="align-middle text-end text-sm"><span class="badge badge-sm bg-gradient-success">' + overiew_data[i].level + '</span></td>';
        var avgtemp = row.insertCell(3);
        avgtemp.className = "align-middle text-center text-end text-sm";
        // convert to float with 2 decimal places
        avgtemp.innerHTML = '<td class="align-middle text-end text-sm"><span class="text-secondary text-sm font-weight-bold">' + parseFloat(overiew_data[i].avgtemp).toFixed(2) + '</span></td>';
        var density = row.insertCell(4);
        density.className = "align-middle text-center text-end text-sm";
        // 1 decimal place
        density.innerHTML = '<td class="align-middle text-end text-sm"><span class="text-secondary text-sm font-weight-bold">' + parseFloat(overiew_data[i].density).toFixed(1) + '</span></td>';
        var vcf = row.insertCell(5);
		vcf.className = "align-middle text-center text-end text-sm";
        // 1 decimal place
        vcf.innerHTML = '<td class="align-middle text-end text-sm"><span class="text-secondary text-sm font-weight-bold">' + parseFloat(overiew_data[i].vcf).toFixed(4) + '</span></td>';
        
        var grossvolume = row.insertCell(6);
        grossvolume.className = "align-middle text-center text-end text-sm";
        // 3 decimal places
        grossvolume.innerHTML = '<td class="align-middle text-end text-sm"><span class="text-secondary text-sm font-weight-bold">' + parseFloat(overiew_data[i].grossvolume).toFixed(3) + '</span></td>';
        var netvolume = row.insertCell(7);
        netvolume.className = "align-middle text-center text-end text-sm";
        // 3 decimal places
        netvolume.innerHTML = '<td class="align-middle text-end text-sm"><span class="text-secondary text-sm font-weight-bold">' + parseFloat(overiew_data[i].netvolume).toFixed(3) + '</span></td>';
        var mass = row.insertCell(8);
        mass.className = "align-middle text-center text-end text-sm";
        // 3 decimal places
        mass.innerHTML = '<td class="align-middle text-end text-sm"><span class="text-secondary text-sm font-weight-bold">' + parseFloat(overiew_data[i].mass).toFixed(3) + '</span></td>';
    }
}

function update_total_value(){
    // grossvolume
    var grossvolume = 0;
    var netvolume = 0;
    var mass = 0;
    for (var i = 0; i < overiew_data.length; i++) {
        if (overiew_data[i].product == dropdown_maping_data[dropdown_index]) {
            {
                grossvolume += parseFloat(overiew_data[i].grossvolume);
                netvolume += parseFloat(overiew_data[i].netvolume);
                mass += parseFloat(overiew_data[i].mass);
            }
            }
    }
    let total_gross__volume = document.getElementById("total-gross-volume");
    total_gross__volume.innerHTML = grossvolume.toFixed(3);
    let total_net_volume = document.getElementById("total-net-volume");
    total_net_volume.innerHTML = netvolume.toFixed(3);
    let total_mass = document.getElementById("total-mass");
    total_mass.innerHTML = mass.toFixed(3);
}

function view_detail(row_index){
    $('#modal').modal('show');
	console.log(row_index);
    if (flag==false){
		setTimeout(function(){
        var config1 = liquidFillGaugeDefaultSettings();
        config1.circleColor = "#FF7777";
        config1.textColor = "#FF4444";
        config1.waveTextColor = "#FFAAAA";
        config1.waveColor = "#FFDDDD";
        config1.circleThickness = 0.2;
        config1.textVertPosition = 0.2;
        config1.waveAnimateTime = 1000;
        flag = true;
		},500);
    }
    // send fetch request to get detail data
    fetch('/get_max', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tankno: overiew_data[row_index-1].tankno
                })
            })
    .then(response => response.json())
    .then(data => {
        data = data.data;
        maxv = data.maxv;
        maxh = data.maxh;
        // put value to modal
        document.getElementById("maxhight").innerHTML = maxh;
        document.getElementById("maxvolume").innerHTML = maxv;
        var tankno = document.getElementById("tankno");
        tankno.innerHTML = "TANK "+overiew_data[row_index-1].tankno;
        var product = document.getElementById("product");
        product.innerHTML = overiew_data[row_index-1].product;
        var level = document.getElementById("level");
        level.innerHTML = overiew_data[row_index-1].level;
        var avgtemp = document.getElementById("avgtemp");
        avgtemp.innerHTML = overiew_data[row_index-1].avgtemp;
        var density = document.getElementById("density");
        density.innerHTML = overiew_data[row_index-1].density;
        var vcf = document.getElementById("vcf");
        vcf.innerHTML = overiew_data[row_index-1].vcf;
        var grossvolume = document.getElementById("grossvolume");
        grossvolume.innerHTML = overiew_data[row_index-1].grossvolume;
        var netvolume = document.getElementById("netvolume");
        netvolume.innerHTML = overiew_data[row_index-1].netvolume;
        var mass = document.getElementById("mass");
        mass.innerHTML = overiew_data[row_index-1].mass;

        
        level_text = level.innerHTML;
        percent = parseFloat(overiew_data[row_index-1].level)/19000*100;
        // round
        percent = Math.round(percent);
        gauge1.update(percent,level_text);
    });
    
    
}


document.addEventListener('DOMContentLoaded', () => {
    var server_address = 'http://' +document.domain + ':' +location.port;

    var socket = io.connect(server_address);

    socket.on('connect', () => {
        console.log("connect");
    }
    );

    socket.on('disconnect', () => {
        console.log("disconnect");
    }
    );

    socket.on('mqtt_message', (data) => {
        
        temp = JSON.parse(data);
        overiew_data = temp.tankdata;
        // update data
        update_data_table();
        // update table
        update_total_value();
    }
    );

});

// when page load
document.addEventListener('DOMContentLoaded', () => {
    // if role is admin then show #configuration_feature
    if (role == "admin"){
        document.getElementById("configuration_feature").style.display = "block";
    }
    gauge1 = loadLiquidFillGauge("fillgauge1", 0);
});