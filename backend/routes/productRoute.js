import express from 'express'
import { 
    listProducts, 
    addProduct, 
    removeProduct, 
    singleProduct, 
    updateProductStock, 
    toggleProductStatus, 
    updateProduct, 
    updateProductImages,
    managePromotion,
    clearExpiredPromotions 
} from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';

const productRouter = express.Router();

productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
productRouter.post('/remove',adminAuth,removeProduct);
productRouter.post('/single',singleProduct);
productRouter.get('/list',listProducts);
productRouter.post('/update-stock',adminAuth,updateProductStock);
productRouter.post('/toggle-status',adminAuth,toggleProductStatus);
productRouter.post('/update',adminAuth,updateProduct);
productRouter.post('/update-images',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),updateProductImages);

// 促销相关路由
productRouter.post('/promotion/manage',adminAuth,managePromotion);
productRouter.post('/promotion/clear-expired',adminAuth,clearExpiredPromotions);

export default productRouter