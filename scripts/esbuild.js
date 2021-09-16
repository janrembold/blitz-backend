const { build } = require('esbuild');
const path = require('path');

const ES_BUILD_CONFIG = {
  entryPoints: [
      path.join('lambda', 'postgraphile', 'index.ts'),
  ],
  external: ['pg-native'],
  bundle: true,
  loader: {
    '.ttf': 'file',
    '.svg': 'file',
    '.png': 'dataurl',
  },
  minify: true,
  platform: 'node',
  outdir: 'lambda/dist',
  sourcemap: true,
  target: 'node14',
  treeShaking: true,
};

const startBuild = async () => {
  try {
    await build(ES_BUILD_CONFIG);
  } catch (error) {
    console.error('Build Failed!', error);
  }
};

startBuild();
