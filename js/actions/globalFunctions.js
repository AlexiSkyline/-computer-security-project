export function disableButtonSave ( reference ) {
    let buttonSave = reference.querySelector( '.button.save' );
    buttonSave.disabled = true;
    buttonSave.classList.add( 'disable' );
}

export function disableButtonEmpty ( reference ) {
    let buttonEmpty = reference.querySelector( '.button.empty' );
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
