import React from 'react';
import { Helmet } from 'react-helmet';
import BenefitsBar from '@/components/BenefitsBar';
import HeroSection from '@/components/HeroSection';
import ProductsGridSection from '@/components/ProductsGridSection';
import FeaturedProductsBanner from '@/components/FeaturedProductsBanner';
import SavingsSection from '@/components/SavingsSection';
import NewProductsSection from '@/components/NewProductsSection';
import BestSalesSection from '@/components/BestSalesSection';
import SmartphoneTrendsSection from '@/components/SmartphoneTrendsSection';
import ClientReviewsSection from '@/components/ClientReviewsSection';
import BlogSection from '@/components/BlogSection';
import { seoPages } from '@/utils/seoConfig';

function HomePage() {
  return (
    <>
      <Helmet>
        <title>{seoPages.home.title}</title>
        <meta name="description" content={seoPages.home.description} />
        <meta name="keywords" content={seoPages.home.keywords} />
      </Helmet>

      <div className="bg-white min-h-screen">
        <BenefitsBar />
        <HeroSection />
        <ProductsGridSection />
        <FeaturedProductsBanner />
        <SavingsSection />
        <NewProductsSection />
        <BestSalesSection />
        <SmartphoneTrendsSection />
        <ClientReviewsSection />
        <BlogSection />
      </div>
    </>
  );
}

export default HomePage;