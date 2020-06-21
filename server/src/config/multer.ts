import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {

    storage: multer.diskStorage({

        destination: path.resolve(__dirname, '..','..','uploads'), // direcionamento para pasta uploads
        
        filename(request, file, callback){

            const hash = crypto.randomBytes(6).toString('hex'); //gerando caracter aleatorios 
            
            const fileName = `${request}-${file.originalname}`

            callback(null, fileName);
        }
    }),
};