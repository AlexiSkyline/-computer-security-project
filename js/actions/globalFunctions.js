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
        reference && emptyInputs( reference );
        reference && disableButtonSave( reference );
        reference && disableButtonEmpty( reference );
    });
}

export function LogOut () {
    localStorage.removeItem( 'userSession' );
    location.href = 'login.html';
}

export function showUserName ( userName ) {
    const userNameA = document.querySelector( '.user__name' );
    
    userNameA.innerHTML = userName;
}


export function verifySession ( session, rolNotAllowed ) {
    const header        = document.querySelector( '.contaner__header' );
    const spinner       = document.querySelector( '.sk-circle' );
    const containerMain = document.querySelector( '.container_main' );
    
    if( !session || session.rol === rolNotAllowed ) {
        return location.href = 'login.html';
    } else {
        setTimeout(() =>{
            spinner.style.display       = 'none';
            header.style.display        = 'block';
            containerMain.style.display = 'flex';
        }, 1500 );
        return session;
    }
}