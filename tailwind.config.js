/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html'],
    theme: {
        extend: {
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            colors: {
                primary: '#0ea5e9', // Azure modrá
                dark: '#0f172a',    // Tmavé pozadí
                darker: '#020617'
            }
        }
    }
}
