export class StorageService {
    constructor(){ this.key = 'Palabra Secreta'; }

    async secureStorage( information ){
        this.ciphertext = '';
        this.informationUser = JSON.stringify( information );
        this.ciphertext = CryptoJS.TripleDES.encrypt( this.informationUser, this.key ).toString();

        localStorage.setItem( 'userSession', this.ciphertext );
    }
};