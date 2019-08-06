let pug = require("pug");
let gulp = require("gulp");
let fs = require("fs");
let liveserver = require("live-server");

let pugConf =  [
    {
        entry: "./src/resume/index.pug",
        output: "./docs/resume.html"
    },
    {
        entry: "./src/index/index.pug",
        output: "./docs/index.html"
    }
]

gulp.task("build", () => {
    let promises = pugConf.map(conf => {
        let out = pug.renderFile(conf.entry);
        return new Promise((resolve, reject) => 
            fs.writeFile(conf.output, out, err => err ? reject(err) : resolve()));
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