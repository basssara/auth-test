const detectTSNode = require('detect-ts-node')

const commonConfig = {
  type: 'mssql',
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USERNAME),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_DATABASE),
  synchronize: true,
  logging: false,
  options: {
    encrypt: false,
    enableArithAbort: false,
  },
}

const srcConfig = {
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
}

const distConfig = {
  entities: [__dirname + '/dist/entity/**/*.js'],
  migrations: [__dirname + '/dist/migration/**/*.js'],
  subscribers: [__dirname + '/dist/subscriber/**/*.js'],
  cli: {
    entitiesDir: __dirname + '/dist/entity',
    migrationsDir: __dirname + '/dist/migration',
    subscribersDir: __dirname + '/dist/subscriber',
  },
}

const result = {}
let key

// Append common configs to final object
for (key in commonConfig) {
  if (commonConfig.hasOwnProperty(key)) {
    result[key] = commonConfig[key]
  }
}

if (detectTSNode) {
  // if ts-node append src configuration
  for (key in srcConfig) {
    if (srcConfig.hasOwnProperty(key)) {
      result[key] = srcConfig[key]
    }
  }
} else {
  // else append dist configuration
  for (key in distConfig) {
    if (distConfig.hasOwnProperty(key)) {
      result[key] = distConfig[key]
    }
  }
}

module.exports = result
