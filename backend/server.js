const express = require("express");

const server = express();

server.listen(3600, function () {
  console.log("Server running on port 3600");
});
