import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 5173
    },
    test: {
        environment: 'jsdom',
        setupFiles: './src/test-setup.js',
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            reportsDirectory: './coverage',
            include: ['src/utils/*.js', 'src/components/*.jsx'],
            exclude: ['src/main.jsx', 'src/**/*.test.jsx'],
            thresholds: {
                statements: 70,
                branches: 70,
                functions: 70,
                lines: 70
            }
        }
    }
});
