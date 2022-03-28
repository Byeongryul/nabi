module.exports = function(sequelize, DataTypes) {
  return sequelize.define('File', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "N:1 possible",
      references: {
        model: 'User',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'File',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "File_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
