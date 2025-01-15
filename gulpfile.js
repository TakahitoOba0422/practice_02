const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass')); // gulp-sassを使用
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber'); // エラー時にタスクを止めない

// Sassのコンパイルタスク
gulp.task('sass', () => {
  return gulp.src('html/common/css/sass/page/*.scss') // Sassファイルのソース
    .pipe(
      sass({
        includePaths: ['html/common/css/sass/page'], // 必要な場合にパスを指定
        silenceDeprecations: ['legacy-js-api'],
      }).on('error', sass.logError) // gulp-sass を使用したエラーハンドリング
    )
    .pipe(rename({ extname: '.css' })) // 拡張子を.cssに変更
    .pipe(gulp.dest('html/common/css')); // 出力先
});

// EJSのコンパイルタスク
gulp.task('ejs', () => {
  return gulp
    .src(['html/ejs/**/*.ejs', '!html/ejs/**/_*.ejs']) // サブディレクトリも含む全てのEJSファイルを対象
    .pipe(plumber()) // エラー時にタスクを止めない
    .pipe(ejs({}, { root: 'html/ejs' }, { ext: '.html' })) // EJSをHTMLにコンパイル
    .pipe(rename({ extname: '.html' })) // 拡張子を.htmlに変更
    .pipe(gulp.dest('html')); // 出力先
});

// 変更を監視するタスク
gulp.task('watch', () => {
  // Sassファイルの変更を監視
  gulp.watch('html/common/css/sass/**/*.scss', gulp.series('sass'));
  // EJS直下とcomponents配下の変更を監視
  gulp.watch(['html/ejs/*.ejs', 'html/ejs/components/**/*.ejs'], gulp.series('ejs'));
});

// デフォルトタスク
gulp.task('default', gulp.series('sass', 'ejs', 'watch'));
