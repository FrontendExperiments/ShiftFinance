// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import {TextEncoder, TextDecoder} from "util";

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// import NodeEnvironment  from 'jest-environment-node'

// module.exports = class CustomTestEnvironment extends NodeEnvironment {
//     async setup() {
//         await super.setup();
//         if (typeof this.global.TextEncoder === 'undefined') {
//             const { TextEncoder } = require('util');
//             this.global.TextEncoder = TextEncoder;
//         }
//     }
// }