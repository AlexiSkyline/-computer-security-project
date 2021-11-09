import { dragAndDrop } from "./dragAndDrop.js";

( function (){
    const inputOpcions = document.querySelectorAll( 'input[name="option"]' );

    let encryptButton;
    const optionAlgorithm = document.querySelector( '#option_algorithm' );
    let optionText;
    let buttonSave;

    document.addEventListener( 'DOMContentLoaded', () => {
        inputOpcions.forEach( input => {
            input.addEventListener( 'change', showEncryptionOption );
        });
    });

    function showEncryptionOption () {
        const banner         = document.querySelector( '.banner' ); 
        optionText           = document.querySelector( '.option__text' );
        const optionDocument = document.querySelector( '.option__document' );
        banner.style.display = 'none';

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
            // encryptButton.addEventListener( 'click', validateFormOptionText );
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

        if( optionAlgorithm.value === '' ) {
            optionAlgorithm.classList.add( 'error' );
            setTimeout( () => optionAlgorithm.classList.remove( 'error' ), 2000 );
            showMessageError( optionText, 'Todos los campos son obligatorios' );
            return;
        } else if( textEntry.value.trim() === '' ) {
            textEntry.classList.add( 'error' );
            setTimeout( () => textEntry.classList.remove( 'error' ), 2000 );
            showMessageError( optionText, 'Todos los campos son obligatorios' );
            return;
        } 

        textEntry.classList.remove( 'error' );
        optionAlgorithm.classList.remove( 'error' );
        encryptText( textEntry.value );
    }

    function showMessageError( reference, menssage ) {
        const messageIsActive = document.querySelector( '.message__error' );

        if( !messageIsActive ) {
            const divError = document.createElement( 'div' );
            divError.classList.add( 'message__error' );
            divError.innerHTML = menssage;
            
            reference.insertBefore( divError, reference.querySelector( 'container__text-areas' ) );

            setTimeout(() => {
                divError.remove();
            }, 2000)
        }
    }

    async function encryptText ( text ) {
        const textOutput = document.querySelector( '#text_output' );
        const digestHex = await digestMessage(text);
        textOutput.value = `${digestHex}`;
    
        buttonSave.disabled = false;
        buttonSave.classList.remove( 'disable' );
    }

    async function digestMessage( text ) {
        const msgUint8 = new TextEncoder().encode(text);                           // encode as (utf-8) Uint8Array
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        return hashHex;
    }
})();

