// Path: Hai-ha/server.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const mqtt = require('mqtt');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const sql = require('mssql')
const moment = require('moment');
const config = require('./config');
const server = express();
server.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

server.use(bodyParser.json());

// server config
const port = 4000;

// sql config
const sql_config = {
    server_name: 'HHQT-TAS\\SQLEXPRESS',
    user: 'sa',
    password: 'sa2022',
    database: 'datahis'
}
const sql_table = {
    table_tank: 'tabletankhis',
    table_product: 'tableproducthis1',
    table_quangtriconfig: 'quangtriconfig'
}

// mqtt config
mqtt_host = config.mqtt_config.mqtt_url;
mqtt_port = config.mqtt_config.mqtt_port;
mqtt_topic = config.mqtt_config.mqtt_topic;
mqtt_client = mqtt.connect(`mqtt://${mqtt_host}:${mqtt_port}`);
mqtt_client.on('connect', () => {
    console.log('MQTT connected');
    mqtt_client.subscribe(mqtt_topic, (err) => {
        if (err) {
            console.log(err);
        }
    });
});

// mqtt disconnect
mqtt_client.on('disconnect', () => {
    console.log('MQTT disconnected');
});

// recieve message and send to ws
mqtt_client.on('message', (topic, message) => {
    console.log('MQTT message received');
    console.log(message.toString());
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message["tank_data"].toString());
        }
    });
});

// ws config
const wss = new WebSocket.Server({
    port: 8080
});
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
});
wss.on('connection', (ws) => {
    console.log('WS connected');
    ws.on('message', (message) => {
        console.log('WS message received');
        console.log(message);
        mqtt_client.publish('test', message);
    });
});

const publicPath = path.join(__dirname, 'public');
server.use(express.static(publicPath));

// login
server.get('/login', (req, res) => {
    res.sendFile(path.join(publicPath, 'pages', 'login.html'));
});

// auth
server.post('/auth', (req, res) => {
    const {
        username,
        password
    } = req.body;
    console.log(username, password);
    if (

        username === config.login_config.admin_usr &&
        password === config.login_config.admin_pwd
    ) {
        req.session.user = {
            username,
            password
        };
        req.session.role = 'admin';

        data = {
            'status': 200,
        }
        res.send(data);
    } else if (

        username === config.login_config.guest_usr &&
        password === config.login_config.guest_pwd) {
        req.session.user = {
            username,
            password
        };
        req.session.role = 'guest';

        data = {
            'status': 200,
        }
        res.send(data);

    } else {
        data = {
            'status': 401,
        }
        res.send(data);
    }
});

// logout
server.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// create function to check user is login or not
function checkLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// index
server.get('/', checkLogin, (req, res) => {
    res.sendFile(path.join(publicPath, 'pages', 'index.html'));
    console.log(req.session.role);

});

// config
server.get('/config', checkLogin, (req, res) => {
    data = {
        'status': 200,
        'data': config.page_settings
    }
    res.send(data);
});

// 
server.post('/get_max', checkLogin, (req, res) => {
    // assign tankid from "tankno" in request
    const tankid = req.body.tankno;
    // get data "SELECT maxh, maxv FROM tankdata WHERE tankid = " + tankid
    sql.connect(sql_config, (err) => {
        if (err) {
            console.log(err);
        }
        const request = new sql.Request();
        request.query(`SELECT maxh, maxv FROM tankdata WHERE tankid = ${tankid}`, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result.recordset);
            maxh = result.recordset[0].maxh;
            maxv = result.recordset[0].maxv;
            data = {
                'status': 'ok',
                'data': {
                    'maxh': maxh,
                    'maxv': maxv
                }
            }
            res.send(data);
        });
    });
});

server.post("/tank_history", checkLogin, (req, res) => {
    const {
        tankno,
        from_date,
        to_date
    } = req.body;
    console.log(tankno, from_date, to_date);
    sql.connect(sql_config, (err) => {
        if (err) {
            console.log(err);
        }
        const request = new sql.Request();
        request.query(`SELECT * FROM ${sql_table.table_tank} WHERE tankno = ${tankno} AND storedate >= '${from_date}' AND storedate <= '${to_date}' ORDER BY storedate DESC`, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result.recordset);
            // format "storedate" to "YYYY-MM-DD HH:mm:ss"
            for (i = 0; i < result.recordset.length; i++) {
                result.recordset[i].storedate = moment(result.recordset[i].storedate).format('YYYY-MM-DD HH:mm:ss');
            }
            data = {
                'status': 'ok',
                'data': result.recordset
            }
            res.send(data);
        });
    });
});

server.get('/history', checkLogin, (req, res) => {
    res.sendFile(path.join(publicPath, 'pages', 'history.html'));
});

server.post('/product_history', checkLogin, (req, res) => {
    const {
        idproduct,
        from_date,
        to_date
    } = req.body;
    console.log(idproduct, from_date, to_date);
    sql.connect(sql_config, (err) => {
        if (err) {
            console.log(err);
        }
        const request = new sql.Request();
        request.query(`SELECT * FROM ${sql_table.table_product} WHERE idproduct = ${idproduct} AND storedate >= '${from_date}' AND storedate <= '${to_date}' ORDER BY storedate DESC`, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result.recordset);
            // format "storedate" to "YYYY-MM-DD HH:mm:ss"
            for (i = 0; i < result.recordset.length; i++) {
                result.recordset[i].storedate = moment(result.recordset[i].storedate).format('YYYY-MM-DD HH:mm:ss');
            }
            data = {
                'status': 'ok',
                'data': result.recordset
            }
            res.send(data);
        });
    });
});

server.get('/configurations', checkLogin, (req, res) => {
    res.sendFile(path.join(publicPath, 'pages', 'configurations.html'));
});

server.get('/configurations/get', checkLogin, (req, res) => {
    sql.connect(sql_config, (err) => {
        if (err) {
            console.log(err);
        }
        const request = new sql.Request();
        request.query(`SELECT * FROM tankdata ORDER BY tankid`, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result.recordset);
            tank_data = [];
            for (i = 0; i < result.recordset.length; i++) {
                if (result.recordset[i].tankid) {
                    tank_data.push(result.recordset[i]);
                }
            }
            data = {
                'status': 'ok',
                'data': result.recordset
            }
            res.send(data);
        });
    });
});

server.post('/configurations/update', checkLogin, (req, res) => {
    const data = req.body;
    console.log(data);
    sql.connect(sql_config, (err) => {
        if (err) {
            console.log(err);
        }
        const request = new sql.Request();
        // UPDATE tankdata SET product = '{data['product']}', maxh = {data['maxh']}, maxv = {data['maxv']}, density = {data['density']} WHERE tankid = {data['tankid']}
        // update
        request.query(`UPDATE tankdata SET product = '${data['product']}', maxh = ${data['maxh']}, maxv = ${data['maxv']}, density = ${data['density']} WHERE tankid = ${data['tankid']}`, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result);
        });

    });
});


server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});