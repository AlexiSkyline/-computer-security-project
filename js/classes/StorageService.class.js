export class StorageService {
    constructor(){ this.key = 'Palabra Secreta'; }

    async secureStorage( information ){
        this.ciphertext = '';
        this.informationUser = JSON.stringify( information );
        this.ciphertext = CryptoJS.TripleDES.encrypt( this.informationUser, this.key ).toString();

        localStorage.setItem( 'userSession', this.ciphertext );
    }

    getSession() {
        this.bytes = '';
        this.session = localStorage.getItem( 'userSession' ) || false;

        if( !this.session ) {
            return false;
        }

        this.bytes = CryptoJS.TripleDES.decrypt( this.session, this.key )
        this.originalText = this.bytes.toString( CryptoJS.enc.Utf8 );

        return JSON.parse( this.originalText );
    }
};