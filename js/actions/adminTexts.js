import { crypto, storageService } from "../classes/index.js";
import { getEncryptedTexts } from "../https/http-provider.js";

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
        informationUserSession = storageService.getSession();

        validateData();

        containerInfoText.addEventListener( 'click', getText );
        buttonClear.addEventListener( 'click', clearDescription );
    });

    async function validateData () {
        const { texts } = await getEncryptedTexts( 1 ); 
        infoTexts = texts;
        console.log( texts );
        createHTML ( texts );
    }   

    function createHTML ( infoTexts ) {
        infoTexts.forEach( ( infoText ) => {
            const rowText = document.createElement( 'tr' );
            const { id, encrytedText, algorithm, Creator, state } = infoText;

            if( state ) {
                rowText.innerHTML = `
                <td scope="col" class="text-center">${ id }</td>
                <td class="text-center">${ encrytedText.substring( 0, 8 ) }.....</td>
                <td class="text-center">${ algorithm === 'tripledes' ? 'TripleDes' : 'Rabbit' }</td>
                <td class="text-center">${ Creator }</td>
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
    }

    function showDecryptedText ( infoText, decryptedText ) {
        creatorName.innerText = `${ infoText.Creator }`;
        typeAlgorithm.innerText = `${ infoText.algorithm === 'tripledes' ? 'TripleDes' : 'Rabbit' }`;
        dateCreation.innerText = `${ infoText.createdAt.substring( 0, infoText.createdAt.indexOf( 'T' ) ) }`;
        formTextArea.value = decryptedText;
    } 

    function clearDescription ( e ) {
        e.preventDefault();

        creatorName.innerText = '';
        typeAlgorithm.innerText = '';
        dateCreation.innerText = '';
        formTextArea.value = '';
    }
})();