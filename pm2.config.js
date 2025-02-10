module.exports = {
  apps: [
    {
      name: 'gateway',
      script: 'dist/apps/gateway/main.js',
    },
    {
      name: 'business',
      script: 'dist/apps/business/main.js',
    },
  ],
};
