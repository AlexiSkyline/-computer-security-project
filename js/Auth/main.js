( function() {
	const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const form = document.querySelector( 'form' );
	const inputs = document.querySelectorAll( '.input' );

	document.addEventListener( 'DOMContentLoaded', () => {
		inputs.forEach( input => {
			input.addEventListener( 'focus', () => addClassFocus( input ) );
			input.addEventListener( 'blur', () => removeClassFocus( input ) );
		});
		form.addEventListener( 'submit', validateInput );
	});


	const addClassFocus = ( input ) => {
		let parent = input.parentNode.parentNode;
		parent.classList.add( 'focus' );
	}

	const removeClassFocus = ( input ) => {
		let parent = input.parentNode.parentNode;
		if( input.value === '' ){
			parent.classList.remove( 'focus' );
		}
	}

	const showMessage = ( msg ) => {
		const error = document.querySelector( '.error' );
		if( !error ) {
			const divMessage = document.createElement( 'p' );
			divMessage.classList.add( 'error' );
			divMessage.innerText = msg;
			form.insertBefore( divMessage, document.querySelector( '.btn' ) );

			setTimeout( () => divMessage.remove(), 3000 );
		}
	}

	const validateInput = ( e ) => {
		e.preventDefault();
		
		const inputEmial = document.querySelector( '.email' );
		const inputPassword = document.querySelector( '.password' );

		if( inputPassword.value.trim() === '' || inputPassword.value.length === 0 ) {
			showMessage( 'Todos los campos son requeridos' );
		}
		if( !er.test( inputEmial.value ) ) {
			showMessage( 'Correo invalido' );
			return;
		} 
		if( inputPassword.value.trim().length < 6 ) {
			showMessage( 'Contraseña invalida, minimo 6 de caracteres' );
			return;
		} 
	}
})();