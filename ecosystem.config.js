module.exports = {
  apps: [{
    name: "radioznb",
    script: "bun",
    args: "start",
    cwd: ".",  // where your package.json and .next are
    interpreter: "none",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
      PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`,
      DATABASE_URL: process.env.DATABASE_URL,
      DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
    },
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: "1G",
  }]
};
