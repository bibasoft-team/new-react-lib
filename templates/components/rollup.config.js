import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import image from '@rollup/plugin-image';
import multi from '@rollup/plugin-multi-entry';

export default {
    input: {
        include: ['src/**/*.ts', 'src/**/*.tsx'],
        exclude: ["../src/**/*.stories.tsx"]
    },
    output: [
        {
            dir: "build",
            format: "cjs",
            sourcemap: true
        }
    ],
    preserveModules: true,
    plugins: [
        multi(),
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({ useTsconfigDeclarationDir: true }),
        postcss(),
        image()
    ]
};