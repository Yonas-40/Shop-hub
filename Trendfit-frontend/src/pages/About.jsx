import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        About <span className="text-indigo-600">ShopHub</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Sweden's Trusted Marketplace for Local Buyers and Sellers
                    </p>
                </div>

                {/* Content Card */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-12 px-6 sm:px-12 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Our Swedish Marketplace Story
                        </h2>
                        <p className="text-indigo-100 text-lg max-w-3xl mx-auto">
                            Connecting communities, empowering businesses, and simplifying shopping across Sverige
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="py-12 px-6 sm:px-12 lg:px-16 space-y-12">
                        {/* Story Section */}
                        <section className="space-y-6">
                            <div className="flex items-center mb-6">
                                <div className="h-1 w-12 bg-indigo-500 rounded-full mr-4"></div>
                                <h3 className="text-2xl font-bold text-gray-800">Our Journey</h3>
                            </div>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    Founded in Stockholm in 2020, ShopHub began as a passion project to revolutionize e-commerce in Sweden.
                                    We recognized the need for a platform that combines the convenience of online shopping with the
                                    authenticity of local Swedish businesses.
                                </p>
                                <p>
                                    What started as a small team of e-commerce enthusiasts has grown into Sweden's fastest-growing
                                    marketplace, serving thousands of customers and hundreds of local sellers every day.
                                </p>
                            </div>
                        </section>

                        {/* Mission Section */}
                        <section className="space-y-6">
                            <div className="flex items-center mb-6">
                                <div className="h-1 w-12 bg-indigo-500 rounded-full mr-4"></div>
                                <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
                            </div>
                            <div className="space-y-4">
                                <p className="text-gray-700 leading-relaxed">
                                    We're committed to building Sweden's most trusted marketplace by:
                                </p>
                                <ul className="grid md:grid-cols-2 gap-4">
                                    {[
                                        "Empowering local Swedish businesses to thrive online",
                                        "Providing customers with quality products from trusted sellers",
                                        "Creating a seamless shopping experience with Swedish values at heart",
                                        "Fostering sustainable e-commerce practices",
                                        "Supporting Swedish artisans and craftspeople",
                                        "Building a community, not just a marketplace"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Values Section */}
                        <section className="space-y-6">
                            <div className="flex items-center mb-6">
                                <div className="h-1 w-12 bg-indigo-500 rounded-full mr-4"></div>
                                <h3 className="text-2xl font-bold text-gray-800">Why ShopHub Stands Out</h3>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    {
                                        title: "Local Focus",
                                        icon: "🏡",
                                        desc: "Over 70% of our sellers are Swedish-based businesses and artisans"
                                    },
                                    {
                                        title: "Quality Assurance",
                                        icon: "✨",
                                        desc: "Rigorous vetting process to ensure product quality and seller reliability"
                                    },
                                    {
                                        title: "Community First",
                                        icon: "👥",
                                        desc: "Regular local events and initiatives to connect buyers and sellers"
                                    },
                                    {
                                        title: "Swedish Values",
                                        icon: "🇸🇪",
                                        desc: "Sustainability, transparency, and fairness at our core"
                                    },
                                    {
                                        title: "Easy Returns",
                                        icon: "🔄",
                                        desc: "Hassle-free 30-day return policy on most items"
                                    },
                                    {
                                        title: "Secure Payments",
                                        icon: "🔒",
                                        desc: "Bank-level security for all transactions"
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="bg-gray-50 p-6 rounded-xl">
                                        <div className="text-3xl mb-3">{item.icon}</div>
                                        <h4 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h4>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Team CTA */}
                        <section className="bg-indigo-50 rounded-xl p-8 md:p-10 mt-12">
                            <div className="max-w-3xl mx-auto text-center">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Join Our Growing Community</h3>
                                <p className="text-gray-700 mb-6">
                                    Whether you're looking to shop Swedish-made products or grow your local business online,
                                    we'd love to have you as part of the ShopHub family.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <Link
                                        to="#"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
                                    >
                                        Become a Seller
                                    </Link>
                                    <Link
                                        to="#"
                                        className="bg-white hover:bg-gray-100 text-indigo-600 font-medium py-3 px-6 rounded-lg border border-indigo-200 transition duration-200"
                                    >
                                        Contact Our Team
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Back Link */}
                        <div className="text-center pt-8">
                            <Link
                                to="/home"
                                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Homepage
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;