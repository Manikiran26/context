import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden font-sans"
        >

            {/* Top Corner Decorative Shapes (Glassy Liquid Abstract) */}
            <motion.div
                animate={{
                    y: [0, -15, 0],
                    x: [0, 5, 0],
                    rotate: [0, 2, 0]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] pointer-events-none"
            >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60">
                    <path fill="#D1D5DB" d="M44.7,-76.4C58.1,-69.2,69.5,-57.4,77.3,-44C85.1,-30.7,89.2,-15.3,88.3,-0.51C87.4,14.3,81.5,28.6,73,40.7C64.4,52.8,53.2,62.7,40.5,70.5C27.7,78.3,13.9,83.9,-0.6,85C-15.1,86.1,-30.2,82.7,-43.3,75.1C-56.4,67.6,-67.5,56,-75.4,42.5C-83.3,29.1,-88,14.5,-88,0C-87.9,-14.5,-83.1,-29.1,-74.6,-42C-66.2,-54.9,-54.1,-66.1,-40.4,-73C-26.7,-79.9,-13.3,-82.5,0.7,-83.7C14.7,-85,29.4,-84.9,44.7,-76.4Z" transform="translate(100 100)" className="fill-white/5 blur-sm" />
                </svg>
                <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 rounded-full blur-3xl" />
            </motion.div>

            <motion.div
                animate={{
                    y: [0, 15, 0],
                    x: [0, -5, 0],
                    rotate: [180, 182, 180]
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] pointer-events-none"
            >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60">
                    <path fill="#D1D5DB" d="M44.7,-76.4C58.1,-69.2,69.5,-57.4,77.3,-44C85.1,-30.7,89.2,-15.3,88.3,-0.51C87.4,14.3,81.5,28.6,73,40.7C64.4,52.8,53.2,62.7,40.5,70.5C27.7,78.3,13.9,83.9,-0.6,85C-15.1,86.1,-30.2,82.7,-43.3,75.1C-56.4,67.6,-67.5,56,-75.4,42.5C-83.3,29.1,-88,14.5,-88,0C-87.9,-14.5,-83.1,-29.1,-74.6,-42C-66.2,-54.9,-54.1,-66.1,-40.4,-73C-26.7,-79.9,-13.3,-82.5,0.7,-83.7C14.7,-85,29.4,-84.9,44.7,-76.4Z" transform="translate(100 100)" className="fill-white/5 blur-sm" />
                </svg>
                <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full blur-3xl" />
            </motion.div>

            {/* Bottom Gradient Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-indigo-900/40 to-transparent blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="z-10 flex flex-col items-center"
            >
                {/* Main Title */}
                <h1 className="text-8xl md:text-9xl font-extrabold text-[#F0E6FF] tracking-[0.15em] mb-12 drop-shadow-[0_0_30px_rgba(240,230,255,0.3)] select-none">
                    CONTEXT OS
                </h1>

                {/* 3D Platform Section */}
                <div className="relative mt-8 group cursor-pointer" onClick={() => navigate("/login")}>
                    {/* The Stage / Platform */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="relative"
                    >
                        {/* 3D Box Top */}
                        <div className="w-[450px] h-[80px] bg-[#CACACA] rounded-sm transform-gpu shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center border-t border-white/40 overflow-hidden">
                            {/* Light Sweep Reflection */}
                            <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                    repeatDelay: 1
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            />

                            <span className="text-2xl font-semibold text-[#8B6EAC] tracking-wide flex items-center gap-3 relative z-10">
                                Get started <span className="text-3xl">→</span>
                            </span>
                        </div>

                        {/* 3D Box Front Face (for depth) */}
                        <div className="w-[450px] h-[15px] bg-[#9A9A9A] rounded-b-sm border-t border-black/10 shadow-inner" />

                        {/* Underglow */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-indigo-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Subtle floating particles or noise could go here for that premium feel */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>
    );
}
