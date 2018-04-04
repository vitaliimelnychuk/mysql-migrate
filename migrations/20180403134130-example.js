const PerconaHelper = require("../src/percona-helper");

exports.up = function (db) {
  const percona = new PerconaHelper(db.connection.config);
  percona.run("pet", "alter", "add column tt int(11)")

  return null;
};

exports.down = function (db) {
  const percona = new PerconaHelper(db.connection.config);
  percona.run("pet", "alter", "drop column tt")
  return null;
};

exports._meta = {
  "version": 1
};
