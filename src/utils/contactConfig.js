import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Ghost, 
  Music2 
} from 'lucide-react';

export const contactDetails = {
  address: "Dakar, Sénégal",
  googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Dakar,+Senegal",
  email: "contact@kayjokko.com",
  phones: [
    "77 277 19 17",
    "77 082 11 11", 
    "76 572 91 91", 
    "70 843 83 83"
  ],
  openingHours: {
    week: "Lundi - Samedi",
    time: "08h30 - 18h30",
    sunday: "Fermé"
  }
};

export const socialLinks = [
  { 
    name: 'Facebook', 
    icon: Facebook, 
    url: 'https://www.facebook.com/share/17GW6yjsvf/', 
    color: 'bg-[#1877F2]', 
    textColor: 'text-white' 
  },
  { 
    name: 'Instagram', 
    icon: Instagram, 
    url: 'https://www.instagram.com/kayjoko.co?igsh=MWZhYXU0cmdhNHljOA==', 
    color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', 
    textColor: 'text-white' 
  },
  { 
    name: 'TikTok', 
    icon: Music2, 
    url: 'https://vm.tiktok.com/ZS9JnGcFuMRf8-4lV5e/', 
    color: 'bg-black', 
    textColor: 'text-white' 
  },
  { 
    name: 'Snapchat', 
    icon: Ghost, 
    url: 'https://www.snapchat.com/add/rttsntv45?share_id=E4nAQ6w9WgI&locale=fr-FR', 
    color: 'bg-[#FFFC00]', 
    textColor: 'text-black' 
  },
  { 
    name: 'LinkedIn', 
    icon: Linkedin, 
    url: 'https://www.linkedin.com/in/mamadou-mouctar-diallo-00255043?utm_source=share_via&utm_content=profile&utm_medium=member_android', 
    color: 'bg-[#0A66C2]', 
    textColor: 'text-white' 
  },
  { 
    name: 'WhatsApp', 
    icon: MessageCircle, 
    url: 'https://whatsapp.com/channel/0029VaDGovY77qVXkTh88P38', 
    color: 'bg-[#25D366]', 
    textColor: 'text-white' 
  },
  { 
    name: 'Twitter', 
    icon: Twitter, 
    url: '#', 
    color: 'bg-[#1DA1F2]', 
    textColor: 'text-white' 
  }
];