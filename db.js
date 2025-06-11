// backend/db.js
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// 1) Launch Sequelize pointing at a local SQLite file "bank.sqlite"
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, 'bank.sqlite'),
  logging: false,
});

// 2) Define User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('customer', 'banker'),
    allowNull: false,
    defaultValue: 'customer',
  },
  balance: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
}, {
  tableName: 'Users',
  timestamps: true,
});

// 3) Define Account model (transaction log)
const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
    onDelete: 'CASCADE',
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdrawal'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: { min: 0.01 },
  },
}, {
  tableName: 'Accounts',
  timestamps: true, // createdAt = transaction timestamp
});

// 4) Setup associations
User.hasMany(Account, { foreignKey: 'userId', as: 'transactions' });
Account.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 5) Initialize / Sync function
const initDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); 
    // (Optional) Seed a banker + a customer if none exist:
    const count = await User.count();
    if (count === 0) {
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      const bankerPwd = await bcrypt.hash('banker123', saltRounds);
      const customerPwd = await bcrypt.hash('customer123', saltRounds);

      await User.bulkCreate([
        { username: 'banker1', email: 'banker1@bank.com', passwordHash: bankerPwd, role: 'banker' },
        { username: 'customer1', email: 'customer1@bank.com', passwordHash: customerPwd, role: 'customer' },
      ]);
      console.log('Seeded initial users: banker1 / customer1');
    }
  } catch (err) {
    console.error('DB init error:', err);
    throw err;
  }
};

module.exports = {
  sequelize,
  User,
  Account,
  initDB,
};
