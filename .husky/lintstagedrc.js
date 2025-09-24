export default {
  "*.{js,jsx,ts,tsx}": ["prettier --write"],
  "!(package)*.json": ["prettier --write--parser json"],
  "package.json": ["prettier --write"],
  "*.vue": ["prettier --write"],
  "*.{vue,css,scss,postcss,less}": ["prettier --write"],
  "*.md": ["prettier --write"],
};
