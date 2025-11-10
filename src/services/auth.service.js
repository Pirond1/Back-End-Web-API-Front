import api from "./api.service";
    
export default class AuthService {

    async authenticate (dados) {
        try{
            const result = await api.post('/api/login/auth', dados);

            if (result){
                localStorage.setItem("access_token", result.data.access_token)
                localStorage.setItem("usuario", dados.usuario)
                return true;
            }

        } catch (error) {
            console.error("Erro na autenticação: ", error);
            return false
        }
        return false;
    }

    async register (dados) {
        try {
            await api.post("/api/login", dados);
            return true;
        }catch (error){
            console.error("Erro no cadastro: ", error)
            return false;
        }
    }

    usuarioAutenticado () {
        return localStorage.getItem("access_token") !== undefined ? true : false;
    }

    getUsuario () {
        return localStorage.getItem("usuario");
    }

    getToken () {
        return localStorage.getItem("access_token");
    }
    
    async logout () {
        localStorage.removeItem("access_token");
        localStorage.removeItem("usuario");
    }
}