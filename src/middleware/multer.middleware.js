import multer from 'multer';
import {nanoid} from 'nanoid';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = nanoid(10)+"__"+file.originalname;
      cb(null, uniqueSuffix);
    }
  })
  
  export const upload = multer({ storage })