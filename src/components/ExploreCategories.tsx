'use client';
import Image from "next/image";
import Link from "next/link";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const categories = [
    {
        id: 1,
        name: "Accommodation",
        image: "/categories/accomodation.jpg",
        link: "/categories/accommodation"
    },
    {
        id: 2,
        name: "Dining",
        image: "/categories/culinary.jpg",
        link: "/categories/culinary"
    },
    {
        id: 3,
        name: "Wellness",
        image: "/categories/wellness.jpg",
        link: "/categories/wellness"
    },
    {
        id: 4,
        name: "Entertainments",
        image: "/categories/entertainment.jpg",
        link: "/categories/entertainment"
    }
];

export default function ExploreCategories() {
    return (
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#222831] mb-3">Explore Categories</h2>
                <div className="w-20 h-1 bg-[#E76F51] mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="group relative h-76 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all 
                        duration-300 transform hover:-translate-y-1"
                    >
                        <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex flex-col items-start justify-between gap-2">
                                <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                                <p className="text-white/90 text-sm">Explore the best of {category.name} experiences</p>
                                <Link
                                    href={category.link}
                                    className="px-4 py-2 bg-[#E76F51] text-white text-sm font-semibold rounded-full 
                                    hover:bg-[#FFB366] transition-colors duration-200 flex items-center gap-1"
                                >
                                    Explore
                                    <KeyboardArrowRightIcon sx={{ color: "white" }} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}