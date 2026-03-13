import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { contactDetails, socialLinks } from '@/utils/contactConfig';

function Footer() {
  const primaryPhone = contactDetails.phones[0];
  const logoUrl = "https://horizons-cdn.hostinger.com/3ce8dc60-b7b9-4247-9062-c4256906ec88/cd9315c19120632cfaec726c40b67aec.jpg";

  return (
    <footer className="bg-[#003D7A] text-white pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 border-b border-blue-800 pb-8">
             <div className="mb-6 md:mb-0">
               <Link to="/">
                 <img src={logoUrl} alt="KAYJOKKO.com Logo" className="w-[120px] md:w-[100px] lg:w-[120px] rounded" />
               </Link>
               <p className="mt-4 text-blue-200 text-sm max-w-xs">
                 La qualité au bon prix, la confiance en plus.
               </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Useful Links */}
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">LIENS UTILES</h4>
            <ul className="space-y-3 text-xs md:text-sm">
              <li>
                <Link to="/" className="hover:underline hover:text-orange-400 transition-colors block">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline hover:text-orange-400 transition-colors block">
                  Boutique / Produits
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline hover:text-orange-400 transition-colors block">
                  Contact
                </Link>
              </li>
              <li>
                 <a href="#" className="hover:underline hover:text-orange-400 transition-colors block">Politique de confidentialité</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">CONTACT</h4>
            <ul className="space-y-4 text-xs md:text-sm">
              <li>
                <a href={contactDetails.googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-orange-400 transition-colors group">
                  <MapPin size={16} className="shrink-0 mt-0.5 group-hover:animate-bounce" />
                  <span>{contactDetails.address}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${primaryPhone.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-orange-400 transition-colors">
                  <Phone size={16} className="shrink-0" />
                  <span>+221 {primaryPhone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contactDetails.email}`} className="flex items-center gap-3 hover:text-orange-400 transition-colors">
                  <Mail size={16} className="shrink-0" />
                  <span>{contactDetails.email}</span>
                </a>
              </li>
               <li className="flex items-start gap-3">
                <Clock size={16} className="shrink-0 mt-0.5" />
                <span>{contactDetails.openingHours.week}: {contactDetails.openingHours.time}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">CATÉGORIES</h4>
            <ul className="space-y-3 text-xs md:text-sm">
              {['Électronique', 'Mode', 'Maison', 'Beauté'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/category/all?search=${item}`}
                    className="hover:underline hover:text-orange-400 transition-colors block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">RÉSEAUX SOCIAUX</h4>
            <div className="flex gap-4 flex-wrap">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#003D7A] transition-all duration-300"
                    title={social.name}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 pt-8 text-center">
          <p className="text-[10px] opacity-80">
            © 2026 KAYJOKKO. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;