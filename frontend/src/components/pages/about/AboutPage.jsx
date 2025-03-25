import React from 'react';
import { FaRocket, FaUsers, FaHandshake, FaArrowRight } from 'react-icons/fa';
import Footer from '../../components/Footer'; // Assuming your modern Footer component

const AboutPage = () => {
    return (
        <div className="font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\" fill-rule=\"evenodd\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"3\"/%3E%3Ccircle cx=\"13\" cy=\"13\" r=\"3\"/%3E%3C/g%3E%3C/svg%3E')" }}></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                        About HireMe
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-10 animate-fade-in-delay">
                        Connecting talent with opportunity through innovation and passion since 2025.
                    </p>
                    <a
                        href="#"
                        className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-md animate-fade-in-delay"
                    >
                        Join Us Today
                    </a>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fade-in">Our Mission</h2>
                        <p className="text-lg text-gray-600 leading-relaxed animate-fade-in-delay">
                            At HireMe, we’re dedicated to bridging the gap between job seekers and employers. Our mission is to create a seamless, empowering platform that transforms the way people find work and build teams—making every career step meaningful and every hire exceptional.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                            alt="Team working together"
                            className="rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500"
                        />
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-gray-200 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-gray-900 text-center mb-16 animate-fade-in">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FaRocket className="text-indigo-600 text-4xl" />,
                                title: 'Innovation',
                                description: 'We push boundaries with cutting-edge technology to redefine hiring.',
                            },
                            {
                                icon: <FaUsers className="text-purple-600 text-4xl" />,
                                title: 'Community',
                                description: 'Building a supportive network for job seekers and employers alike.',
                            },
                            {
                                icon: <FaHandshake className="text-blue-600 text-4xl" />,
                                title: 'Integrity',
                                description: 'Transparency and trust guide every interaction on our platform.',
                            },
                        ].map((value, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-delay"
                            >
                                <div className="mb-4">{value.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-4xl font-bold text-gray-900 text-center mb-16 animate-fade-in">Meet Our Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        {
                            name: 'Md Ramjan Khan',
                            role: 'Founder & Developer',
                            // image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                            image: 'https://res.cloudinary.com/dzeepo7ec/image/upload/v1742913644/IMG_20241026_171210_fugcnq.jpg',
                        },
                        {
                            name: 'Praveen Kumar',
                            role: 'Tester',
                            // image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                            image: 'https://res.cloudinary.com/dzeepo7ec/image/upload/v1742913969/praveen_apipn5.jpg'
                        },
                        {
                            name: 'Eklavya Kumar Prasad',
                            role: 'Co-Developer',
                            image: 'https://res.cloudinary.com/dzeepo7ec/image/upload/v1742914131/Eklavya_fd2mnl.jpg'
                        },
                        {
                            name:'Ayush Kumar',
                            role: 'Marketing Manager',
                            image: 'https://res.cloudinary.com/dzeepo7ec/image/upload/v1742914124/aysuh_jmkbqk.jpg',
                        },
                    ].map((member, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-delay"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-gray-600">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call-to-Action Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">
                        Ready to Join HireMe?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto animate-fade-in-delay">
                        Whether you’re seeking your next career move or the perfect hire, we’re here to make it happen.
                    </p>
                    <a
                        href="#"
                        className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-md flex items-center justify-center mx-auto w-fit animate-fade-in-delay"
                    >
                        Get Started <FaArrowRight className="ml-2" />
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutPage;