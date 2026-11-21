import {defineConfig} from 'vite';
import {resolve} from 'node:path';
export default defineConfig({base:'./',build:{rollupOptions:{input:{index:resolve(import.meta.dirname,'index.html'),apply:resolve(import.meta.dirname,'apply.html'),selected:resolve(import.meta.dirname,'selected.html')}}}});
