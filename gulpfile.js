var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var qiniu = require('gulp-qiniu');
var pkg = require('./package.json');
var qiniuCfg = require('./qiniu.config.json');
var join = require('path').join;
var cdn = require('./config/cdn.cfg');


gulp.task('clean', function(cb) {
    return del(['dist/**'], cb);
});



gulp.task('img', ['clean'], function() {
    return gulp.src([
        'img/**'
    ], {
        base: '.'
    }).pipe(gulp.dest('dist'));
});




gulp.task('publish:production', function() {
    var res = {};
    res.accessKey = qiniuCfg.cfg.accessKey;
    res.secretKey = qiniuCfg.cfg.secretKey;
    res.private = false;
    res.bucket = cdn.production.BUCKET;
    return gulp.src('dist/**').pipe(qiniu(res, {
        dir: join('/', cdn.production.BUCKET, ('newtonVue-vue-online-' + cdn.production.VERSION))
    }));

});

gulp.task('publish:development', function() {
    var res = {};
    res.accessKey = qiniuCfg.cfg.accessKey;
    res.secretKey = qiniuCfg.cfg.secretKey;
    res.private = false;
    res.bucket = cdn.development.BUCKET;
    return gulp.src('dist/**').pipe(qiniu(res, {
        dir: join('/', cdn.development.BUCKET, ('newtonVue-vue-test-' + cdn.development.VERSION))
    }));

});


gulp.task('publish:img', ['clean', 'img'], function() {
    var res = {};
    res.accessKey = qiniuCfg.cfg.accessKey;
    res.secretKey = qiniuCfg.cfg.secretKey;
    res.private = false;
    res.bucket = "qkz-static-production";
    return gulp.src('dist/**').pipe(qiniu(res, {
        dir: join('/', "qkz-static-production/", "newtonVue-vue-img-v1")
    }));

});






