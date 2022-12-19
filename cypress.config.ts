import {defineConfig} from "cypress";


export default defineConfig({
    video: false,
    modifyObstructiveCode: false,
    e2e: {
        setupNodeEvents(on, config) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            on('before:browser:launch', (browser = {}, launchOptions) => {
                console.log('launching browser %s is headless? %s', browser.name, browser.isHeadless);

                // the browser width and height we want to get
                // our screenshots and videos will be of that resolution
                const width = 1920;
                const height = 1080;

                console.log('setting the browser window size to %d x %d', width, height);

                if (browser.name === 'chrome' && browser.isHeadless) {
                    launchOptions.args.push(`--window-size=${width},${height}`);
                }

                if (browser.name === 'electron' && browser.isHeadless) {
                    // fullPage screenshot size
                    launchOptions.preferences.width = width;
                    launchOptions.preferences.height = height;
                }

                if (browser.name === 'firefox' && browser.isHeadless) {
                    launchOptions.args.push(`--width=${width}`);
                    launchOptions.args.push(`--height=${height}`);
                }

                // CI may have problems with gpu acceleration; example
                //    - ERROR:gpu_memory_buffer_support_x11.cc(44)] dri3 extension not supported.
                if (browser.isHeadless)
                    if (browser.family === 'chromium') {
                        launchOptions.args.push('--disable-gpu');
                        launchOptions.args.push('--disable-software-rasterizer');
                        launchOptions.args.push('--no-sandbox');
                        console.log('Setting chromium family launch options to disable gpu, software rasterizer, and sandbox.');
                    }

                return launchOptions;
            });
        },
        baseUrl: "http://localhost:1234",
        specPattern: 'cypress/e2e/**/*.spec.ts',
        supportFile: "cypress/support/e2e.ts",
        viewportHeight: 1000,
        viewportWidth: 1280,
    },
});
