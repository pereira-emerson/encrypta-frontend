const KEY_NAME = 'RSA-OAEP';
const KEY_HASH = 'SHA-256'; // or SHA-512

const PUBLIC_KEY_DATA_FORMAT = 'spki';
const PUBLIC_KEY_PEM_HEADER = '-----BEGIN PUBLIC KEY-----';
const PUBLIC_KEY_PEM_FOOTER = '-----END PUBLIC KEY-----';

const PRIVATE_KEY_DATA_FORMAT = 'pkcs8';
const PRIVATE_KEY_PEM_HEADER = '-----BEGIN RSA PRIVATE KEY-----';
const PRIVATE_KEY_PEM_FOOTER = '-----END RSA PRIVATE KEY-----';

// array buffer vs string:
// https://developer.chrome.com/blog/how-to-convert-arraybuffer-to-and-from-string

function arrayBufferToString({ arrayBuffer }) {
  return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
}

function stringToArrayBuffer({ string }) {
  const arrayBuffer = new ArrayBuffer(string.length);
  const unit8Array = new Uint8Array(arrayBuffer);
  for (let i = 0, strLen = string.length; i < strLen; i++) {
    unit8Array[i] = string.charCodeAt(i);
  }
  return arrayBuffer;
}

// generate key:
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey#rsa_key_pair_generation

async function generateKeyPair() {
  return await window.crypto.subtle.generateKey(
    {
      name: KEY_NAME,
      modulusLength: 2048, // can be 1024, 2048 or 4096
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: KEY_HASH },
    },
    true,
    ['encrypt', 'decrypt'],
  );
}

// export key:
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey#subjectpublickeyinfo_export

async function exportCryptoKey({ key, type }) {
  if (!['public', 'private'].includes(type)) {
    console.error('Key type must be either `public` or `private`.');
    return;
  }

  const dataFormat = type === 'public' ? PUBLIC_KEY_DATA_FORMAT : PRIVATE_KEY_DATA_FORMAT;
  const pemHeader = type === 'public' ? PUBLIC_KEY_PEM_HEADER : PRIVATE_KEY_PEM_HEADER;
  const pemFooter = type === 'public' ? PUBLIC_KEY_PEM_FOOTER : PRIVATE_KEY_PEM_FOOTER;

  const exported = await window.crypto.subtle.exportKey(dataFormat, key);
  const exportedAsString = arrayBufferToString({ arrayBuffer: exported });
  const exportedAsBase64 = window.btoa(exportedAsString);

  return `${pemHeader}\n${exportedAsBase64}\n${pemFooter}`;
}

// import key:
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#subjectpublickeyinfo_import

async function importRsaKey({ pem, type }) {
  if (!['public', 'private'].includes(type)) {
    console.error('Key type must be either `public` or `private`.');
    return;
  }

  const dataFormat = type === 'public' ? PUBLIC_KEY_DATA_FORMAT : PRIVATE_KEY_DATA_FORMAT;
  const pemHeader = type === 'public' ? PUBLIC_KEY_PEM_HEADER : PRIVATE_KEY_PEM_HEADER;
  const pemFooter = type === 'public' ? PUBLIC_KEY_PEM_FOOTER : PRIVATE_KEY_PEM_FOOTER;
  const keyUsages = type === 'public' ? ['encrypt'] : ['decrypt'];

  const pemContents = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length - 1,
  );

  const binaryDerString = window.atob(pemContents);
  const binaryDer = stringToArrayBuffer({ string: binaryDerString });

  return await window.crypto.subtle.importKey(
    dataFormat,
    binaryDer,
    { name: KEY_NAME, hash: KEY_HASH },
    true,
    keyUsages,
  );
}

// encrypt message:
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#rsa-oaep_2

async function encryptMessage({ publicKey, plainMessage }) {
  return await window.crypto.subtle.encrypt(
    { name: KEY_NAME },
    publicKey,
    new TextEncoder().encode(plainMessage),
  );
}

// decrypt message:
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt#rsa-oaep

async function decryptMessage({ privateKey, cipherMessage }) {
  const decryptedAsArrayBuffer = await window.crypto.subtle.decrypt(
    { name: KEY_NAME },
    privateKey,
    cipherMessage,
  );
  return new TextDecoder().decode(decryptedAsArrayBuffer);
}

export {
  arrayBufferToString,
  stringToArrayBuffer,
  generateKeyPair,
  exportCryptoKey,
  importRsaKey,
  encryptMessage,
  decryptMessage,
};

/*

Example usage:

import {
  generateKeyPair,
  exportCryptoKey,
  importRsaKey,
  encryptMessage,
  decryptMessage,
} from '@/utils/crypto';

const keyPair = await generateKeyPair();
console.log('keyPair', keyPair);

const publicKeyAsPem = await exportCryptoKey({
  key: keyPair.publicKey,
  type: 'public',
});
console.log('publicKeyAsPem', publicKeyAsPem);

const privateKeyAsPem = await exportCryptoKey({
  key: keyPair.privateKey,
  type: 'private',
});
console.log('privateKeyAsPem', privateKeyAsPem);

const publicKeyAsKey = await importRsaKey({
  pem: publicKeyAsPem,
  type: 'public',
});
console.log('publicKeyAsKey', publicKeyAsKey);

const publicKeyAsRsa = await importRsaKey({
  pem: privateKeyAsPem,
  type: 'private',
});
console.log('publicKeyAsRsa', publicKeyAsRsa);

const encryptedMessage = await encryptMessage({
  publicKey: publicKeyAsKey,
  plainMessage: 'Example message.',
});
console.log('encryptedMessage', encryptedMessage);

const decryptedMessage = await decryptMessage({
  privateKey: publicKeyAsRsa,
  cipherMessage: encryptedMessage,
});
console.log('decryptedMessage', decryptedMessage);

*/
