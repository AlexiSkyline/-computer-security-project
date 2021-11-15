export function disableButtonSave ( reference ) {
    let buttonSave = reference.querySelector( '.button.save' );
    buttonSave.disabled = true;
    buttonSave.classList.add( 'disable' );
}

export function disableButtonEmpty ( reference ) {
    let buttonEmpty = reference.querySelector( '.button.empty' );

    if( !buttonEmpty ) return;
    
    buttonEmpty.disabled = true;
    buttonEmpty.classList.add( 'disable' );
}

export function activeButtonSave ( reference ) {
    let buttonSave = reference.querySelector( '.button.save' );
    buttonSave.disabled = false;
    buttonSave.classList.remove( 'disable' );
}

export function activeButtonEmpty ( reference ) {
    let buttonEmpty = reference.querySelector( '.button.empty' );
    buttonEmpty.disabled = false;
    buttonEmpty.classList.remove( 'disable' );
}

export function emptyInputs ( reference ) {
    const optionAlgorithm = document.querySelector( '#option_algorithm' );
    const textEntry       = reference.querySelector( '#text_entry' );
    const textOutput      = reference.querySelector( '#text_output' );

    optionAlgorithm.value = '';
    textEntry && ( textEntry.value = '' );
    textOutput.value = '';
}

export function showAlert ( bodyAlert, reference ) {
    const { alertTitle, alertMessage, alertIcon, showConfirmButton, timer } = bodyAlert;
    Swal.fire({
        title: alertTitle,
        text: alertMessage,
        icon: alertIcon,
        showConfirmButton: showConfirmButton,
        timer: timer
    }).then(() => {
        emptyInputs( reference );
        disableButtonSave( reference );
        disableButtonEmpty( reference );
    });
}