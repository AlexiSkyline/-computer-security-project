export const dragAndDrop = () => {
    const optionDocument = document.querySelector( '.option__document' );
    const dropArea       = document.querySelector( '.drop-area' );
    const dragText       = dropArea.querySelector( 'h2' );
    const button         = dropArea.querySelector( 'button' );
    const encryptButton  = optionDocument.querySelector( '.button.encrypt' )
    const input          = dropArea.querySelector( '#input-file' );
    let files;

    button.addEventListener( 'click', (e) => {
        e.preventDefault();
        input.click();
    });
    
    encryptButton.addEventListener( 'click', validateFormOptionDocument );

    dropArea.addEventListener( 'dragover', (e) => {
        e.preventDefault();
        dropArea.classList.remove( 'error' );
        dropArea.classList.add( 'active' );
        dragText.textContent = 'Suelta para subir los archivos';
    });

    document.addEventListener( 'dragleave', (e) => {
        e.preventDefault();
        dropArea.classList.add( 'error' );
    });

    dropArea.addEventListener( 'drop', (e) => {
        e.preventDefault();
        files = e.dataTransfer.files;
        showFiles( files );
        dropArea.classList.remove( 'active' );
        dropArea.classList.remove( 'error' );
        dragText.textContent = 'Arrastra y suelta imágenes';
    });

    input.addEventListener( 'change', (e) => {
        files = e.target.files;
        showFiles( files );
    })

    button.addEventListener( 'change', () => { 
        files = this.files;
        dropArea.classList.add( 'active' );
        showFiles( files );
        dropArea.classList.remove( 'active' );
    });

    function showFiles( files ) {
        if( files.length === undefined ) {
            processFiles( files );
        } else {
            for( const file of files ) {
                processFile( file );
            }
        }
    }

    function processFile( file ) {
        const docType = file.type;
        const validExtensions = [ "image/jpeg", "image/jpg", "image/png", "image/gif" ];
        
        const fileReader = new FileReader();
        const id = `file.${ Math.random().toString(32).substring(7) }`; 

        fileReader.addEventListener( 'load', ( e ) => {
            const fileUrl = fileReader.result;
            const image = `
                <div id="${id}" class="file-container">
                    <img src="${ validExtensions.includes( docType ) ? fileUrl : 'https://img.icons8.com/color/96/000000/check-file.png' }" width="30"/>
                    <div class="status">
                        <span>${ file.name }</span>
                        <span class="status-text">
                            Loading ...
                        </span>
                    </div>
                </div>
            `;

            const html = document.querySelector( '#preview' ).innerHTML;
            document.querySelector( '#preview' ).innerHTML = image + html;
        });

        fileReader.readAsDataURL( file );   
    }

    function validateFormOptionDocument( e ) {
        e.preventDefault();
        
        if( files === undefined ) {
            showMessageError();
            return
        }

        encryptFiles( files );
    }

    function showMessageError() {
        const messageIsActive = optionDocument.querySelector( '.message__error' );

        if( !messageIsActive ) {
            const divError = document.createElement( 'div' );
            divError.classList.add( 'message__error' );
            divError.innerHTML = 'No es encontro ningun archivo';
            
            optionDocument.insertBefore( divError, optionDocument.querySelector( '.container__buttons' ) );

            setTimeout(() => divError.remove(), 3000);
        }
    }

    function encryptFiles( files ) {
        console.log( files )
    }
}