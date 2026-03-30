import app from "./src/app.js";
import syncDatabase from "./src/db/sync.js";

const startServer = async () =>{
    try {
        await syncDatabase();
        app.listen(3000, ()=>{
            console.log("corriendo el servidor");
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();