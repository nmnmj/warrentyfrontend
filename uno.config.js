// uno.config.ts
import { defineConfig, presetUno, presetIcons, presetAttributify } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(), // Default utility classes
    presetIcons(), // Icon support
    presetAttributify(), // Attribute-based styling
  ],
});
