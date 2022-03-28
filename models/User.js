module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "User_email_key"
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'User',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "User_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "User_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
