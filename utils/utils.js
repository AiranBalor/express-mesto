/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
module.exports.function (err, res) {
  res.status(500).send({ message: err.message });
};
