export class Crypto {
    constructor() {
        this.key = 'Palabra Secreta';
    }

    textEncryption( text, option ) {
        this.ciphertext = null;
        
        if( option === 'TripleDES' ) {
            this.ciphertext = CryptoJS.TripleDES.encrypt( text, this.key ).toString();
        } else if( option === 'Rabbit' ) {
            this.ciphertext = CryptoJS.Rabbit.encrypt( text, this.key ).toString();
        }

        return this.ciphertext;
    }

    textDecryption( text, option ) {
        this.bytes = null;

        if( option === 'TripleDES' ) {
            this.bytes = CryptoJS.TripleDES.decrypt( text, this.key );
        } else if( option === 'Rabbit' ) {
            this.bytes = CryptoJS.Rabbit.decrypt( text, this.key );
        }

        this.originalText = this.bytes.toString( CryptoJS.enc.Utf8 );
        return this.originalText;
    }

}