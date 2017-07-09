var gulp = require('gulp');
var os = require('os');
var connect = require('gulp-connect'),
    port = 2001;
var openurl = require('open');
// 获取本机内网ip
function getLocalIps(flagIpv6) {
    var ifaces = os.networkInterfaces();
    var ips = [];
    var func = function(details) {
        if (!flagIpv6 && details.family === 'IPv6') {
            return;
        }
        if (details.address =='127.0.0.1') {
            return;
        }
        ips.push(details.address);
    };
    for (var dev in ifaces) {
        ifaces[dev].forEach(func);
    }
    return ips;
};

gulp.task('html', function () {
    gulp.src('./src/*.html')
        .pipe(connect.reload());
});
gulp.task('watchHtml', function () {
    gulp.watch(['./src/*.html','./src/css/*.css','./src/js/*.js'], ['html']);
});

// 开启本地服务器，port默认是5000，代理设置自行配置
gulp.task('server', function() {
    var hostIp = getLocalIps()[0];
    connect.server({
        livereload: true,
        root: "./",
        host: hostIp,
        port: port
    });

    openurl(`http://${hostIp}:${port}/src/index.html`);
});

// 生成发布
gulp.task('build',function(callback){
    runSequence('clean','copyIntro','handlerAssets','revImg','rePathImgUrl','copyImg','revCss','revjs','revall');
});

//本地服务器和监听文件改动
gulp.task('default',['server','watchHtml']);

