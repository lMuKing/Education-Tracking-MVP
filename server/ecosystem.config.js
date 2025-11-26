module.exports = {
  apps: [{
    name: 'edtrack-api',
    script: './src/server.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster', // Enable load balancing
    watch: false, // Set to true in development
    max_memory_restart: '500M', // Restart if memory exceeds 500MB
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Logging
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Advanced features
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    listen_timeout: 3000,
    kill_timeout: 5000,
    
    // Monitoring
    instance_var: 'INSTANCE_ID'
  }]
};
