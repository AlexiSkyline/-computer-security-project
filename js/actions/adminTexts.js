import { crypto, storageService } from "../classes/index.js";
import { deleteEncryptedText, getEncryptedTexts } from "../https/http-provider.js";
import { LogOut, showAlert, showUserName, verifySession } from "./globalFunctions.js";

( function (){
    let informationUserSession;
    const containerInfoText = document.querySelector( '.container__info-text' );
    const formTextArea = document.querySelector( '.form-text-area' );
    const creatorName = document.querySelector( '.creator__name span' ); 
    const typeAlgorithm = document.querySelector( '.type__algorithm span' );
    const dateCreation = document.querySelector( '.date__creation span' );
    const buttonClear = document.querySelector( '.clear' );

    let infoTexts = [];

    document.addEventListener ( 'DOMContentLoaded', () => {
        const buttonLogOut = document.querySelector( '.button__log-out' );
        const session = storageService.getSession();
        verifySession( session, 'encriptador' ) && ( informationUserSession = verifySession( session, 'encriptador' ) );

        validateData();

        showUserName( informationUserSession.userName );

        containerInfoText.addEventListener( 'click', getText );
        buttonClear.addEventListener( 'click', ( e ) => {
            e.preventDefault();
            clearDescription();
        });

        buttonLogOut.addEventListener( 'click', LogOut );
    });

    async function validateData () {
        const { texts } = await getEncryptedTexts( informationUserSession.id ); 
        infoTexts = texts;
        
        createHTML ( texts );
    }   

    function createHTML ( infoTexts ) {
        infoTexts.forEach( ( infoText ) => {
            const rowText = document.createElement( 'tr' );
            const { id, encrytedText, algorithm, Creator, state, createdAt } = infoText;
            rowText.classList.add( `body__text${ id }` );

            if( state ) {
                rowText.innerHTML = `
                <td scope="col" class="text-center">${ id }</td>
                <td class="text-center">${ encrytedText.substring( 0, 8 ) }.....</td>
                <td class="text-center">${ algorithm === 'tripledes' ? 'TripleDes' : 'Rabbit' }</td>
                <td class="text-center">${ Creator }</td>
                <td class="text-center">${ createdAt.substring( 0, createdAt.indexOf( 'T' ) ) }</td>
                <td class="text-center"><a href="#" class="text-success"  title="Desencriptar" data-id="${id}"><i class="bi bi-body-text"></i></a></td>
                <td class="text-center"><a href="#" class="text-danger" title="Eliminar" data-id="${id}"><i class="bi bi-trash"></i></a></td>
                `;
                containerInfoText.appendChild( rowText );
            }
        });
    }

    function getText ( e ) {

        if( e.target.classList.contains( 'bi-body-text' ) ) {
            const id = e.target.parentElement.getAttribute( 'data-id' );
            
            const infoText = infoTexts.filter( text => text.id === parseInt( id ) );

            const decryptedText = crypto.textDecryption( infoText[0].encrytedText, infoText[0].algorithm );
           
            showDecryptedText( infoText[0], decryptedText );
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

    function showDecryptedText ( infoText, decryptedText ) {
        creatorName.innerText = `${ infoText.Creator }`;
        typeAlgorithm.innerText = `${ infoText.algorithm === 'tripledes' ? 'TripleDes' : 'Rabbit' }`;
        dateCreation.innerText = `${ infoText.createdAt.substring( 0, infoText.createdAt.indexOf( 'T' ) ) }`;
        formTextArea.value = decryptedText;
    } 

    function clearDescription () {
        creatorName.innerText = '';
        typeAlgorithm.innerText = '';
        dateCreation.innerText = '';
        formTextArea.value = '';
    }

    async function sendRequestDelete( id ) {
        const request = await deleteEncryptedText( id, informationUserSession.id );
        showAlert( request.msg );
    }

    function clearHTML ( id ) {
        const bodyText = document.querySelector( `.body__text${ id }` );
        bodyText.remove();
        clearDescription();
    }
})();