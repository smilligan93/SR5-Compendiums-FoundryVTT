'use strict';

const browserify = require('browserify');
const tsify = require('tsify');
const gulp = require('gulp');
const fs = require('fs');

gulp.task('default', async function (cb) {
    const b = browserify();
    b.add('module/main.ts');
    b.transform("babelify", {
        presets: [
            "@babel/preset-env",
            "@babel/preset-typescript"
        ],
        plugins: [
            "@babel/plugin-proposal-class-properties",
            ["@babel/plugin-transform-runtime",
                {
                    "regenerator": true
                }
            ]
        ]
    });
    b.plugin(tsify, {});

    b.bundle().pipe(fs.createWriteStream("build/bundle.js", cb));
});