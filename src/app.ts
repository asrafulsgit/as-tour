import express,{ Application } from "express";
import cors from 'cors';
import { router } from "./app/routes/routes";
import { globalErrorHandle } from "./app/middlewares/globalError";


const app : Application = express();

app.use(express.json())
app.use(cors())

app.use('/api/v1',router);


app.use(globalErrorHandle);

export default app;