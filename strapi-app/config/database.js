module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DATABASE_HOST', 'db'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'yugiohdb'),
        username: env('DATABASE_USERNAME', 'yugiohuser'),
        password: env('DATABASE_PASSWORD', 'yugiohpass'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {}
    },
  },
});
