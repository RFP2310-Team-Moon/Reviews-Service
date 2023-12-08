require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    sync: true,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await sequelize.sync();
    // await sequelize.sync({ force: true });
    console.log("DB schema synced");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
}

testConnection();

module.exports = { sequelize };
