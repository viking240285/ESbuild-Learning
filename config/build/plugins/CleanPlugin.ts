import { Plugin } from 'esbuild';
import { rm } from 'fs/promises'; // это асинхронные функции для работы с файловой системой 

export const CleanPlugin: Plugin = {
    name: 'CleanPlugin',
    setup(build) {
      build.onStart(async () => {
        try {
          const outdir = build.initialOptions.outdir;
          if (outdir) {
            // console.log(outdir);
            await rm(outdir, { recursive: true });
            
          }
        } catch (e) {
          console.log('Не удалось очитить папку');
          
        }
      })

    },
  }