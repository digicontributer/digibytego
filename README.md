## DigiByteGo

## Main Features

- Multiple wallet creation and management in-app
- Intuitive, multisignature security for personal or shared wallets
- Easy spending proposal flow for shared wallets and group payments
- [BIP32](https://github.com/digibyte/bips/blob/master/bip-0032.mediawiki) Hierarchical deterministic (HD) address generation and wallet backups
- Device-based security: all private keys are stored locally, not in the cloud
- Support for DigiByte testnet wallets
- Synchronous access across all major mobile and desktop platforms
- Payment protocol (BIP70-BIP73) support: easily-identifiable payment requests and verifiable, secure digibyte payments
- Support for over 150 currency pricing options and unit denomination in DGB or bits
- Mnemonic (BIP39) support for wallet backups
- Paper wallet sweep support (BIP38)
- Hardware wallet support (Trezor and Ledger) (only in Chrome App version)
- Email notifications for payments and transfers
- Push notifications (only available for ios and android versions)
- Customizable wallet naming and background colors
- Multiple languages supported

## Testing in a Browser

> **Note:** This method should only be used for development purposes. When running DigiByteGo in a normal browser environment, browser extensions and other malicious code might have access to internal data and private keys. 

Clone the repo and open the directory:

```sh
git clone https://github.com/DigiByte Foundation/digibytego.git
cd digibytego
```

Ensure you have [Node](https://nodejs.org/) installed, then install and start DigiByteGo:

```sh
npm run apply:digibytego
npm start
```

Visit [`localhost:8100`](http://localhost:8100/) to view the app.

A watch task is also available to rebuild components of the app as changes are made. This task can be run in a separate process – while the server started by `npm start` is running – to quickly test changes.

```
npm run watch
```

## Testing on Real Devices

It's recommended that all final testing be done on a real device – both to assess performance and to enable features that are unavailable to the emulator (e.g. a device camera).

### Android

Follow the [Cordova Android Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/) to set up your development environment.

When your developement enviroment is ready, run the `start:android` npm package script.

```sh
npm run apply:digibytego
npm run start:android
```

### iOS

Follow the [Cordova iOS Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/) to set up your development environment.

When your developement enviroment is ready, run the `start:ios` npm package script.

```sh
npm run apply:digibytego
npm run start:ios
```

### Desktop (Linux, macOS, and Windows)

The desktop version of DigiByteGo currently uses NW.js, an app runtime based on Chromium. To get started, first install NW.js on your system from [the NW.js website](https://nwjs.io/).

When NW.js is installed, run the `start:desktop` npm package script.

```sh
npm run apply:digibytego
npm run start:desktop
```

## Build DigiByteGo App Bundles

Before building the release version for a platform, run the `clean-all` command to delete any untracked files in your current working directory. (Be sure to stash any uncommited changes you've made.) This guarantees consistency across builds for the current state of this repository.

The `final` commands build the production version of the app, and bundle it with the release version of the platform being built.

### Android

```sh
npm run clean-all
npm run apply:digibytego
npm run final:android
```

### iOS

```sh
npm run clean-all
npm run apply:digibytego
npm run final:ios
```

### Windows Phone

- Install Visual Studio 2013 (or newer)
- Run `make wp8-prod`

### Desktop (Linux, macOS, and Windows)

```sh
npm run clean-all
npm run apply:digibytego
npm run final:desktop
```

### Google Chrome App

> cd chrome-app/

```sh
npm run apply:digibytego
grunt
make
```

On success, the Chrome extension will be located at: `browser-extensions/chrome/digibytego-chrome-extension`.  To install it go to `chrome://extensions/` in your browser and ensure you have the 'developer mode' option enabled in the settings.  Then click on "Load unpacked chrome extension" and choose the directory mentioned above.

## Configuration

### Enable External Services

To enable external services, set the `DigiByte Go_EXTERNAL_SERVICES_CONFIG_LOCATION` or `DigiByte Foundation_EXTERNAL_SERVICES_CONFIG_LOCATION` environment variable to the location of your configuration before running the `apply` task.

```sh
DigiByte Go_EXTERNAL_SERVICES_CONFIG_LOCATION="~/.digibytego/externalServices.json" npm run apply:digibytego
# or
DigiByte Foundation_EXTERNAL_SERVICES_CONFIG_LOCATION="~/.DigiByte Foundation/externalServices.json" npm run apply:DigiByte Foundation
```

## About DigiByteGo

### General

DigiByteGo implements a multisig wallet using [p2sh](https://en.digibyte.it/wiki/Pay_to_script_hash) addresses.  It supports multiple wallets, each with its own configuration, such as 3-of-5 (3 required signatures from 5 participant peers) or 2-of-3.  To create a multisig wallet shared between multiple participants, DigiByteGo requires the extended public keys of all the wallet participants.  Those public keys are then incorporated into the wallet configuration and combined to generate a payment address where funds can be sent into the wallet.  Conversely, each participant manages their own private key and that private key is never transmitted anywhere.

To unlock a payment and spend the wallet's funds, a quorum of participant signatures must be collected and assembled in the transaction.  The funds cannot be spent without at least the minimum number of signatures required by the wallet configuration (2-of-3, 3-of-5, 6-of-6, etc.).  Once a transaction proposal is created, the proposal is distributed among the wallet participants for each to sign the transaction locally.  Finally, when the transaction is signed, the last signing participant will broadcast the transaction to the DigiByte network.

DigiByteGo also implements [BIP32](https://github.com/digibyte/bips/blob/master/bip-0032.mediawiki) to generate new addresses for peers.  The public key that each participant contributes to the wallet is a BIP32 extended public key.  As additional public keys are needed for wallet operations (to produce new addresses to receive payments into the wallet, for example) new public keys can be derived from the participants' original extended public keys.  Once again, it's important to stress that each participant keeps their own private keys locally - private keys are not shared - and are used to sign transaction proposals to make payments from the shared wallet.

For more information regarding how addresses are generated using this procedure, see: [Structure for Deterministic P2SH Multisignature Wallets](https://github.com/digibyte/bips/blob/master/bip-0045.mediawiki).

## DigiByteGo Backups and Recovery

Since v1.2 DigiByteGo uses BIP39 mnemonics for backing up wallets.  The BIP44 standard is used for wallet address derivation. Multisig wallets use P2SH addresses, while non-multisig wallets use P2PKH.

Information about backup and recovery procedures is available at: https://github.com/DigiByte Foundation/digibytego/blob/master/backupRecovery.md

Previous versions of DigiByteGo used files as backups. See the following section.

It is possible to recover funds from a DigiByteGo Wallet without using DigiByteGo or the Wallet Service, check the [DigiByteGo Recovery Tool](https://github.com/DigiByte Foundation/digibytego-recovery).


## Wallet Export Format

DigiByteGo encrypts the backup with the [Stanford JS Crypto Library](http://bitwiseshiftleft.github.io/sjcl/).  To extract the private key of your wallet you can use https://bitwiseshiftleft.github.io/sjcl/demo/, copy the backup to 'ciphertext' and enter your password.  The resulting JSON will have a key named: `xPrivKey`, that is the extended private key of your wallet.  That information is enough to sign any transaction from your wallet, so be careful when handling it!

The backup also contains the key `publicKeyRing` that holds the extended public keys of the DigiByte Goers.
Depending on the key `derivationStrategy`, addresses are derived using
[BIP44](https://github.com/digibyte/bips/blob/master/bip-0044.mediawiki) or [BIP45](https://github.com/digibyte/bips/blob/master/bip-0045.mediawiki). Wallets created in DigiByteGo v1.2 and forward always use BIP44, all previous wallets use BIP45. Also note that since DigiByteGo version v1.2, non-multisig wallets use address types Pay-to-PublicKeyHash (P2PKH) while multisig wallets still use Pay-to-ScriptHash (P2SH) (key `addressType` at the backup):

| DigiByteGo Version  | Wallet Type   | Derivation Strategy   | Address Type  |
|---|---|---|---|---|
|  <1.2  | All  |  BIP45 | P2SH   |
|  >=1.2 | Non-multisig  | BIP44  | P2PKH   |
| >=1.2  | Multisig  |  BIP44 |  P2SH   |
| >=1.5  | Multisig Hardware wallets  |  BIP44 (root m/48') |  P2SH   |

Using a tool like [Bitcore PlayGround](http://bitcore.io/playground) all wallet addresses can be generated. (TIP: Use the `Address` section for P2PKH address type wallets and `Multisig Address` for P2SH address type wallets). For multisig addresses, the required number of signatures (key `m` on the export) is also needed to recreate the addresses.

BIP45 note: All addresses generated at BWS with BIP45 use the 'shared cosigner index' (2147483647) so DigiByteGo address indexes look like: `m/45'/2147483647/0/x` for main addresses and `m/45'/2147483647/1/y` for change addresses.

Since version 1.5, DigiByteGo uses the root `m/48'` for hardware multisignature wallets. This was coordinated with Ledger and Trezor teams. While the derivation path format is still similar to BIP44, the root was in order to indicate that these wallets are not discoverable by scanning addresses for funds. Address generation for multisignature wallets requires the other DigiByte Goers extended public keys.


## Bitcore Wallet Service

DigiByteGo depends on [Bitcore Wallet Service](https://github.com/digibytebitcore-wallet-service) (BWS) for blockchain information, networking and DigiByte Goer synchronization.  A BWS instance can be setup and operational within minutes or you can use a public instance like `https://bws.DigiByte Foundation.com`.  Switching between BWS instances is very simple and can be done with a click from within DigiByteGo.  BWS also allows DigiByteGo to interoperate with other wallets like [Bitcore Wallet CLI] (https://github.com/digibyte/bitcore-wallet).




## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)

## Support

 Please see [Support requests](CONTRIBUTING.md#support)


## License

DigiByteGo is released under the MIT License.  Please refer to the [LICENSE](https://github.com/DigiByte Foundation/digibytego/blob/master/LICENSE) file that accompanies this project for more information including complete terms and conditions.
