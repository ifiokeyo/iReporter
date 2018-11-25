import bcrypt from 'bcrypt';


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The firstName field cannot be empty',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The lastName field cannot be empty',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, undefined]
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Invalid email address',
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The Phone number field cannot be empty',
        },
      },
    },
    registered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });
  User.beforeCreate(async (user, options) => {
    const salt = await bcrypt.genSalt();
    return user.password = bcrypt.hashSync(user.password, salt);
    }
  );
  User.associate = (models) => {
    // associations can be defined here
    User.hasMany(models.Incident, {
      foreignKey: 'createdBy',
      onDelete: 'CASCADE',
      hooks: true,
    });
  };
  User.isPassword = (encodedPassword, password) => {
    return bcrypt.compareSync(password, encodedPassword);
  }
  return User;
};