import AuthService from "../service/Auth.service.js";

class AuthController {
    static async login(req, res){
        try {
            
            const token = await AuthService.auth(req.body);
            res.status(201).json({
                message: "se logeo",
                token
            })
        } catch (error) {
            return res.status(400).json({
                message: error.message  || "no se creo el Docente"
            });
        }
    }
}

export default AuthController;