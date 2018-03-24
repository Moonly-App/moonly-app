import buble from 'rollup-plugin-buble'
import json from 'rollup-plugin-json'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
	entry: './src/index.js',
	plugins: [
		json(),
		nodeResolve({ jsnext: true, main: true }),
		buble(),
	],
	format: 'iife',
	moduleName: 'ScrollReveal',
	dest: './.ignore/sandbox/js/scrollreveal.js',
}
