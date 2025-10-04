import {Server} from 'http';
import mongoose from 'mongoose';
import app from './app';
import { envs } from './app/config/env';

let server : Server ;



const initServer = async()=>{
    try {
        await mongoose.connect(envs.MONGODB_URL);
        
        server = app.listen(envs.PORT,()=>{
            console.log(`Server is running at ${envs.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

initServer();

process.on("unhandledRejection",(err)=>{
    console.log('unhandledRejection',err);

    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
    process.exit(1);
})


process.on("uncaughtException",(err)=>{
    console.log('uncaughtException', err);

    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
    process.exit(1);
})

process.on('SIGTERM',()=>{
    console.log('SIGTERM error');

    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
    process.exit(1);
})

process.on('SIGINT',()=>{
    console.log('SIGINT : Stop the server gracefully...');
    
    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
    process.exit(1);
})
