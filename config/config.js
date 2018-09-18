module.exports = {
  db: {
    database: process.env.DB_NAME || "laptop",
    user: process.env.DB_USER || "laptop",
    password: process.env.DB_PASS || "laptop",
    options: {
      dialect: process.env.DIALECT || "sqlite",
      host: process.env.HOST || "localhost",
      storage: "./laptop.sqlite"
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || "secret"
  }
};
