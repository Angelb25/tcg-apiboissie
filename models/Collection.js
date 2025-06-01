const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Collection = sequelize.define("Collection", {
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  }
}, {
  tableName: "Collections"
});

// Associations (sera relié à User et Card plus tard dans models/index.js)
module.exports = Collection;
