console.log("=================", global.crypto);

// /* eslint-disable import/no-unused-modules */
// /* eslint-disable @typescript-eslint/no-unused-expressions */
// import "react-native-get-random-values";

// console.log("=================", global.crypto);

// // Check if crypto.getRandomValues is defined
// // if (typeof global.crypto === 'undefined') {
// //   global.crypto = {
// //     getRandomValues: (array: Uint8Array) => require('expo-crypto').getRandomBytesAsync(array.length).then((bytes: Uint8Array) => array.set(bytes)),
// //   };
// // }

// if (typeof __dirname === "undefined") global.__dirname = "/";
// if (typeof __filename === "undefined") global.__filename = "";
// if (typeof process === "undefined") {
//   global.process = require("process");
// } else {
//   const bProcess = require("process");
//   for (var p in bProcess) {
//     if (!(p in process)) {
//       process[p] = bProcess[p];
//     }
//   }
// }

// process.browser = false;
// if (typeof Buffer === "undefined") global.Buffer = require("buffer").Buffer;

// // global.location = global.location || { port: 80 }
// const isDev = typeof __DEV__ === "boolean" && __DEV__;
// process.env["NODE_ENV"] = isDev ? "development" : "production";
// if (typeof localStorage !== "undefined") {
//   localStorage.debug = isDev ? "*" : "";
// }

// // If using the crypto shim, uncomment the following line to ensure
// // crypto is loaded first, so it can populate global.crypto
// // require("crypto");
// require("zlib");

// if (typeof BigInt === "undefined")
//   global.BigInt = require("big-integer/BigInteger");
// BigInt.prototype["toJSON"] = function () {
//   return this.toString();
// };

// import { Platform } from "react-native";

// if (Platform.OS === "ios") {
//   // Polyfills required to use Intl with Hermes engine
//   require("@formatjs/intl-getcanonicallocales/polyfill").default;
//   require("@formatjs/intl-locale/polyfill").default;
//   require("@formatjs/intl-pluralrules/polyfill").default;
//   require("@formatjs/intl-pluralrules/locale-data/en").default;
//   require("@formatjs/intl-numberformat/polyfill").default;
//   require("@formatjs/intl-numberformat/locale-data/en").default;
//   require("@formatjs/intl-datetimeformat/polyfill").default;
//   require("@formatjs/intl-datetimeformat/locale-data/en").default;
//   require("@formatjs/intl-datetimeformat/add-all-tz").default;
// }
// // console.log('NumberFormat', Intl)
// import * as ed from "@noble/ed25519";
// import { sha512 } from "@noble/hashes/sha512";
// ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
// ed.etc.sha512Async = (...m) => Promise.resolve(ed.etc.sha512Sync(...m));

// import "react-native-get-random-values";
// if (__DEV__ && typeof global.crypto !== "object") {
//   global.crypto = {
//     getRandomValues: (array) =>
//       array.map(() => Math.floor(Math.random() * 256)),
//   };
// } else {
//   require("react-native-get-random-values");
// }
