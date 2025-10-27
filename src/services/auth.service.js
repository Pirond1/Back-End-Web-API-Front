import api from "./api.service";
    
export default class AuthService {

    async authenticate (dados) {
        const result = await api.post('/api/Seguranca', dados);

        if (result){
            localStorage.setItem("access_token", result.data.access_token)
            localStorage.setItem("usuario", dados.user)

            return true;
        }

        return false;
    }

    usuarioAutenticado () {
        return localStorage.getItem("access_token") != undefined ? true : false;
    }

    getUsuario () {
        return localStorage.getItem("usuario");
    }

    getToken () {
        return localStorage.getItem("acess_token");
    }
    
    async logout () {
        localStorage.removeItem("access_token");
        localStorage.removeItem("usuario");
    }
}