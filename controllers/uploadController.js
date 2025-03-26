import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set path to front/public/images folder
const uploadPath = path.join(__dirname,"/uploads");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Images only!'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 50000000 } // 50MB limit
});

const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    
    const filePath = req.file.filename;
    res.status(200).json({
        message: 'File uploaded successfully.',
        image: `public/images/${filePath}` // Changed path to match public URL
    });
};

export { upload, uploadFile };