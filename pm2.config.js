module.exports = {
  apps: [
    {
      name: 'gateway',
      script: 'dist/apps/gateway/main.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        port: 3000,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'business',
      script: 'dist/apps/business/main.js',
      exec_mode: 'cluster',
      env: {
        port: 3002,
        NODE_ENV: 'production',
      },
    },
  ],
};
