module.exports = function (RED) {
  "use strict";
  var translate = require("@vitalets/google-translate-api");
  var {HttpProxyAgent} = require('http-proxy-agent');

  function GoogleTranslateNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    const agent = new HttpProxyAgent('http://212.107.31.118:80');

    this.on("input", function (msg) {
      const conf = {
        from: config.from === "prog" ? msg.payload.from : config.from,
        to: config.from === "prog" ? msg.payload.to : config.to,
        fetchOptions: { agent }
      };

      const phrase = msg.payload?.phrase ?? msg.payload;

      translate.translate(phrase + "", conf)
        .then(function (res) {
          msg.payload = res.text;
          node.send(msg);
        })
        .catch(function (err) {
          node.error(err);
        });
    });
  }

  RED.nodes.registerType("google-translate", GoogleTranslateNode);
};
