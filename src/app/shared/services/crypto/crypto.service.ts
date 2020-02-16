import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CryptoService {
    public static keySize = 4;
    public static iterationCount = 1000;
    public static crypter = 'TataAIAiRecruit';
    public static salt = 'fa9b8ba73fe30d8dfcf4c59532148522';
    public static iv = 'a715fed0af06cce82dcc1e69fc832cfe';

    public static generateKey(passPhrase: string) {
        const key = CryptoJS.PBKDF2(
            passPhrase,
            CryptoJS.enc.Hex.parse(this.salt),
            { keySize: this.keySize, iterations: this.iterationCount }
        );
        return key;
    }

    public static encrypt(plainText: any) {
        const key = this.generateKey(this.crypter);
        if (typeof plainText === 'object') {
            plainText = JSON.stringify(plainText);
        }
        let encrypted = CryptoJS.AES.encrypt(
            plainText,
            key,
            { iv: CryptoJS.enc.Hex.parse(this.iv) }
        );
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    }

    public static decrypt(cipherText: string) {
        const key = this.generateKey(this.crypter);
        let cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(cipherText)
        });
        let decrypted = CryptoJS.AES.decrypt(
            cipherParams,
            key,
            { iv: CryptoJS.enc.Hex.parse(this.iv) }
        );
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}
