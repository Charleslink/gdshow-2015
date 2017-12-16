/*global module:false*/
module.exports = function(grunt) {

  //liveReload默认端口号，你也改成你想要的端口号
  var lrPort = 35729;

  //使用connect-livereload，生成一个LiveReload脚本
  //<script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
  var lrSnippet = require('connect-livereload')({port: lrPort});
  //使用middleware(中间件)，就必须关闭LiveReload的浏览器插件
  var lrMiddleware = function(connect, options){
    return [
      //把脚本，注入到静态文件中
      lrSnippet,
      //静态文件服务器的路径
      connect.static(options.base[0]),
      //启用目录浏览(相当于IIS中的目录浏览)
      connect.directory(options.base[0])
    ];
  };

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    connect: {
      options: {
        //服务器端口号
        port: 8000,
        //服务器地址(可以使用主机名localhost，也可以使用IP地址)
        hostname: '192.168.1.101',
        //物理路径(默认为".",即根目录),注使用.或者..时可能会返回403 Forbidden,此时将值改为相对路径，如/grunt/reloard
        base: '.'
      },
      livereload: {
        options:{
          //通过livereload脚本，让页面重新加载
          middleware: lrMiddleware
        }
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      client: {
        //我们不需要配置额外的任务，watch任务已经内建LiveReload浏览器刷新的代码片段
        options: {
          livereload: lrPort
        },
        //'**'表示包含所有的子目录
        //'*'表示包含所有的文件
        files: ['*.html', 'js/*', 'style/*', 'images/**/*']
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  //grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify', 'watch', 'connect']);
  grunt.registerTask('live', ['connect', 'watch']);

};
