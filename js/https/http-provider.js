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