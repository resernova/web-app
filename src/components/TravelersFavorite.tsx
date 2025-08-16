'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/styles/swiper-custom.css';
import Image from 'next/image';
import Link from 'next/link';

interface ExperienceCardProps {
    id: number;
    image: string;
    title: string;
    location: string;
    review: string;
    description: string;
    category: string;
    price: number;
    currency?: string;
}

const experiences: ExperienceCardProps[] = [
    {
        id: 1,
        image: '/images/experience-1.jpg',
        title: 'Sunset Desert Safari',
        location: 'Marrakech',
        review: '4.5',
        description: 'Experience the magic of the desert with an unforgettable sunset safari, complete with traditional dinner and cultural performances.',
        category: 'Entertainment',
        price: 89.99,
        currency: 'USD',
    },
    {
        id: 2,
        image: '/images/experience-1.jpg',
        title: 'Mountain Hiking Adventure',
        location: 'Marrakech',
        review: '4.5',
        description: 'Challenge yourself with a guided hiking tour through breathtaking mountain trails and enjoy panoramic views.',
        category: 'Entertainment',
        price: 75.50,
        currency: 'USD',
    },
    {
        id: 3,
        image: '/images/experience-1.jpg',
        title: 'Cultural City Tour',
        location: 'Marrakech',
        review: '4.5',
        description: 'Discover the rich history and culture of the city with our expert local guides.',
        category: 'Entertainment',
        price: 65.00,
        currency: 'USD',
    },
    {
        id: 4,
        image: '/images/experience-1.jpg',
        title: 'Beach Getaway',
        location: 'Marrakech',
        review: '4.5',
        description: 'Relax and unwind at the most beautiful beaches with crystal clear waters and white sand.',
        category: 'Entertainment',
        price: 55.75,
        currency: 'USD',
    },
    {
        id: 5,
        image: '/images/experience-1.jpg',
        title: 'Food Tasting Tour',
        location: 'Marrakech',
        review: '4.5',
        description: 'Savor the local cuisine with our guided food tour through the city\'s best eateries.',
        category: 'Entertainment',
        price: 45.00,
        currency: 'USD',
    },
];

const ExperienceCard = ({ image, title, category, location, review, price, currency = 'USD' }: ExperienceCardProps) => (
    <div className="group bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative h-56 w-full overflow-hidden">
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <button className="w-full py-2 bg-white/90 text-[#E76F51] rounded-lg font-medium hover:bg-white transition-colors">
                    View Details
                </button>
            </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1 text-[#E76F51]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {location}
                </div>
                <div className="flex items-center bg-[#E76F51]/10 px-2 py-1 rounded-full">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-800">{review}</span>
                </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3 p-1 w-30 bg-gray-200 
            border-1 rounded-full border-gray-300">{category}</p>
            <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-xs text-gray-500">From</span>
                        <p className="text-xl font-bold text-[#E76F51]">
                            {currency} <span className="text-2xl">{price.toFixed(2)}</span>
                        </p>
                    </div>
                    <button className="px-5 py-2.5 bg-[#E76F51] text-white rounded-lg hover:bg-[#d45f41] transition-colors text-sm font-medium shadow-md hover:shadow-lg">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default function TravelersFavorite() {
    return (
        <section className="py-16 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Travelers' Favorite Experiences</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-[#E76F51] to-[#F4A261] mx-auto md:mx-0 rounded-full"></div>
                    </div>
                    <Link
                        href="/experiences"
                        className="inline-flex items-center justify-center px-6 py-2.5 border-2 border-[#E76F51] text-[#E76F51] rounded-lg hover:bg-[#E76F51] hover:text-white transition-all duration-300 text-sm font-medium group"
                    >
                        <span>View All Experiences</span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
                <div className="relative">
                    <Swiper
                        modules={[Navigation, A11y]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 30
                            },
                        }}
                        className="pb-16 px-1"
                    >
                        {experiences.map((experience) => (
                            <SwiperSlide key={experience.id} className="h-auto">
                                <div className="h-full p-3">
                                    <ExperienceCard {...experience} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#E76F51] hover:bg-[#E76F51] hover:text-white transition-colors -ml-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                    <div className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#E76F51] hover:bg-[#E76F51] hover:text-white transition-colors -mr-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}