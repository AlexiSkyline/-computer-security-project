import { dragAndDrop } from "./dragAndDrop.js";

( function (){
    const inputOpcions = document.querySelectorAll( 'input[name="option"]' );

    const encryptButton = document.querySelector( '.button.encrypt' );
    const optionAlgorithm = document.querySelector( '#option_algorithm' );
    const textEntry = document.querySelector( '#text_entry' );

    document.addEventListener( 'DOMContentLoaded', () => {
        inputOpcions.forEach( input => {
            input.addEventListener( 'change', showEncryptionOption );
        });

        encryptButton.addEventListener( 'click', validateForm );
    });

    function showEncryptionOption () {
        const banner         = document.querySelector( '.banner' ); 
        const optionText     = document.querySelector( '.option__text' );
        const optionDocument = document.querySelector( '.option__document' );

        banner.style.display = 'none';
        if( this.id === 'texto' ) {
            optionText.style.display     = 'flex';
            optionDocument.style.display = 'none';
        } else {
            optionText.style.display     = 'none';
            optionDocument.style.display = 'flex';
            dragAndDrop();
        }
    }

    function validateForm ( e ) {
        e.preventDefault();

        if( e.target.parentNode.parentNode.classList.contains( 'option__text' ) && optionAlgorithm.value !== '' && textEntry.value !== '' ) {
            console.log( 'optionAlgorithm' + textEntry.value );
        }
        if( e.target.parentNode.parentNode.classList.contains( 'option__document' )  ) {
            
        }
    }

})();