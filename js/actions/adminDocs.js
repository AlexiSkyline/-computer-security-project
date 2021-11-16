import { crypto, storageService } from "../classes/index.js";
import { deleteEncryptedDocument, getEncryptedDocuments } from "../https/http-provider.js";
import { LogOut, showAlert, showUserName, verifySession } from "./globalFunctions.js";

( function (){
    let informationUserSession;
    const containerInfoDocument = document.querySelector( '.container__info-document' );
    const formTextArea = document.querySelector( '.form-text-area' );
    const creatorName = document.querySelector( '.creator__name span' ); 
    const typeAlgorithm = document.querySelector( '.type__algorithm span' );
    const dateCreation = document.querySelector( '.date__creation span' );
    const buttonClear = document.querySelector( '.clear' );

    let infoDocuments = [];

    document.addEventListener ( 'DOMContentLoaded', () => {
        const buttonLogOut = document.querySelector( '.button__log-out' );
        const session = storageService.getSession();
        verifySession( session, 'encriptador' ) && ( informationUserSession = verifySession( session, 'encriptador' ) );

        validateData();

        showUserName( informationUserSession.userName );

        containerInfoDocument.addEventListener( 'click', getDocument );
        buttonClear.addEventListener( 'click', ( e ) => {
            e.preventDefault();
            clearDescription();
        });

        buttonLogOut.addEventListener( 'click', LogOut );
    });

    async function validateData () {
        const { documents } = await getEncryptedDocuments( informationUserSession.id ); 
        infoDocuments = documents;
        createHTML ( documents );
    }   

    function createHTML ( infoDocuments ) {
        infoDocuments.forEach( ( infoDocument ) => {
            const rowDocument = document.createElement( 'tr' );
            const { id, encrytedDocument, algorithm, Creator, state, createdAt } = infoDocument;
            rowDocument.classList.add( `body__text${ id }` );

            if( state ) {
                rowDocument.innerHTML = `
                <td scope="col" class="text-center">${ id }</td>
                <td class="text-center">${ encrytedDocument.substring( 0, 8 ) }.....</td>
                <td class="text-center">${ algorithm === 'tripledes' ? 'TripleDes' : 'Rabbit' }</td>
                <td class="text-center">${ Creator }</td>
                <td class="text-center">${ createdAt.substring( 0, createdAt.indexOf( 'T' ) ) }</td>
                <td class="text-center"><a href="#" class="text-success"  title="Desencriptar" data-id="${id}"><i class="bi bi-body-text"></i></a></td>
                <td class="text-center"><a href="#" class="text-danger" title="Eliminar" data-id="${id}"><i class="bi bi-trash"></i></a></td>
                `;
                containerInfoDocument.appendChild( rowDocument );
            }
        });
    }

    function getDocument ( e ) {

        if( e.target.classList.contains( 'bi-body-text' ) ) {
            const id = e.target.parentElement.getAttribute( 'data-id' );
            
            const infoDoc = infoDocuments.filter( document => document.id === parseInt( id ) );

            const decryptedDocument = crypto.textDecryption( infoDoc[0].encrytedDocument, infoDoc[0].algorithm );
            
            showBase64Text( infoDoc[0], decryptedDocument );
        }

        if( e.target.classList.contains( 'bi-trash' ) ) {
            const id = e.target.parentElement.getAttribute( 'data-id' );
            
            Swal.fire({
                title: '¿Estas Seguro?',
                text: 'El producto se eliminara',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar'
            }).then(( result ) => {
                if( result.value ) {
                    sendRequestDelete( id );
                    clearHTML( id );
                }
            });
        }
    }

    function showBase64Text ( infoDocument, documentoBase64 ) {
        creatorName.innerText = `${ infoDocument.Creator }`;
        typeAlgorithm.innerText = `${ infoDocument.algorithm === 'tripledes' ? 'TripleDes' : 'Rabbit' }`;
        dateCreation.innerText = `${ infoDocument.createdAt.substring( 0, infoDocument.createdAt.indexOf( 'T' ) ) }`;
        
        let decodificado = window.atob(documentoBase64);
        formTextArea.value = decodificado;
    }

    function clearDescription () {
        creatorName.innerText = '';
        typeAlgorithm.innerText = '';
        dateCreation.innerText = '';
        formTextArea.value = '';
    }

    async function sendRequestDelete( id ) {
        const request = await deleteEncryptedDocument( id, informationUserSession.id );
        
        showAlert( request.msg );
    }

    function clearHTML ( id ) {
        const bodyText = document.querySelector( `.body__text${ id }` );
        bodyText.remove();
        clearDescription();
    }
})();