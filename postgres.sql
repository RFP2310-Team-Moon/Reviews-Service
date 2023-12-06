const { DataTypes } = require('sequelize');
const { sequelize } = require('./server/db.js');

const Review = sequelize.define('Review', {
  review_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.SMALLINT,
    allowNull: true,
  },
  summary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  body: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  recommended: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

/* Reported Boolean Per Review */
const Reported = sequelize.define('Reported', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reported: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
});

/* Helpful Count Per Review */
const Helpful = sequelize.define('Helpful', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  helpful: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

/* Photo URLs Per Review */
const Photo = sequelize.define('Photo', {
  photo_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  review_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  photo_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

/* Characteristic Rating (1-5) Per Review */
const Characteristic = sequelize.define('Characteristic', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  size: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  fit: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  length: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  width: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  comfort: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  quality: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
});

/* Total Star Counts & Average Characteristics Ratings Per Product */
const Meta = sequelize.define('Meta', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating_1: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating_2: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating_3: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating_4: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating_5: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recommended_t: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recommended_f: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  size_id: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  fit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  length_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  width_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comfort_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quality_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  size_avg: {
    type: DataTypes.DECIMAL(16, 10),
    allowNull: false,
  },
  fit_avg: {
    type: DataTypes.DECIMAL(16, 10),
    allowNull: false,
  },
  length_avg: {
    type: DataTypes.DECIMAL(16, 10),
    allowNull: false,
  },
  width_avg: {
    type: DataTypes.DECIMAL(16, 10),
    allowNull: false,
  },
  comfort_avg: {
    type: DataTypes.DECIMAL(16, 10),
    allowNull: false,
  },
  quality_avg: {
    type: DataTypes.DECIMAL(16, 10),
    allowNull: false,
  },

});
/*  */
Meta.hasMany(Review, { foreignKey: 'product_id' });
Review.belongsTo(Meta, { foreignKey: 'product_id' });

Review.hasOne(Reported, { foreignKey: 'review_id' });
Reported.belongsTo(Review, { foreignKey: 'review_id' });

Review.hasOne(Helpful, { foreignKey: 'review_id' });
Helpful.belongsTo(Review, { foreignKey: 'review_id' });

Review.hasOne(Characteristic,{ foreignKey: 'review_id' });
Characteristic.belongsTo(Review, { foreignKey: 'review_id' });

Review.hasMany(Photo,{ foreignKey: 'review_id' });
Photo.belongsTo(Review, { foreignKey: 'review_id' });

module.exports = { Review, Reported, Helpful, Characteristic, Photo, Meta };