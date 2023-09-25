module.exports = {
  apps: [
    {
      name: 'dev',
      script: './dist/main.js',
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: 'local',
      },
    },
    {
      name: 'prod',
      script: './dist/main.js',
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
