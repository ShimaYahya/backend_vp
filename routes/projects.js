// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');

// const projectController = require('../controllers/projectsController');
// const { isAuthenticatedAdmin } = require('../middlewares/isAuthentuicated');


// // إعداد multer لتخزين الصور
// // const storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //         cb(null, path.join(__dirname, '../public/uploads'));
// //     },
// //     filename: function (req, file, cb) {
// //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// //         cb(null, uniqueSuffix + path.extname(file.originalname));
// //     }
// // });

// // const upload = multer({ storage: storage });

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
//     }
// })
// const acceptedFile = function (req, file, cb) {
//     const acceptedMimetypes = [
//         'image/jpeg',
//         'image/jpg',
//         'image/png'
//     ]
//     if (acceptedMimetypes.includes(file.mimetype)) {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }
// const imgUploader = multer({
//     storage: storage,
//     fileFilter: acceptedFile,
//     limits: { fileSize: 5000000 }
// })



// router.get('/', projectController.index); 
// router.post('/', isAuthenticatedAdmin, imgUploader.single('photo'), projectController.add); 
// router.get('/:id', projectController.show); 
// router.put('/:id', isAuthenticatedAdmin, imgUploader.single('photo'), projectController.update);
// router.delete('/:id', isAuthenticatedAdmin, projectController.delete);

// module.exports = router;



const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const projectController = require('../controllers/projectsController');
const { isAuthenticatedAdmin } = require('../middlewares/isAuthentuicated');

// ✅ إعداد التخزين على Cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'project_images', // اسم مجلد الصور في Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  }
});

const imgUploader = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ✅ المسارات
router.get('/', projectController.index);
router.post('/', isAuthenticatedAdmin, imgUploader.single('photo'), projectController.add);
router.get('/:id', projectController.show);
router.put('/:id', isAuthenticatedAdmin, imgUploader.single('photo'), projectController.update);
router.delete('/:id', isAuthenticatedAdmin, projectController.delete);

module.exports = router;
