import ESBuild, { BuildOptions } from 'esbuild'
import path from 'path'
import { CleanPlugin } from './plugins/CleanPlugin'
import { HTMLPlugin } from './plugins/HTMLPlugin'
const mode = process.env.MODE || 'development'

const isDev = mode === 'development'
const isProd = mode === 'production'

function resolveRoot(...segments: string[]) {
    return path.resolve(__dirname, '..', '..', ...segments)
}

const config: BuildOptions = {
    outdir: resolveRoot('build'),
    entryPoints: [resolveRoot('src', 'index.jsx')],
    entryNames: '[dir]/bundle.[name]-[hash]',
    allowOverwrite: true,
    bundle: true,
    tsconfig: resolveRoot('tsconfig.json'),
    minify: isProd,
    sourcemap: isDev,
    metafile: true, // как подставлять соотвествующие скрипты в html файлик
    loader: { 
        '.png': 'file',
        '.svg': 'file',
        '.jpg': 'file',
    },
    plugins: [
        CleanPlugin, 
        HTMLPlugin({
            title: 'Viking Title',
        })
    ],
}

export default config;