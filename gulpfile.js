let pug = require("pug");
let gulp = require("gulp");
let fs = require("fs");
let liveserver = require("live-server");
let pdf = require("pdf-puppeteer");
let flags = require("yargs")
    .option("pdf", {default: true})
    .argv;

console.log(flags)
// let puppeteer = require("pupeeteer");

let pugConf =  [
    {
        entry: "./src/resume/index.pug",
        output: "./docs/resume.html",
        pdf: "./docs/resume.pdf"
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

        return new Promise((resolve, reject) => {
            pdf(pug.renderFile(conf.entry), file => {
                fs.writeFile(conf.pdf, file, err => err ? reject(err) : resolve())
            });
        })
    }));

    return Promise.all(promises);
});

gulp.task("pdf", () => {
    let promises = pugConf.map(conf => {
        if(typeof conf.pdf !== 'string') {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            pdf(pug.renderFile(conf.entry), file => {
                fs.writeFile(conf.pdf, file, err => err ? reject(err) : resolve())
            });
        })
    });

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