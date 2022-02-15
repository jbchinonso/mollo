const http = require("http");
const app = require("./app.js");

require("./db")();


const port = process.env.PORT || '3000'
app.set("port", port);


const server = http.createServer(app);
server.listen(port)
server.on('listening', onListening)


function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
}