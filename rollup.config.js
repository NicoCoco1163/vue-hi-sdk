/**
 * @file   : install.js
 * @author : NicoCoco1163
 * @created: 2019-3-26 17:50:33
 */

const path = require('path');
const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const terser = require('rollup-plugin-terser').terser;

const resolve = p => path.resolve(__dirname, p);
const {author, version} = require('./package.json');

const banner = '/*!\n'
    + ` * VueHiSdk v${version}\n`
    + ` * (c) 2014-${new Date().getFullYear()} ${author}\n`
    + ' */';

const builds = {
    'web-esm': {
        dest: resolve('dist/native.esm.js'),
        format: 'es'
    },
    'web-umd-dev': {
        dest: resolve('dist/native.js'),
        moduleName: 'Native',
        format: 'umd'
    },
    'web-umd-prod': {
        dest: resolve('dist/native.min.js'),
        moduleName: 'Native',
        format: 'umd',
        env: 'production'
    }
};

function cfgFactory(name) {
    const build = builds[name];
    const cfg = {
        input: './src/index.js',
        output: {
            file: build.dest,
            format: build.format,
            name: 'VueHiSdk',
            banner
        },
        plugins: [
            node(),
            commonjs(),
            babel({
                configFile: resolve('.babelrc'),
                exclude: 'node_modules/**',
                runtimeHelpers: true
            })
        ],
        onwarn: (msg, warn) => {
            if (!/Circular/.test(msg)) {
                warn(msg);
            }
        }
    };

    if (build.moduleName) {
        cfg.output.moduleName = build.moduleName;
    }

    if (build.env === 'production') {
        cfg.plugins.push(terser());
    }

    cfg.plugins.push(replace({
        __VERSION__: version
    }));

    return cfg;
}

module.exports = process.env.TARGET
    ? cfgFactory(process.env.TARGET)
    : cfgFactory;
