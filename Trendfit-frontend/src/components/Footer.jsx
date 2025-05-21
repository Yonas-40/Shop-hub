import React from 'react';
import { FaCcPaypal, FaCcVisa, FaCcMastercard, FaCcStripe, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">ShopHub</h3>
                        <p className="text-gray-400 mb-4">
                            Your one-stop destination for all your shopping needs. Quality products, competitive prices, and excellent customer service.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition duration-150 cursor-pointer">
                                <FaFacebookF/>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-150 cursor-pointer">
                                <FaTwitter />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-150 cursor-pointer">
                                <FaInstagram />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-150 cursor-pointer">
                                <FaLinkedinIn />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Shop</h3>
                        <ul className="space-y-2">
                            {['All Products', 'New Arrivals', 'Best Sellers', 'Discounted', 'Categories'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-white transition duration-150 cursor-pointer">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            {['Contact Us', 'FAQs', 'Shipping & Returns', 'Track Order', 'Privacy Policy'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-white transition duration-150 cursor-pointer">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact Info</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mt-1 mr-3 text-indigo-400"/>
                                <span className="text-gray-400">Villagatan 29, Svanesund, 440 92</span>
                            </li>
                            <li className="flex items-center">
                                <FaPhone className="mr-3 text-indigo-400"/>
                                <span className="text-gray-400">+46 031-3858483</span>
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="mr-3 text-indigo-400"/>
                                <span className="text-gray-400">support@shophub.com</span>
                            </li>
                        </ul>
                        <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">We Accept</h4>
                            <div className="flex space-x-3">
                                <FaCcVisa className="text-2xl text-gray-400" />
                                <FaCcMastercard className="text-2xl text-gray-400" />
                                <FaCcStripe className="text-2xl text-gray-400"/>
                                <FaCcPaypal className="text-2xl text-gray-400"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-10 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
                        </p>
                        <div className="mt-4 md:mt-0">
                            <ul className="flex space-x-6">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-150 cursor-pointer">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-150 cursor-pointer">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-150 cursor-pointer">
                                        Cookie Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
