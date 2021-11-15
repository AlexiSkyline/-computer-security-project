import { crypto, storageService } from "../classes/index.js";
import { deleteEncryptedText, getEncryptedDocuments, getEncryptedTexts } from "../https/http-provider.js";
import { showAlert } from "./globalFunctions.js";

( function (){
    let informationUserSession;
    const containerInfoDocument = document.querySelector( '.container__info-document' );
    const formTextArea = document.querySelector( '.form-text-area' );
    const creatorName = document.querySelector( '.creator__name span' ); 
    const typeAlgorithm = document.querySelector( '.type__algorithm span' );
    const dateCreation = document.querySelector( '.date__creation span' );
    const buttonClear = document.querySelector( '.clear' );

    let infoDocuments = [];

    function verifySession ( session ) {
        const header        = document.querySelector( '.contaner__header' );
        const spinner       = document.querySelector( '.sk-circle' );
        const containerMain = document.querySelector( '.container_main' );
        
        if( !session || session.rol === 'encriptador' ) {
            location.href = 'login.html';
        } else {
            informationUserSession = session;
            
            setTimeout(() =>{
                spinner.style.display       = 'none';
                header.style.display        = 'block';
                containerMain.style.display = 'block';
            }, 1500 );
        }
    }

    function LogOut () {
        localStorage.removeItem( 'userSession' );
        location.href = 'login.html';
    }

    document.addEventListener ( 'DOMContentLoaded', () => {
        const buttonLogOut = document.querySelector( '.button__log-out' );
        const session = storageService.getSession();
        verifySession( session );

        validateData();

        showUserName();

        // containerInfoDocument.addEventListener( 'click', getText );
        buttonClear.addEventListener( 'click', ( e ) => {
            e.preventDefault();
            clearDescription();
        });

        buttonLogOut.addEventListener( 'click', LogOut );
    });

    function showUserName () {
        const userName = document.querySelector( '.user__name' );
        
        userName.innerHTML = informationUserSession.userName;
    }

    async function validateData () {
        const { documents } = await getEncryptedDocuments( informationUserSession.id ); 
        infoDocuments = documents;
        createHTML ( documents );
    }   

    function createHTML ( infoDocuments ) {
        infoDocuments.forEach( ( infoDocument ) => {
            console.log( infoDocument );
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
})();