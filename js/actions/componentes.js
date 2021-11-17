import { crypto, storageService } from "../classes/index.js";
import { addEncryptedText } from "../https/http-provider.js";
import { dragAndDrop } from "./dragAndDrop.js";
import { activeButtonEncrypt, activeButtonSave, disableButtonEmpty, disableButtonEncrypt, disableButtonSave, LogOut, showAlert, showUserName, verifySession } from "./globalFunctions.js";

( function (){
    let informationUserSession;

    const inputOpcions = document.querySelectorAll( 'input[name="option"]' );

    let encryptButton;
    const optionAlgorithm = document.querySelector( '#option_algorithm' );
    let optionText;
    let buttonSave;
    let textOutput;
    let buttonLogOut;
    let textEntry;
    let newText;
    let copyText;

    document.addEventListener( 'DOMContentLoaded', () => {
        const session = storageService.getSession();
        buttonLogOut = document.querySelector( '.button__log-out' );

        verifySession( session, 'desencriptador' ) && ( informationUserSession = verifySession( session, 'desencriptador' ) );

        showUserName( informationUserSession.userName );

        inputOpcions.forEach( input => {
            input.addEventListener( 'change', showEncryptionOption );
        });
        
        buttonLogOut.addEventListener( 'click', LogOut );
    });

    function showEncryptionOption () {
        const banner           = document.querySelector( '.banner' ); 
        optionText             = document.querySelector( '.option__text' );
        const optionDocument   = document.querySelector( '.option__document' );
        const containerOptions = document.querySelector( '.container_options' );
        
        banner.style.display = 'none';
        containerOptions.style.display = 'block';

        if( this.id === 'texto' ) {
            disableButtonSave( optionText );
            optionText.style.display     = 'flex';
            optionDocument.style.display = 'none';

            encryptButton = optionText.querySelector( '.button.encrypt' );
            buttonSave    = optionText.querySelector( '.button.save');
            encryptButton.addEventListener( 'click', validateFormOptionText )
            
            buttonSave.addEventListener( 'click', (e) => {
                e.preventDefault();
                if( copyText !== textEntry.value ) { 
                    showText( textEntry.value, optionAlgorithm.value ); 
                }

                sendTextEncrypted( newText, optionAlgorithm.value );
            });
        } else {
            disableButtonSave( optionDocument );
            disableButtonEmpty( optionDocument );
            optionText.style.display     = 'none';
            optionDocument.style.display = 'flex';
            dragAndDrop();

            encryptButton = optionDocument.querySelector( '.button.encrypt' );
        }
    }

    function validateFormOptionText ( e ) {
        e.preventDefault();
        textEntry = document.querySelector( '#text_entry' );
        textOutput = optionText.querySelector( '#text_output' );

        if( optionAlgorithm.value === '' ) {
            optionAlgorithm.classList.add( 'error' );
            setTimeout( () => optionAlgorithm.classList.remove( 'error' ), 2000 );
            showMessageError( 'Todos los campos son obligatorios' );
            return;
        } else if( textEntry.value.trim() === '' ) {
            textEntry.classList.add( 'error' );
            setTimeout( () => textEntry.classList.remove( 'error' ), 2000 );
            textOutput.value = '';
            showMessageError( 'Todos los campos son obligatorios' );
            return;
        }

        disableButtonEncrypt( optionText );
        textEntry.classList.remove( 'error' );
        optionAlgorithm.classList.remove( 'error' );
        showText( textEntry.value, optionAlgorithm.value );
    }

    function showMessageError ( menssage ) {
        const messageIsActive = document.querySelector( '.message__error' );

        if( !messageIsActive ) {
            const divError = document.createElement( 'div' );
            divError.classList.add( 'message__error' );
            divError.innerHTML = menssage;
            
            optionText.insertBefore( divError, optionText.querySelector( 'container__text-areas' ) );

            setTimeout(() => {
                divError.remove();
            }, 2000)
        }
    }

    function showText ( text, option ) {
        newText = crypto.textEncryption( text, option );
        copyText = text;

        if( !newText ) {
            showMessageError( 'Hubo un error al encriptar el texto' );
            disableButtonSave( optionText );
        }

        textOutput.value = `${newText}`;
    
        activeButtonSave( optionText );
    }

    async function sendTextEncrypted ( encrytedText, option ) {
        if( textEntry.value.trim() === '' || optionAlgorithm.value === '' ) { 
            const bodyAlert = {
                alertTitle: "Error",
                alertMessage: "!hubo un error al momento de analizar el contenido!",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
            }
            return showAlert( bodyAlert, optionText );
        }

        activeButtonEncrypt( optionText );
        const { msg } = await addEncryptedText({ encrytedText, algorithm: option,  idCreator: informationUserSession.id });
        showAlert( msg, optionText );
    }
})();