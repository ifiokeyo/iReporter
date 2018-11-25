require('dotenv').config();

module.exports = {
  development: {
    username: 'andeladeveloper',
    password: null,
    database: 'ireport',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    operatorsAliases: false
  },
  'test': {
    username: 'andeladeveloper',
    password: null,
    database: 'ireport_test',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    operatorsAliases: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    operatorsAliases: false,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  },
  travis: {
    use_env_variable: 'DATABASE_URL',
  },
}
