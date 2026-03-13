import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function BlogCard({ article, index }) {
  const { toast } = useToast();

  const handleReadMore = () => {
    toast({
      title: "🚧 Article complet à venir",
      description: "La page complète de l'article sera bientôt disponible!",
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <Calendar className="w-4 h-4" />
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-kayjoko-blue transition-colors">
          {article.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <Button
          onClick={handleReadMore}
          variant="ghost"
          className="text-kayjoko-blue hover:text-kayjoko-light-blue font-semibold p-0 h-auto group/btn"
        >
          Lire plus
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </motion.article>
  );
}

export default BlogCard;