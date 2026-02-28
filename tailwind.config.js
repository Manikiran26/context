/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0B0F19",
                surface: "#111827",
                surfaceHover: "#1F2937",
                border: "#374151",
                primary: {
                    DEFAULT: "#00D4FF",
                },
                node: {
                    context: "#00D4FF",
                    notes: "#A855F7",
                    tasks: "#22C55E",
                    files: "#06B6D4",
                    team: "#F97316",
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
            }
        },
    },
    plugins: [],
}
