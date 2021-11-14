import { storageService } from '../classes/index.js';
import { createUser } from '../https/http-provider.js';

( function() {
	const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const form = document.querySelector( 'form' );

	document.addEventListener( 'DOMContentLoaded', () => {
		form.addEventListener( 'submit', validateInput );
	});

	const validateInput = ( e ) => {
		e.preventDefault();
		const inputName = document.querySelector( '.name' );
		const inputEmail = document.querySelector( '.email' );
		const inputPassword = document.querySelector( '.password' );
		const inputRol = document.querySelector( 'input[name="rol"]:checked' );
       
		if ( inputName.value.trim() === '' || inputEmail.value.trim() === '' || inputPassword.value.trim() === ''
             || inputPassword.value.trim() === '' || inputRol.value === '' ) {
			showMessage( 'Todos los campos son obligatorios.' );
		} else if( !er.test( inputEmail.value ) ) {
			showMessage( 'Correo invalido.' );
			return;
		} 

        if ( inputName.value.trim().length < 4 ) {
			showMessage( 'El nombre de usuario debe ser de minimo 4 de caracteres.' );
			return;
		} 

		if ( inputPassword.value.trim().length < 6 ) {
			showMessage( 'Contraseña invalida, minimo 6 de caracteres.' );
			return;
		} 

		sendInformation({ userName: inputName.value, email: inputEmail.value, password: inputPassword.value, rol: inputRol.value });
	}

	const showMessage = ( msg ) => {
		const error = document.querySelector( '.error' );
		if( !error ) {
			const divMessage = document.createElement( 'p' );
			divMessage.classList.add( 'error', 'text-center', 'alert', 'alert-danger', 'mt-2' );
			divMessage.innerText = msg;
			form.insertBefore( divMessage, document.querySelector( '.d-grid' ) );
			setTimeout( () => divMessage.remove(), 3000 );
		}
	}

	async function sendInformation ( informationUsuario ) {
		const request = await createUser( informationUsuario );

		const { msg, ruta, newUser } = request;
		const { alertIcon, alertMessage, alertTitle, showConfirmButton, timer } = msg;

		const encryptedUserInfo = newUser && storageService.secureStorage( newUser ); 
		Swal.fire({
			title: alertTitle,
			text: alertMessage,
			icon: alertIcon,
			showConfirmButton: showConfirmButton,
			timer: timer
		}).then(() => {
			alertIcon === 'error' ? null : location.href = ruta;
		});
	}
})();