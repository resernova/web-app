'use client';
import AssistantIcon from '@mui/icons-material/Assistant';
import Shield from '@mui/icons-material/Shield';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
export default function WhyChoose() {
    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold text-[#E76F51] mb-4">Why Choose Us?</h2>
                    <div className="w-20 h-1 bg-[#E76F51] mx-auto rounded-full mb-4 "></div>
                    <p className="text-lg text-gray-600">Experience the difference with our AI-powered platform for all your booking needs.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <AssistantIcon className="h-10 w-10 text-[#E76F51]" />
                        </div>
                        <h3 className="text-xl text-gray-900 font-semibold mb-2">Smart Reservations</h3>
                        <p className="text-gray-600">Book with ease and confidence using our AI-powered platform.</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <SupportAgentIcon className="h-10 w-10 text-[#E76F51]" />
                        </div>
                        <h3 className="text-xl text-gray-900 font-semibold mb-2">24/7 Support</h3>
                        <p className="text-gray-600">Get assistance whenever you need it with our 24/7 support team.</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Shield className="h-10 w-10 text-[#E76F51]" />
                        </div>
                        <h3 className="text-xl text-gray-900 font-semibold mb-2">Secure Transactions</h3>
                        <p className="text-gray-600">Make payments with confidence using our secure payment gateway.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}