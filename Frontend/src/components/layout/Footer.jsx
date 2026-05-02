import React from 'react';
import { motion } from 'framer-motion';
import { Bus, MapPin, Mail, Twitter, Github, Linkedin, Heart } from 'lucide-react';
//INSTALL npm install framer-motion / npm install lucide-react
const Footer = () => {
    return (
    <footer className="relative border-t border-white/10 bg-[#070320] text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
        
          {/* Brand */}
            <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center">                
            <Bus className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-2xl">BusWay</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
                Moderniser les transports publics grâce au suivi en temps réel 
                et à un routage intelligent. Conçu pour la communauté.
            </p>
            <div className="flex space-x-4">
                <motion.a 
                whileHover={{ scale: 1.1 }}
                href="#" 
                className="p-2 rounded-full bg-white/5 hover:bg-teal-500/20 hover:text-teal-400 transition-all"
            >
                <Twitter className="w-5 h-5" />
            </motion.a>
            <motion.a 
                whileHover={{ scale: 1.1 }}
                href="#" 
                className="p-2 rounded-full bg-white/5 hover:bg-teal-500/20 hover:text-teal-400 transition-all"
            >
                <Github className="w-5 h-5" />
            </motion.a>
            <motion.a 
                whileHover={{ scale: 1.1 }}
                href="#" 
                className="p-2 rounded-full bg-white/5 hover:bg-teal-500/20 hover:text-teal-400 transition-all"
            >
                <Linkedin className="w-5 h-5" />
            </motion.a>
            </div>
        </div>

          {/* Links */}
        <div>
            <h4 className="font-bold text-lg mb-6 ">Links</h4>
            <ul className="space-y-3 text-gray-400">
                <li><a href="/home" className="hover:text-teal-400 transition-colors">Home</a></li>
                <li><a href="/about" className="hover:text-teal-400 transition-colors">About</a></li>
                <li><a href="/services" className="hover:text-teal-400 transition-colors">Services</a></li>
                <li><a href="/contact" className="hover:text-teal-400 transition-colors">Contact</a></li>
            </ul>
        </div>

          {/* Contact */}
        <div>
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-3 text-gray-400">
                <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-teal-400" />
                <span className="hover:text-teal-400 transition-colors">contact@busway.app</span>
            </li>
            <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span className="hover:text-teal-400 transition-colors">Morocco</span>
            </li>
            </ul>
        </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
            © 2026 BusWay. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-4 md:mt-0 flex items-center">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1 fill-current" /> by Wiam, Safae & Taha
            </p>
        </div>
        </div>
    </footer>
    );
};

export default Footer;