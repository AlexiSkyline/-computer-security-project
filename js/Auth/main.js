( function() {
	const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const form = document.querySelector( 'form' );

	document.addEventListener( 'DOMContentLoaded', () => {
		form.addEventListener( 'submit', validateInput );
	});

	const validateInput = ( e ) => {
		e.preventDefault();
		console.log( 'Hola' );
		const inputEmail = document.querySelector( '.email' );
		const inputPassword = document.querySelector( '.password' );

		if( inputPassword.value.trim() === '' || inputPassword.value.length === 0 ) {
			showMessage( 'Todos los campos son obligatorios.' );
		}
		if( !er.test( inputEmail.value ) ) {
			showMessage( 'Correo invalido.' );
			return;
		} 
		if( inputPassword.value.trim().length < 6 ) {
			showMessage( 'Contraseña invalida, minimo 6 de caracteres.' );
			return;
		} 

		// Todo: función de la bd  
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
})();