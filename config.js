const config = {
    login_config: {
        guest_usr: 'haiha',
        guest_pwd: 'haiha@123',
        admin_usr: 'admin',
        admin_pwd: 'admin@123'
    },
    page_settings: {
        title: 'Tank Monitor',
        name: 'KHO XĂNG DẦU HẢI HÀ - QUẢNG TRỊ'
    },
    history_settings: {
        tank_number: 5
    },
    mqtt_config: {
        mqtt_url: 'localhost',
        mqtt_username: '',
        mqtt_password: '',
        mqtt_port: 1883,
        mqtt_topic: 'tank/data'
    },
    sql_config: {
        server: 'HHQT-TAS\\SQLEXPRESS',
        user: 'sa',
        password: 'sa2022',
        database: 'datahis',
        table_tank: 'tabletankhis',
        table_product: 'tableproducthis1',
        table_quangtriconfig: 'quangtriconfig'
    }
}

module.exports = config