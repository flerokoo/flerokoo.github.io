let pug = require("pug");
let gulp = require("gulp");
let fs = require("fs");
let liveserver = require("live-server");
let puppeteer = require("puppeteer");
let flags = require("yargs")
    .option("pdf", {default: true})
    .options("keep-browser", {default: false})
    .argv;

let browser = null;

let pugConf =  [
    {
        entry: "./src/resume/index.pug",
        output: "./docs/resume.html",
        pdf: "./docs/resume.pdf",
        pdfOptions: {
            format: "A4",
            headerTemplate: "",
            footerTemplate: "",
            margin: {
                top: "2cm",
                bottom: "2cm",
                left: "1.8cm",
                right: "1.8cm"
            }
        }
    },
    {
        entry: "./src/index/index.pug",
        output: "./index.html"
    }
];

gulp.task("build", () => {
    let promises = pugConf.map(conf => {
        let out = pug.renderFile(conf.entry);
        return new Promise((resolve, reject) => 
            fs.writeFile(conf.output, out, err => err ? reject(err) : resolve()));
    });

    promises.concat(pugConf.map(conf => {
        if(typeof conf.pdf !== 'string' || flags.pdf === false) {
            return Promise.resolve();
        }

        return new Promise(async (resolve, reject) => {
            let prefix = 'data:text/html,';
            let html = pug.renderFile(conf.entry);

            if (browser === null) {
                browser = await puppeteer.launch();
            }

            let page = await browser.newPage();
            
            await page.setContent(html, { waitUntil: 'networkidle2'});

            await page.pdf({
                path: conf.pdf,
                ...(conf.pdfOptions || {})
            });

            await page.close();

            resolve();
        })
    }));

    return Promise.all(promises);
});


gulp.task("watch", () => {
    gulp.watch("./src/**/*", gulp.series("build"));
});

gulp.task("serve", () => {
    liveserver.start()
})

gulp.task("start", gulp.series("build", gulp.parallel("watch", "serve")));

gulp.task("default", gulp.series("start"))