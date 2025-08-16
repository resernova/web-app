import { useState } from 'react';
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const ReseAIChat = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed bottom-24 right-8 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 animate-fadeIn">
        <div className="bg-[#E76F51] text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
                <SmartToyIcon className="mr-2" />
                <h3 className="font-bold">ReseAI Assistant</h3>
            </div>
            <button 
                onClick={onClose}
                className="text-white hover:bg-white/20 p-1 rounded-full"
                aria-label="Close chat"
            >
                <CloseIcon fontSize="small" />
            </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto max-h-96">
            <div className="mb-4">
                <div className="bg-gray-100 p-3 rounded-lg inline-block max-w-xs">
                    <p className="text-sm">Hello! I'm ReseAI, your personal booking assistant. How can I help you find today?</p>
                </div>
            </div>
        </div>
        <div className="p-4 border-t border-gray-200">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <input
                    type="text"
                    placeholder="Ask me anything about bookings..."
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
                />
                <button className="ml-2 text-[#E76F51] hover:text-[#d45f41] p-1">
                    <SendIcon fontSize="small" />
                </button>
            </div>
        </div>
    </div>
);

export default function HeroSection() {
    const [showChat, setShowChat] = useState(false);

    return (
        <section className="relative flex items-center justify-center min-h-[80vh] w-full text-center overflow-hidden">
            <div className=" absolute inset-0 w-full h-full z-0">
                <Image
                    src="/hero-section.jpg"
                    alt="Morocco Experiences"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 w-full h-full z-0 bg-black opacity-50"></div>
            </div>

            <div className="relative top-5 z-10 w-full max-w-6xl px-4 py-20 mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#FCFBF4] mb-8 leading-tight drop-shadow-lg max-w-4xl mx-auto">
                    Discover & Book <span className="text-[#FFB366]">Morocco's</span> Finest Experiences
                </h1>

                <p className="text-lg sm:text-xl text-white/100 mb-10 max-w-2xl mx-auto leading-relaxed">
                    From luxury hotels to authentic restaurants, relaxing spas to exciting events - all in one place.
                </p>

                <form className="w-full max-w-2xl mx-auto bg-white/95 rounded-full shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                    <div className="flex items-center px-6 py-3">
                        <SearchIcon className="h-5 w-5 text-[#222831] mr-3 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search hotels, restaurants, spas, events..."
                            className="flex-1 bg-transparent outline-none border-none text-[#222831] text-lg placeholder-[#222831] font-medium"
                            aria-label="Search for experiences"
                        />
                        <button
                            type="submit"
                            className="ml-2 px-6 py-2.5 rounded-full font-bold bg-[#FFB366] text-[#222831] hover:bg-[#E76F51] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <span>Search</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </form>

                <div className="flex flex-wrap justify-center gap-4 mt-10 px-4">
                    {["Smart Matching", "Instant Booking", "Authenticated Experience"].map((feature, index) => (
                        <div key={index} className="flex items-center bg-white/100 rounded-full 
                            px-5 py-2.5 border border-[#FFB366]/30 transition-all duration-200 group">
                            <span className="text-[#E76F51] font-medium text-sm sm:text-base">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* ReseAI Floating Button */}
            <button 
                onClick={() => setShowChat(true)}
                className="fixed bottom-8 right-8 bg-[#E76F51] hover:bg-[#d45f41] text-white rounded-full p-4 shadow-lg z-40 flex items-center justify-center transition-all duration-200 hover:scale-105"
                aria-label="Chat with ReseAI"
            >
                <SmartToyIcon className="h-6 w-6" />
                <span className="ml-2 font-medium">ReseAI</span>
            </button>

            {/* ReseAI Chat Interface */}
            {showChat && <ReseAIChat onClose={() => setShowChat(false)} />}
        </section>
    );
}
