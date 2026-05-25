{
  "apps": [
    {
      "name": "tutoring-backend",
      "script": "app.js",
      "instances": "max",
      "exec_mode": "cluster",
      "watch": true,
      "ignore_watch": ["node_modules", "logs"],
      "env": {
        "NODE_ENV": "development"
      },
      "env_production": {
        "NODE_ENV": "production"
      }
    }
  ]
}
