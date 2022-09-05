import { Plugin } from 'esbuild';
import { rm, writeFile } from 'fs/promises'; // это асинхронные функции для работы с файловой системой 
import path from 'path'

interface HTMLPluginOptions {
    template?: string;
    title?: string;
    jsPath?: string[];
    cssPath?: string[];
}

const renderHTML = (options: HTMLPluginOptions): string => {
    return options.template || `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${options.title}</title>
            ${options?.cssPath?.map(path => `<link rel="stylesheet" href=${path}>`).join(" ")} 
        </head>
        <body>
            <div id="root"></div>
            ${options?.jsPath?.map(path => `<script src=${path}></script>`).join(" ")}  <!-- ?. chainig operator -->
            <script>
                const evtSource = new EventSource('http://localhost:3000/subscribe');
                evtSource.onopen = function() {console.log('open')}
                evtSource.onerror = function() {console.log('error')}
                evtSource.onmessage = function() {
                    console.log('onmessage');
                    window.location.reload();
                }
            </script>
        </body>
        </html>`
}

const preparePath = (outputs: string[]) => {
    return outputs.reduce<Array<string[]>>((acc, path) => {
        const [js, css] = acc;
        const splittedFileName = path.split('/').pop();

        if(splittedFileName?.endsWith('.js')) {
            js.push(splittedFileName)
        } else if(splittedFileName?.endsWith('.css')) {
            css.push(splittedFileName)
        }

        return acc;
    }, [[], []])
}

export const HTMLPlugin = (options: HTMLPluginOptions): Plugin => {
    return {
        name: 'HTMLPlugin',
        setup(build) {
        const outdir = build.initialOptions.outdir;
        
        build.onStart(async () => {
            try {
            if (outdir) {
                // console.log(outdir);
                await rm(outdir, { recursive: true });
                
            }
            } catch (e) {
            console.log('Не удалось очитить папку');
            
            }
        })
        build.onEnd( async (result) => {
            const outputs = result.metafile?.outputs;
            const [jsPath, cssPath] = preparePath( Object.keys(outputs || {}) )
            if(outdir) {
                await writeFile( 
                    path.resolve( outdir, 'index.html'),
                    renderHTML({ jsPath, cssPath, ...options })
                )
            }
        })

        },
    }
}