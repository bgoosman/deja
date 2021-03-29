const express = require("express");
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);
app.use(express.static("dist"));
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {});
io.on("connection", (socket) => {
  socket.on("image", (data) => {
    console.log(data.length);
  });
});

httpServer.listen(3000);
