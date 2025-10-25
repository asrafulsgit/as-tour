import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', err => console.log('Redis Client Error', err));

export const redisConnection = async()=>{
    if(!redisClient.isOpen){
        await redisClient.connect();
    }
}