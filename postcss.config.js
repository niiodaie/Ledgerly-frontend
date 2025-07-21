import postcssOklabFunction from 'postcss-oklab-function';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    postcssOklabFunction(),
    tailwindcss(),
    autoprefixer(),
  ],
};
