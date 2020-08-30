const db = require('../../db')

const getDrivers = (req, res) => {
  let drivers = db.get('drivers').values();
  res.send(drivers);
};

module.exports = {
  getDrivers
};
