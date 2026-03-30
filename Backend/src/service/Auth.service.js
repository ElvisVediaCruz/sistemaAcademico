import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import { generarToken } from "../utils/jwt.js";

class AuthService {
    static async auth(data){
        // CAMBIO: id_user → id_usuario porque el nuevo modelo Usuario usa id_usuario como PK
        const user = await User.findOne({
            where: {id_usuario: data.username}
        });
        if (!user){
            return false;
        }
        const existe = await bcrypt.compare(data.password, user.password);
        if(!existe){
            return false
        }
        const token = generarToken({id: data.username, rol: user.rol});
        return token;
    }
}

export default AuthService;
