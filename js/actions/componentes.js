import { crypto } from "../classes/index.js";
import { dragAndDrop } from "./dragAndDrop.js";

( function (){
    const inputOpcions = document.querySelectorAll( 'input[name="option"]' );

    let encryptButton;
    const optionAlgorithm = document.querySelector( '#option_algorithm' );
    let optionText;
    let buttonSave;
    let textOutput;

    document.addEventListener( 'DOMContentLoaded', () => {
        inputOpcions.forEach( input => {
            input.addEventListener( 'change', showEncryptionOption );
        });
    });

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

            encryptButton = optionText.querySelector( '.button.encrypt' )
            encryptButton.addEventListener( 'click', validateFormOptionText );
        } else {
            disableButton( optionDocument );
            optionText.style.display     = 'none';
            optionDocument.style.display = 'flex';
            dragAndDrop();

            encryptButton = optionDocument.querySelector( '.button.encrypt' )
        }
    }
    
    function disableButton ( reference ) {
        buttonSave = reference.querySelector( '.button.save' );
        buttonSave.disabled = true;
        buttonSave.classList.add( 'disable' );
    }

    function validateFormOptionText ( e ) {
        e.preventDefault();
        const textEntry = document.querySelector( '#text_entry' );
        textOutput      = optionText.querySelector( '#text_output' );

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
        showText( textEntry.value,  optionAlgorithm.value );
    }

    function showMessageError( menssage ) {
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
        const newText = crypto.textEncryption( text, option );

        if( !newText ) {
            showMessageError( 'Hubo un error al encriptar el texto' );
        }

        textOutput.value = `${newText}`;
    
        buttonSave.disabled = false;
        buttonSave.classList.remove( 'disable' );
    }

})();

