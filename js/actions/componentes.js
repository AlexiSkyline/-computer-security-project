import { crypto, storageService } from "../classes/index.js";
import { addEncryptedText } from "../https/http-provider.js";
import { dragAndDrop } from "./dragAndDrop.js";

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

    function verifySession ( session ) {
        const header        = document.querySelector( '.contaner__header' );
        const spinner       = document.querySelector( '.sk-circle' );
        const containerMain = document.querySelector( '.container_main' );
        
        if( !session || session.rol === 'desencriptador' ) {
            location.href = 'login.html';
        } else {
            informationUserSession = session;
            
            setTimeout(() =>{
                spinner.style.display       = 'none';
                header.style.display        = 'block';
                containerMain.style.display = 'flex';
            }, 1500 );
        }
    }

    function LogOut () {
        localStorage.removeItem( 'userSession' );
        location.href = 'login.html';
    }

    document.addEventListener( 'DOMContentLoaded', () => {
        const session = storageService.getSession();
        buttonLogOut = document.querySelector( '.button__log-out' );

        verifySession( session );

        showUserName();

        inputOpcions.forEach( input => {
            input.addEventListener( 'change', showEncryptionOption );
        });
        
        buttonLogOut.addEventListener( 'click', LogOut );
    });

    function showUserName () {
        const userName = document.querySelector( '.user__name' );
        
        userName.innerHTML = informationUserSession.userName;
    }

    function showEncryptionOption () {
        const banner           = document.querySelector( '.banner' ); 
        optionText             = document.querySelector( '.option__text' );
        const optionDocument   = document.querySelector( '.option__document' );
        const containerOptions = document.querySelector( '.container_options' );
        
        banner.style.display = 'none';
        containerOptions.style.display = 'block';

        if( this.id === 'texto' ) {
            disableButton( optionText );
            optionText.style.display     = 'flex';
            optionDocument.style.display = 'none';

            encryptButton = optionText.querySelector( '.button.encrypt' );
            buttonSave    = optionText.querySelector( '.button.save');
            encryptButton.addEventListener( 'click', validateFormOptionText );
            buttonSave.addEventListener( 'click', (e) => {
                e.preventDefault();
                sendTextEncrypted( newText, optionAlgorithm.value );
            });
        } else {
            disableButton( optionDocument );
            optionText.style.display     = 'none';
            optionDocument.style.display = 'flex';
            dragAndDrop();

            encryptButton = optionDocument.querySelector( '.button.encrypt' );
        }
    }
    
    function disableButton ( reference ) {
        buttonSave = reference.querySelector( '.button.save' );
        buttonSave.disabled = true;
        buttonSave.classList.add( 'disable' );
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

        if( !newText ) {
            showMessageError( 'Hubo un error al encriptar el texto' );
            disableButton( optionText );
        }

        textOutput.value = `${newText}`;
    
        buttonSave.disabled = false;
        buttonSave.classList.remove( 'disable' );
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
            return showAlert( bodyAlert );
        }

        const { msg } = await addEncryptedText({ encrytedText, algorithm: option,  idCreator: informationUserSession.id });
        showAlert( msg );
    }

    function emptyInputs () {
        optionAlgorithm.value = '';
        textEntry.value = '';
        textOutput.value = '';
        disableButton( optionText );
    }

    function showAlert ( bodyAlert ) {
        const { alertTitle, alertMessage, alertIcon, showConfirmButton, timer } = bodyAlert;
        Swal.fire({
			title: alertTitle,
			text: alertMessage,
			icon: alertIcon,
			showConfirmButton: showConfirmButton,
			timer: timer
		}).then(() => {
			emptyInputs();
		});
    }
})();