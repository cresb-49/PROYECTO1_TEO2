import {Sequelize} from 'sequelize';

const sequelize = new Sequelize(
    'p1teo2',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql'
    }    
);

export default sequelize;