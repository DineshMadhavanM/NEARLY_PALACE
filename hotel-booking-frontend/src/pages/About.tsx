import { Building2, Target, Users, ShieldCheck, Mail, MapPin, Code2, Rocket } from "lucide-react";

const About = () => {
    return (
        <div className="min-h-screen bg-slate-50/50 -mt-10 pt-10 pb-20">
            <div className="max-w-6xl mx-auto px-4 space-y-20">

                {/* Hero Section */}
                <section className="text-center space-y-6 pt-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/50 border border-amber-200 text-amber-700 text-sm font-bold uppercase tracking-widest animate-fade-in">
                        <Sparkles className="w-4 h-4" />
                        Our Story
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight font-serif italic">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">Nearly Palace</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
                        Nearly Palace is an online hotel booking management platform designed to simplify the process of finding and reserving nearby hotels and palace accommodations.
                    </p>
                </section>

                {/* Mission & Vision Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[3rem] shadow-luxury border border-slate-100 space-y-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
                        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <Target className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">Our Mission</h3>
                        <p className="text-slate-600 leading-relaxed font-medium italic">
                            Our mission is to make hotel booking convenient for customers while empowering hotel owners with a modern digital solution to manage their properties and grow their business. We strive to provide a fast, reliable, and secure booking experience.
                        </p>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-900">
                            <Rocket className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-bold text-white">Our Vision</h3>
                        <p className="text-slate-400 leading-relaxed font-medium italic">
                            Founded with a vision to create a user-friendly and secure platform that connects customers and hotel owners seamlessly. We focus on delivering a professional, efficient, and scalable reservation system using modern web technologies.
                        </p>
                    </div>
                </section>

                {/* Platform Features Section */}
                <section className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 font-serif italic">Experience the Nearly Palace Way</h2>
                        <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {[
                            { icon: Building2, title: "Curated Stays", desc: "Handpicked hotels and palaces chosen for their unique charm and luxury." },
                            { icon: ShieldCheck, title: "Secure Booking", desc: "Trusted payment integration and instant booking confirmation for peace of mind." },
                            { icon: Users, title: "Owner Focused", desc: "Empowering property owners with powerful tools to manage listings and guests." }
                        ].map((f, i) => (
                            <div key={i} className="space-y-4">
                                <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
                                    <f.icon className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900">{f.title}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Founder Section */}
                <section className="bg-white rounded-[4rem] shadow-luxury border border-slate-100 overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="w-full md:w-1/2 p-10 md:p-20 space-y-8">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-tighter">
                                The Architect
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Dinesh Madhavan</h2>
                                <h4 className="text-xl font-bold text-amber-600">Founder & Full Stack Developer</h4>
                            </div>
                            <p className="text-slate-600 text-lg leading-relaxed font-medium italic">
                                "Nearly Palace was born from a desire to bridge the gap between travelers seeking luxury and hotel owners seeking efficiency. My vision is to deliver a professional, scalable, and seamless reservation experience through cutting-edge web technologies."
                            </p>
                            <div className="flex items-center gap-6 pt-4">
                                <div className="flex items-center gap-2 text-slate-500 font-bold">
                                    <Code2 className="w-5 h-5 text-amber-500" />
                                    Full Stack Expertise
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 font-bold">
                                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                                    Security First Mindset
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 h-[400px] md:h-[600px] relative group">
                            <img
                                src="/Dinesh.jpeg"
                                alt="Dinesh Madhavan"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                            <div className="absolute bottom-10 left-10 p-8 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 text-white">
                                <p className="text-sm font-bold opacity-70 uppercase tracking-widest mb-1">Based in</p>
                                <p className="text-2xl font-bold flex items-center gap-2">
                                    <MapPin className="w-6 h-6 text-amber-500" />
                                    Theni, Tamil Nadu
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="text-center py-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-5xl font-black italic tracking-tight">Ready to Connect?</h2>
                        <p className="text-xl text-white/90 font-medium max-w-2xl mx-auto">
                            Whether you're a traveler looking for a palace or an owner ready to list, we're here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                            <a href="mailto:madhavandineshm17@gmail.com" className="bg-white text-orange-600 px-10 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all transform hover:scale-105 shadow-xl flex items-center gap-3">
                                <Mail className="w-5 h-5" />
                                Send an Email
                            </a>
                            <div className="flex items-center gap-3 text-white font-bold text-lg">
                                <MapPin className="w-6 h-6" />
                                Theni, Tamil Nadu, India
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

// Simple Sparkles component for decoration
const Sparkles = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
);

export default About;
