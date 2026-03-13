import React from 'react';
import { motion } from 'framer-motion';
import { Target, Heart, Rocket, Users, Award, Briefcase, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

function About() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const teamMembers = [
    {
      name: "Amadou Diallo",
      role: "Fondateur & CEO",
      image: "https://images.unsplash.com/photo-1493882552576-fce827c6161e?auto=format&fit=crop&w=400&q=80",
      desc: "Visionnaire passionné par la technologie et l'entrepreneuriat en Afrique."
    },
    {
      name: "Fatou Diop",
      role: "Directrice Marketing",
      image: "https://images.unsplash.com/photo-1479800800845-03752b6188fa?auto=format&fit=crop&w=400&q=80",
      desc: "Experte en communication digitale avec 10 ans d'expérience."
    },
    {
      name: "Jean Ndiaye",
      role: "Responsable Logistique",
      image: "https://images.unsplash.com/photo-1679086952106-8d21924e56c8?auto=format&fit=crop&w=400&q=80",
      desc: "Assure que vos colis arrivent à temps, partout au Sénégal."
    },
    {
      name: "Aïssatou Sow",
      role: "Service Client",
      image: "https://images.unsplash.com/photo-1700902894527-c1ef530d814c?auto=format&fit=crop&w=400&q=80",
      desc: "Toujours à l'écoute pour garantir votre satisfaction totale."
    }
  ];

  const stats = [
    { label: "Clients Heureux", value: "50 000+", icon: Users },
    { label: "Produits", value: "10 000+", icon: ShoppingBag },
    { label: "Commandes", value: "100 000+", icon: Briefcase },
    { label: "Satisfaction", value: "98%", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1611154376393-dc7c3f518fc8?auto=format&fit=crop&w=1920&q=80" 
            alt="Kayjoko Office" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003D7A]/90 to-[#001a33]/80 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            À PROPOS DE KAYJOKO
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-100 font-light"
          >
            Votre partenaire de confiance pour tous vos besoins
          </motion.p>
        </div>
      </div>

      {/* Histoire Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            {...fadeInUp}
            className="flex-1 space-y-6"
          >
            <h2 className="text-3xl font-bold text-[#003D7A] relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/2 after:h-1 after:bg-[#003D7A]">
              NOTRE HISTOIRE
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Fondée en 2020 au Sénégal, KAYJOKO est née d'une vision simple : rendre le commerce en ligne accessible, fiable et rapide pour tous les Africains.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Ce qui a commencé comme une petite startup dans un garage à Dakar est aujourd'hui devenu l'une des plateformes de référence pour l'achat de produits électroniques, de mode et d'équipement maison. Nous avons traversé les défis de la logistique et de la confiance numérique pour bâtir une communauté fidèle de plus de 50 000 clients.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Aujourd'hui, KAYJOKO continue d'innover pour vous offrir une expérience d'achat inégalée, avec une livraison express et un service client dévoué.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1531497684310-0f15276c39ab?auto=format&fit=crop&w=800&q=80" 
                alt="L'équipe Kayjoko" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Valeurs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                icon: Target, 
                title: "Notre Mission", 
                text: "Offrir les meilleurs produits aux meilleurs prix, avec une expérience client exceptionnelle.",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              { 
                icon: Heart, 
                title: "Nos Valeurs", 
                text: "Qualité, Confiance, et Innovation sont au cœur de tout ce que nous entreprenons.",
                color: "text-red-500",
                bg: "bg-red-50"
              },
              { 
                icon: Rocket, 
                title: "Notre Vision", 
                text: "Être le leader incontesté du e-commerce en Afrique de l'Ouest d'ici 2030.",
                color: "text-purple-600",
                bg: "bg-purple-50"
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                className="flex flex-col items-center text-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className={`p-4 rounded-full ${item.bg} mb-6`}>
                  <item.icon className={`w-10 h-10 ${item.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres Section */}
      <section className="py-16 bg-[#003D7A] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 opacity-80" />
                <h3 className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</h3>
                <p className="text-sm md:text-base opacity-90 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#003D7A] mb-4">NOTRE ÉQUIPE</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Des passionnés qui travaillent chaque jour pour vous servir.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg group"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-[#003D7A] font-medium text-sm mb-3 uppercase">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partenaires Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-10 opacity-70">NOS PARTENAIRES DE CONFIANCE</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className="text-2xl font-black text-gray-400 select-none">PARTENAIRE {i}</div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#003D7A] to-[#001a33] text-white text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">REJOIGNEZ-NOUS DÈS AUJOURD'HUI</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10">Découvrez une nouvelle façon de faire vos achats en ligne avec Kayjoko.</p>
          <Link to="/products">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-[#003D7A] font-bold rounded-full shadow-xl hover:bg-gray-100 transition-colors text-lg"
            >
              DÉCOUVRIR NOS PRODUITS
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

export default About;