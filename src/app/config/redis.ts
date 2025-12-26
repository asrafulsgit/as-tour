import { createClient } from 'redis';
import { envs } from './env';

export const redisClient = createClient({
    username: envs.REDIS_USERNAME,
    password: envs.REDIS_PASS,
    socket: { 
        host: envs.REDIS_HOST,
        port: Number(envs.REDIS_PORT)
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

export const redisConnection = async()=>{
    if(!redisClient.isOpen){
        await redisClient.connect();
    }
}