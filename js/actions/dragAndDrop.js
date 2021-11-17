import { crypto, storageService } from "../classes/index.js";
import { addEncryptedDocument } from "../https/http-provider.js";
import { activeButtonEmpty, activeButtonEncrypt, activeButtonSave, disableButtonEmpty, disableButtonEncrypt, disableButtonSave, showAlert } from "./globalFunctions.js";

export const dragAndDrop = () => {
    let informationUserSession = storageService.getSession();;
    const optionDocument  = document.querySelector( '.option__document' );
    const dropArea        = document.querySelector( '.drop-area' );
    const dragText        = dropArea.querySelector( 'h2' );
    const button          = dropArea.querySelector( 'button' );
    const buttonSave      = optionDocument.querySelector( '.button.save' );
    const encryptButton   = optionDocument.querySelector( '.button.encrypt' )
    const input           = dropArea.querySelector( '#input-file' );
    const optionAlgorithm = document.querySelector( '#option_algorithm' );
    let files;
    let bodyFileContainer;
    let textOutput;
    let newText; 

    button.addEventListener( 'click', (e) => {
        e.preventDefault();
        input.click();
    });
    
    encryptButton.addEventListener ( 'click', validateFormOptionDocument );

    buttonSave.addEventListener( 'click', (e) => {
        e.preventDefault(e);
        sendDocumentEncrypted( newText, optionAlgorithm.value );
    });

    dropArea.addEventListener ( 'dragover', (e) => {
        e.preventDefault();
        dropArea.classList.remove( 'error' );
        dropArea.classList.add( 'active' );
        dragText.textContent = 'Suelta para subir los archivos';
    });

    document.addEventListener ( 'dragleave', (e) => {
        e.preventDefault();
        dropArea.classList.add( 'error' );
    });

    dropArea.addEventListener ( 'drop', (e) => {
        e.preventDefault();
        
        if( !files ) {
            files = e.dataTransfer.files;
            showFiles( files );
        } else {
            showMessageError( 'Error, un archivo en espera' );
        }
        
        dropArea.classList.remove( 'active' );
        dropArea.classList.remove( 'error' );
        dragText.textContent = 'Arrastra y suelta imágenes';
    });

    input.addEventListener ( 'change', (e) => {
        if( !files ) {
            files = e.target.files;
            showFiles( files );
        } else {
            showMessageError( 'Error, un archivo en espera' );
        }
    });

    button.addEventListener ( 'change', () => { 
        if( !files ) {
            files = this.files;
            showFiles( files );
        } else {
            showMessageError( 'Error, un archivo en espera' );
        }
        dropArea.classList.add( 'active' );
        dropArea.classList.remove( 'active' );
    });

    function showFiles ( files ) {
        if( files.length === 1 ) {
            for( const file of files ) {
                processFile( file );
            }
        } else {
            showMessageError( 'Error, solo 1 archivo ala vez' );
        }
    }

    function processFile ( file ) {
        const docType = file.type;
        const validExtensions = [ "image/jpeg", "image/jpg", "image/png", "image/gif" ];
        
        const fileReader = new FileReader();

        fileReader.addEventListener( 'load', () => {
            const fileUrl = fileReader.result;
            bodyFileContainer =  document.createElement( 'div' );
            bodyFileContainer.classList.add( 'file-container' );
            
            bodyFileContainer.innerHTML = `
                    <img src="${ validExtensions.includes( docType ) ? fileUrl : 'https://img.icons8.com/color/96/000000/check-file.png' }" width="30"/>
                    <div class="status">
                        <span>El archivo: ${ file.name }, Esta: </span>
                        <span class="status-text">
                            Listo para encriptar
                        </span>
                    </div>
            `;

            document.querySelector( '#preview' ).appendChild( bodyFileContainer );
        });

        clearList();
        fileReader.readAsDataURL( file );   
    }

    function validateFormOptionDocument ( e ) {
        e.preventDefault();
        
        if( optionAlgorithm.value === '' ) {
            optionAlgorithm.classList.add( 'error' );
            setTimeout( () => optionAlgorithm.classList.remove( 'error' ), 2000 );
            showMessageError( 'Todos los campos son obligatorios' );
            return;
        } else if( files === undefined ) {
            dropArea.classList.add( 'error' );
            setTimeout( () => dropArea.classList.remove( 'error' ), 2000 );
            showMessageError( 'No es encontro ningun archivo' );
            return
        }

        disableButtonEncrypt( optionDocument );
        convertBase64( files );
    }

    function showMessageError ( message ) {
        const messageIsActive = optionDocument.querySelector( '.message__error' );

        if( !messageIsActive ) {
            const divError = document.createElement( 'div' );
            divError.classList.add( 'message__error' );
            divError.innerHTML = message;
            
            optionDocument.insertBefore( divError, optionDocument.querySelector( '.container__buttons' ) );

            setTimeout(() => divError.remove(), 3000);
        }
    }

    function clearList() {
        activeButtonEmpty( optionDocument );
        const buttonEmpty = optionDocument.querySelector( '.button.empty' );
        textOutput = optionDocument.querySelector( '#text_output' );
        
        buttonEmpty.onclick = (e) => {
            e.preventDefault();
            files = null;
            bodyFileContainer.remove();
            bodyFileContainer = null;
            textOutput.value = '';
            disableButtonEmpty( optionDocument );
            activeButtonEncrypt( optionDocument );
        }
    }

    function convertBase64 ( files ) {
        Array.from( files ).forEach( file => {
            var render = new FileReader();
            render.readAsDataURL( file );
            render.onload = function() {
                var arrayAuxliliar = [];
                var base64 = render.result;

                arrayAuxliliar = base64.split( ',' );

                encryptBase64( arrayAuxliliar[1] );
            }
        });
    }

    function encryptBase64 ( textBase64 ) {
        newText  = crypto.textEncryption( textBase64, optionAlgorithm.value );
        textOutput     = optionDocument.querySelector( '#text_output' );

        if( !textBase64 ) {
            showMessageError( 'Hubo un Error al encriptar el Archivo' );
        }

        textOutput.value = `${newText}`;
        activeButtonSave( optionDocument );
    }    

    async function sendDocumentEncrypted ( encrytedDocument, algorithm ) {
        const { msg } = await addEncryptedDocument({ encrytedDocument, algorithm, idCreator: informationUserSession.id });

        clearList();
        showAlert( msg, optionDocument );
        files = null;
        bodyFileContainer.remove();
        bodyFileContainer = null;
        activeButtonEncrypt( optionDocument );
    }
}