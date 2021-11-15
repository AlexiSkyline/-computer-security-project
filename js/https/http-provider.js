const url = 'http://localhost:3000/api';

export const createUser = async ( informationUser ) => {
    const urlNewUser = url + '/users/register';
    const { userName, email, password, rol } = informationUser;

    try {
        const request = await axios.post( urlNewUser, {
            userName,
            email,
            password,
            rol
        });
        
        return request.data;
    } catch (error) {
        return error.response.data;
    }
}

export const authUser = async ( informationUser ) => {
    const urlAuthUser = url + '/users/auth';
    const {  email, password } = informationUser;

    try {
        const request = await axios.post( urlAuthUser, {
            email: email,
            password: password
        });

        return request.data;
    } catch (error) {
        return error.response.data;
    }
}

export const addEncryptedText = async ( informationText ) => {
    const urlAddEncryptedText = url + '/texts';
    const { encrytedText, algorithm, idCreator } = informationText;

    try {
        const request = await axios.post( urlAddEncryptedText, {
            encrytedText,
            algorithm, 
            idCreator
        });

        return request.data;
    } catch (error) {
        return error.response.data;
    }
} 

export const addEncryptedDocument = async ( informationDocument ) => {
    const urlAddEncryptedDocument = url + '/documents';
    const { encrytedDocument, algorithm, idCreator } = informationDocument;

    try {
        const request = await axios.post( urlAddEncryptedDocument, {
            encrytedDocument,
            algorithm, 
            idCreator
        });

        return request.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getEncryptedTexts = async ( id ) => {
    const urlGetEncryptedTexts = url + `/texts/${ id }`;
    
    try {
        const request = await axios.get( urlGetEncryptedTexts );

        return request.data;
    } catch (error) {
        return error.response.data;
    }
}

export const deleteEncryptedText = async ( idText, idCreator ) => {
    const urlDeleteEncryptedTexts = url + `/texts/${ idText }`;

    try {
        const request = await axios.delete( urlDeleteEncryptedTexts, {
            idCreator
        });

        return request.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getEncryptedDocuments = async ( id ) => {
    const urlGetEncryptedDocuments = url + `/documents/${ id }`;
    
    try {
        const request = await axios.get( urlGetEncryptedDocuments );

        return request.data;
    } catch (error) {
        return error.response.data;
    }
}

export const deleteEncryptedDocument = async ( idDocument, idCreator ) => {
    const urlDeleteEncryptedDocument = url + `/documents/${ idDocument }`;

    try {
        const request = await axios.delete( urlDeleteEncryptedDocument, {
            idCreator
        });

        return request.data;
    } catch (error) {
        return error.response.data;
    }
}