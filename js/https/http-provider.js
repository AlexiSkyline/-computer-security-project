const url = 'http://localhost:3000/api';

export const createUser = async ( usuario ) => {
    const urlNewUser = url + '/users/register';

    const { userName, email, password, rol } = usuario;

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