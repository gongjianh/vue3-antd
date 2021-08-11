import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { loadEnv } from "vite";

const CWD = process.cwd();
// https://vitejs.dev/config/
export default ({ command, mode }) => {
  const { VITE_BASE_URL } = loadEnv(mode, CWD);
  return {
    base: VITE_BASE_URL,
    plugins: [vue()],
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "./src"),
        },
      ],
    },
    server: {
      port: 3000,
      proxy: {
        "/wgm-account": {
          target: "http://120.26.87.100",
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, '/api/v1')
        },
        "/wgm-web": {
          target: "http://192.168.0.191:8084",
          changeOrigin: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {},
          javascriptEnabled: true,
        },
        scss: {},
      },
    },
    build: {
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: true,
        },
      },
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          // manualChunks(id) {
          //     const arr = id.split('/')
          //     const index = arr.findIndex(el => el == 'node_modules')
          //     if (id.includes('node_modules')) {
          //         return arr[index + 1];
          //     }
          // }
        },
      },
    },
  };
};
