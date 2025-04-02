// unocss.config.ts
import { defineConfig, presetUno, presetIcons, presetAttributify, transformerDirectives } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetAttributify(),
  ],
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    colors: {
      'primary': '#2D5D7C',
      'secondary': '#3A7CA5',
      'accent': '#81C3D7',
      'success': '#A5D6A7',
    }
  },
  shortcuts: {
    'child-btn': 'px-4 py-2 rounded font-bold transition-transform transform hover:scale-105',
    'lesson-card': 'bg-white rounded-lg shadow-lg p-4 mb-4',
    'input-field': 'w-full p-2 border-2 border-gray-200 rounded focus:outline-none focus:border-accent'
  }
});
