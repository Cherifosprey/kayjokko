import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ImageGallery({ images, productName }) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200 shadow-sm group">
        <AnimatePresence mode='wait'>
          <motion.img
            key={mainImage}
            src={mainImage}
            alt={productName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </AnimatePresence>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMainImage(img)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
              mainImage === img ? 'border-kayjoko-blue ring-2 ring-kayjoko-blue/20' : 'border-transparent'
            }`}
          >
            <img 
              src={img} 
              alt={`${productName} thumbnail ${index + 1}`} 
              className="h-full w-full object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;