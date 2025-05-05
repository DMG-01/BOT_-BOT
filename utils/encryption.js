const crypto = require("crypto")

const algorithm = "aes-256-ctr";
const secretKey = Buffer.from(process.env.CRYPTO_SECRET_KEY, "hex"); // Must be 32 bytes
const iv = Buffer.from(process.env.CRYPTO_SECRET_IV, "hex"); // Must be 16 bytes


const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};


const decrypt = (hash) => {
    const [ivHex, encryptedData] = hash.split(":");
    const ivBuffer = Buffer.from(ivHex, "hex");

    if (ivBuffer.length !== 16) throw new Error("Invalid IV length"); // Ensuring IV length is correct

    const decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer);
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, "hex")), decipher.final()]);
    return decrypted.toString();
};

module.exports = {encrypt, decrypt}