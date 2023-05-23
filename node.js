module.exports = function (RED) {
  "use strict";
  var translate = require("@vitalets/google-translate-api");

  function GoogleTranslateNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    this.on("input", function (msg) {
      const conf = {
        from: config.from === "prog" ? msg.payload.from : config.from,
        to: config.from === "prog" ? msg.payload.to : config.to,
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
