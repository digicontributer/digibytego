'use strict';

angular.module('copayApp.services').factory('digiidService', function($stateParams, bitcore, bwcService, profileService, walletService) {
  var utils = bwcService.getUtils();

  var root = {};

  root.MAGIC_BYTES = bitcore.deps.Buffer('DigiByte Signed Message:\n');

  root.magicHash = function magicHash(message) {
    var prefix1 = bitcore.encoding.BufferWriter.varintBufNum(this.MAGIC_BYTES.length);
    var messageBuffer = new bitcore.deps.Buffer(message);
    var prefix2 = bitcore.encoding.BufferWriter.varintBufNum(messageBuffer.length);
    var buf = bitcore.deps.Buffer.concat([prefix1, this.MAGIC_BYTES, prefix2, messageBuffer]);
    var hash = bitcore.crypto.Hash.sha256sha256(buf);
    return hash;
  };

  root._sign = function _sign(message, privateKey) {
    var hash = this.magicHash(message);
    var ecdsa = new bitcore.crypto.ECDSA();
    ecdsa.hashbuf = hash;
    ecdsa.privkey = privateKey;
    ecdsa.pubkey = privateKey.toPublicKey();
    ecdsa.signRandomK();
    ecdsa.calci();
    return ecdsa.sig;
  };

  root.sign = function sign(message, privateKey) {
    var signature = this._sign(message, privateKey);
    return signature.toCompact().toString('base64');
  };

  root.getRootAddress = function getAddresses(cb) {
    walletService.getMainAddresses(this.wallet, {}, function(err, addresses) {
      const address = addresses[0];
      return cb(null, address);
    });
  };

  root.signMessage = function signMessage(message, cb) {
    var self = this;
    this.wallet = profileService.getWallet(Object.keys(profileService.wallet).map(function(key) {
      return key
    })[0]);
    this.xpriv = profileService.profile.credentials[0].xPrivKey;
    this.getRootAddress(function(err, address) {
      if (err) {
        return cb(err);
      }
      var hdPrivateKey = bitcore.HDPrivateKey(root.xpriv);
      var xPrivKey = hdPrivateKey.deriveChild("m/44'/0'/0'/0");
      const privKey = xPrivKey.deriveChild(0).privateKey;
      var signature = self.sign(message, privKey);
      return cb(null, signature, address.address);
    })
  }

  return root;
});