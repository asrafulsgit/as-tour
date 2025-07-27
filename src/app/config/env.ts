
import dotenv from 'dotenv';

dotenv.config();

interface EnvsConfig {
    PORT : string,
    MONGODB_URL : string,
    NODE_ENV : string
}

const envsLoading = () : EnvsConfig =>{
     const properties : string[] = ['MONGODB_URL','PORT','NODE_ENV'];

     properties.forEach((key)=>{
        if(!process.env[key]){
            throw new Error (`Missing env variable ${key}`)
        }
     })
    
     return {
            PORT : process.env.PORT as string,
            MONGODB_URL : process.env.MONGODB_URL as string,
            NODE_ENV : process.env.NODE_ENV as 'development' | 'production'
        }
}



export const envs  = envsLoading();

