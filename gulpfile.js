const gulp = require('gulp')
const imagemin = require('gulp-imagemin')
const smartCrop = require('./gulp-smartcrop-plugin')

gulp.task('default', () =>
	gulp.src('images/*.jpg')
        .pipe(smartCrop({
            width: 200,
            height: 200
        }))
        .pipe(imagemin([
            imagemin.jpegtran()
        ]))
		.pipe(gulp.dest('dist/'))
)