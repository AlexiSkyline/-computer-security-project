import { storageService } from '../classes/index.js';
import { authUser } from '../https/http-provider.js';

( function() {
	const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const form = document.querySelector( 'form' );

	document.addEventListener( 'DOMContentLoaded', () => {
		form.addEventListener( 'submit', validateInput );
	});

	const validateInput = ( e ) => {
		e.preventDefault();

		const inputEmail = document.querySelector( '.email' );
		const inputPassword = document.querySelector( '.password' );

		if ( inputEmail.value.trim() === '' || inputPassword.value.trim() === '' ) {
			showMessage( 'Todos los campos son obligatorios.' );
		} else if( !er.test( inputEmail.value ) ) {
			showMessage( 'Correo invalido.' );
			return;
		} 

		if ( inputPassword.value.trim().length < 6 ) {
			showMessage( 'Contraseña invalida, minimo 6 de caracteres.' );
			return;
		} 

		sendInformation({ email: inputEmail.value, password: inputPassword.value });
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
		const request = await authUser( informationUsuario );

		const { msg, ruta, infoUser } = request;
		const { alertIcon, alertMessage, alertTitle, showConfirmButton, timer } = msg;

		const encryptedUserInfo = infoUser && storageService.secureStorage( infoUser ); 

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