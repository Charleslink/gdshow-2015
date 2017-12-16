$.preload_resource = function () {
    var $loading_text = null;
    var resource_list = null;
    var on_complete = null;
    var total = 0;
    var loaded_success = 0;
    var loaded_failed = 0;
    var loaded_count = 0;
    var check_time = 60;
    var init = function (_resource_list, _on_complete, _$loading_text) {
        resource_list = _resource_list;
        if (_on_complete !== undefined) {
            on_complete = _on_complete;
        }
        if (_$loading_text !== undefined) {
            $loading_text = _$loading_text;
        }
        total = resource_list.length;
    };

    var load = function () {
        var i = 0;
        for (; i < resource_list.length; i++) {
            if ($.isArray(resource_list[i])) {
                do_load_one(resource_list[i][0], resource_list[i][1]);
            } else {
                do_load_one('image', resource_list[i]);
            }
        }
    };
    var do_load_one = function (type, url) {
        if (type == 'image') {
            var img = new Image();
            img.onload = function () {
                on_load_one(true);
            };
            img.onerror = function () {
                on_load_one(false);
            };
            img.src = url;
        } else if (type == 'audio') {
            var audio = new Audio(url);
            on_load_one(true);
            audio.load(); // todo(aug) change to onload event
        }
    };
    var on_load_one = function (result) {
        ++loaded_count;
        if (result) {
            loaded_success++;
        } else {
            loaded_failed++;
        }
        if ($loading_text && $.isFunction($loading_text)) {
            $loading_text(loaded_success, loaded_failed, total);
        }
    };
    var check = function () {
        //定时检查加载
        if (0 >= check_time) {
            if (loaded_count / total > .8) {
                complete();
            } else {
                alert('加载图片失败，请返回刷新尝试!');
            }
        } else {
            check_time -= .5;
            if (loaded_count == total) {
                complete();
            } else {
                var _this = this;
                setTimeout(function () {
                    check();
                }, 500);
            }
        }
    };
    var complete = function () {
        if (on_complete) {
            on_complete(loaded_success, loaded_failed, total);
        }
    };
    return function (resource_list, callback, $loading_text) {
        init(resource_list, callback, $loading_text);
        load();
        check();
    };
}();

$(document).ready(function () {
    function app_init() {
        $('.loading').hide();
    }
    window.doughnutChart = function(){
        $("#doughnutChart").drawDoughnutChart([
            { title: "建筑",         value : 10.17,  color: "#b96853" },
            { title: "通信", value:  7.26,   color: "#5fa33d" },
            { title: "金融房产",      value:  9.97,   color: "#1869ad" },
            { title: "政府",        value : 9.06,   color: "#8834ab" },
            { title: "服务",        value : 9.57,   color: "#bababa" },
            { title: "娱乐传媒",        value : 5.6,   color: "#467b9e" },
            { title: "医疗保健",        value : 6.34,   color: "#c95436" },
            { title: "IT",        value : 28.46,   color: "#e8c64c" },
            { title: "营销",        value : 13.57,   color: "#51b9b5" }
        ],{
            percentageInnerCutout: 85,
            edgeOffset: 1,
            segmentShowStroke: false,
            segmentStrokeWidth: 0,
            baseColor: "rgba(0, 0, 0, 0)"
        });
    };
    var myChart = echarts.init(document.getElementById('p7m1'));
    var option = {
            series: [
                {
                    name: '服务菜单调用总量',
                    type: 'pie',
                    radius: ['70%','90%'],
                    selectedMode: true,
                    selectedOffset: 10,
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        
                    },
                    data: [
                        {value: 1, name: '查询类'},
                        {value: 2, name: '活动类'},
                        {value: 2.4, name: '办理类'},
                    ]
                }       
            ]
    }
    var myChar1 = echarts.init(document.getElementById('p8m1'));
    var option1 = {
        series: [
                {
                    name: '图文阅读总量',
                    type: 'pie',
                    radius: ['75%','95%'],
                    selectedMode: true,
                    selectedOffset: 10,
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        
                    },
                    data: [
                        {value: 4, name: '日常图文'},
                        {value: 3, name: '活动图文'}
                    ]
                }       
            ]
    }

    window.css_on_load = function () {
        $('#container').show();
        $.preload_resource(window.app['resource'],
            function (loaded_success, loaded_failed, total) {
                app_init();
            },
            function (loaded_success, loaded_failed, total) {
            });
        window.mySwiper = new Swiper('.swiper-container', {
            loop: false,
            mode: 'vertical',
            resistance: "100%",
            slidesPerView: "auto",
//            moveStartThreshold: 50,
            speed: 1e3,
            onSlideChangeStart: function (swiper, direction) {
                var pre = swiper.previousIndex;
                var cur = swiper.activeIndex;

                var $page = $(swiper.getSlide(cur));
                var $pre = $(swiper.getSlide(pre));
                $pre.removeClass('animate');
                if($pre.attr('id') == 'page-4'){
                    $('.scircle1,.scircle2,.scircle3').removeClass('cur');
                }
                if($pre.attr('id') == 'page-7'){
                    myChart.clear();
                }
                if($pre.attr('id') == 'page-8'){
                    myChart.clear();
                }              
                // if ($page.attr('id') == 'page-6') {
                //     $('.js-p6-bar ').each(function (i, data) {
                //         var $dom = $(data);
                //         var from = $dom.data('from');
                //         $dom.removeClass('bar_animate').css('height', from);
                //     });
                // }
                // if ($page.attr('id') == 'page-10') {
                //     $("#doughnutChart").empty();
                // }
                 $page.addClass('animate');

                 if($page.attr('id') == 'page-4'){
                    $('.bcircle1').click(function(){
                        $('.scircle1').addClass('cur');
                    });
                    $('.bcircle2').click(function(){
                        $('.scircle2').addClass('cur');
                    });
                    $('.bcircle3').click(function(){
                        $('.scircle3').addClass('cur');
                    });
                 }
                 if($page.attr('id') == 'page-7'){
                    myChart.setOption(option);
                    $(".p7m3").click(function(){
                       //myChart.addData([{value:4, name:'其他途径'}]);
                       //alert(1);
                       //myChart.refresh();
                       //myChart.setTheme('infographic');
                       //var se = myChart.getOption().series;
                       //alert(se[0].name);
                    })
                }
                if($page.attr('id') == 'page-8'){
                    myChar1.setOption(option1);                   
                }              
                // if ($page.attr('id') == 'page-6') {
                //     setTimeout(function () {
                //         $('.js-p6-bar ').each(function (i, data) {
                //             var $dom = $(data);
                //             var to = $dom.data('to');
                //             var delay = $dom.data('delay');
                //             $dom.addClass('bar_animate').css({
                //                 'height': to,
                //                 '-webkit-transition-delay': delay,
                //                 '-moz-transition-delay': delay,
                //                 '-ms-transition-delay': delay,
                //                 '-o-transition-delay': delay
                //             });
                //         });
                //     }, 1600);
                // }
                // if ($page.attr('id') == 'page-10') {
                //     window.ts = setTimeout(function () {
                //         if (window.ts) {
                //             clearTimeout(window.ts);
                //         }
                //         window.doughnutChart();
                //     }, 4500);
                // }else if ($page.attr('id') == 'page-4'){
                //     setTimeout(function(){
                //         var tmp = window.swiperNested2.activeLoopIndex;
                //         tmp = (1+tmp) % 2;
                //         window.swiperNested2.swipeTo(tmp, 500);
                //     }, 2000);
                // }
            },

            onProgressChange: function(swiper){
                return;
                for (var i = 0; i < swiper.slides.length; i++){
                    var slide = swiper.slides[i];
                    var progress = slide.progress;
                    if (progress * 1500 > 2000 || progress * 1500 < -2000){
                        continue;
                    }
                    swiper.setTransform(slide,'translate3d(0px,0,'+(-Math.abs(progress*1500))+'px)');
                }
            },
            onTouchStart:function(swiper){
                return;
                for (var i = 0; i < swiper.slides.length; i++){
                    swiper.setTransition(swiper.slides[i], 0);
                }
            },
            onSetWrapperTransition: function(swiper) {
                for (var i = 0; i < swiper.slides.length; i++){
                    swiper.setTransition(swiper.slides[i], swiper.params.speed);
                }
            },
            onFirstInit: function(swiper){
                var $page = $('#page-1');
                $page.addClass('animate');
                swiper.params.progress = true;
            }
        });

        window.swiperNested2 = new Swiper('.swiper-nested-2',{
            loop: true,
            slidesPerView: 'auto'
        });
    };
});

window.onload = function() {
    css_on_load();
};

WeixinApi.ready(function (Api) {
    var wxdata = {
        'title': '撕下标签的90后——百度90后洞察报告',
        'desc': '百度CBG（用户消费业务群组）联合百度数据研究中心出品',
        'imgUrl': 'http://tieba.baidu.com/tb/zt/baidu_world/images/share.gif',
        'link': window.location.href
    };
    Api.shareToFriend(wxdata, {
        all: function () {
        },
        confirm: function () {
        }
    });
    Api.shareToTimeline($.extend({}, wxdata,
        {'desc': '撕下标签的90后——百度90后洞察报告'}), {
        all: function () {
        },
        confirm: function () {
        }
    });
    Api.shareToWeibo(wxdata, {all: function () {
    }});
});

/*!
 * jquery.drawDoughnutChart.js
 * Version: 0.3(Beta)
 * Inspired by Chart.js(http://www.chartjs.org/)
 *
 * Copyright 2013 hiro
 * https://github.com/githiro/drawDoughnutChart
 * Released under the MIT license.
 *
 */
;(function($, undefined) {
    $.fn.drawDoughnutChart = function(data, options) {
        var $this = this,
            W = $this.width(),
            H = $this.height(),
//            W = 100,
//            H = 100,
            centerX = W/2,
            centerY = H/2,
            cos = Math.cos,
            sin = Math.sin,
            PI = Math.PI,
            settings = $.extend({
                startAngle: 0,
                segmentShowStroke : true,
                segmentStrokeColor : "#0C1013",
                segmentStrokeWidth : 1,
                baseColor: "rgba(0,0,0,0.5)",
                baseOffset: 4,
                edgeOffset : 10,//offset from edge of $this
                percentageInnerCutout : 75,
                animation : true,
                animationSteps : 90,
                animationEasing : "easeInOutExpo",
                animateRotate : true,
                tipOffsetX: -8,
                tipOffsetY: -45,
                tipClass: "doughnutTip",
                summaryClass: "doughnutSummary",
                summaryTitle: "TOTAL:",
                summaryTitleClass: "doughnutSummaryTitle",
                summaryNumberClass: "doughnutSummaryNumber",
                beforeDraw: function() {  },
                afterDrawed : function() {  },
                onPathEnter : function(e,data) {  },
                onPathLeave : function(e,data) {  }
            }, options),
            animationOptions = {
                linear : function (t) {
                    return t;
                },
                easeInOutExpo: function (t) {
                    var v = t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
                    return (v>1) ? 1 : v;
                }
            },
            requestAnimFrame = function() {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function(callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            }();

        settings.beforeDraw.call($this);

        var $svg = $('<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>').appendTo($this),
            $paths = [],
            easingFunction = animationOptions[settings.animationEasing],
            doughnutRadius = Min([H / 2,W / 2]) - settings.edgeOffset,
            cutoutRadius = doughnutRadius * (settings.percentageInnerCutout / 100),
            segmentTotal = 0;

        //Draw base doughnut
        var baseDoughnutRadius = doughnutRadius + settings.baseOffset,
            baseCutoutRadius = cutoutRadius - settings.baseOffset;
        var drawBaseDoughnut = function() {
            //Calculate values for the path.
            //We needn't calculate startRadius, segmentAngle and endRadius, because base doughnut doesn't animate.
            var startRadius = -1.570 + settings.startAngle/180*Math.PI,// -Math.PI/2
                segmentAngle = 6.2831,// 1 * ((99.9999/100) * (PI*2)),
                endRadius = 4.7131 + settings.startAngle/180*Math.PI,// startRadius + segmentAngle
                startX = centerX + cos(startRadius) * baseDoughnutRadius,
                startY = centerY + sin(startRadius) * baseDoughnutRadius,
                endX2 = centerX + cos(startRadius) * baseCutoutRadius,
                endY2 = centerY + sin(startRadius) * baseCutoutRadius,
                endX = centerX + cos(endRadius) * baseDoughnutRadius,
                endY = centerY + sin(endRadius) * baseDoughnutRadius,
                startX2 = centerX + cos(endRadius) * baseCutoutRadius,
                startY2 = centerY + sin(endRadius) * baseCutoutRadius;
            var cmd = [
                'M', startX, startY,
                'A', baseDoughnutRadius, baseDoughnutRadius, 0, 1, 1, endX, endY,
                'L', startX2, startY2,
                'A', baseCutoutRadius, baseCutoutRadius, 0, 1, 0, endX2, endY2,//reverse
                'Z'
            ];
            $(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
                .attr({
                    "d": cmd.join(' '),
                    "fill": settings.baseColor
                })
                .appendTo($svg);
        }();

        //Set up pie segments wrapper
        var $pathGroup = $(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
        $pathGroup.attr({opacity: 0}).appendTo($svg);

        //Set up tooltip
        var $tip = $('<div class="' + settings.tipClass + '" />').appendTo('body').hide(),
            tipW = $tip.width(),
            tipH = $tip.height();

        //Set up center text area
        var summarySize = (cutoutRadius - (doughnutRadius - cutoutRadius)) * 2,
            $summary = $('<div class="' + settings.summaryClass + '" />')
                .appendTo($this)
                .css({
                    width: summarySize + "px",
                    height: summarySize + "px",
                    "margin-left": -(summarySize / 2) + "px",
                    "margin-top": -(summarySize / 2) + "px"
                });
        var $summaryTitle = $('<p class="' + settings.summaryTitleClass + '">' + settings.summaryTitle + '</p>').appendTo($summary);
        var $summaryNumber = $('<p class="' + settings.summaryNumberClass + '"></p>').appendTo($summary).css({opacity: 0});

        for (var i = 0, len = data.length; i < len; i++) {
            segmentTotal += data[i].value;
            $paths[i] = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
                .attr({
                    "stroke-width": settings.segmentStrokeWidth,
                    "stroke": settings.segmentStrokeColor,
                    "fill": data[i].color,
                    "data-order": i
                })
                .appendTo($pathGroup)
                .on("mouseenter", pathMouseEnter)
                .on("mouseleave", pathMouseLeave)
                .on("mousemove", pathMouseMove);
        }

        //Animation start
        animationLoop(drawPieSegments);

        function pathMouseEnter(e) {
            var order = $(this).data().order;
            $tip.text(data[order].title + ": " + data[order].value)
                .fadeIn(200);
            settings.onPathEnter.apply($(this),[e,data]);
        }
        function pathMouseLeave(e) {
            $tip.hide();
            settings.onPathLeave.apply($(this),[e,data]);
        }
        function pathMouseMove(e) {
            $tip.css({
                top: e.pageY + settings.tipOffsetY,
                left: e.pageX - $tip.width() / 2 + settings.tipOffsetX
            });
        }
        function drawPieSegments (animationDecimal) {
            var startRadius = -PI / 2,//-90 degree
                rotateAnimation = 1;
            if (settings.animation && settings.animateRotate) rotateAnimation = animationDecimal;//count up between0~1

            drawDoughnutText(animationDecimal, segmentTotal);

            $pathGroup.attr("opacity", animationDecimal);

            //draw each path
            for (var i = 0, len = data.length; i < len; i++) {
                var segmentAngle = rotateAnimation * ((data[i].value / segmentTotal) * (PI * 2)),
                    endRadius = startRadius + segmentAngle,
                    largeArc = ((endRadius - startRadius) % (PI * 2)) > PI ? 1 : 0,
                    startX = centerX + cos(startRadius) * doughnutRadius,
                    startY = centerY + sin(startRadius) * doughnutRadius,
                    endX2 = centerX + cos(startRadius) * cutoutRadius,
                    endY2 = centerY + sin(startRadius) * cutoutRadius,
                    endX = centerX + cos(endRadius) * doughnutRadius,
                    endY = centerY + sin(endRadius) * doughnutRadius,
                    startX2 = centerX + cos(endRadius) * cutoutRadius,
                    startY2 = centerY + sin(endRadius) * cutoutRadius;
                var cmd = [
                    'M', startX, startY,//Move pointer
                    'A', doughnutRadius, doughnutRadius, 0, largeArc, 1, endX, endY,//Draw outer arc path
                    'L', startX2, startY2,//Draw line path(this line connects outer and innner arc paths)
                    'A', cutoutRadius, cutoutRadius, 0, largeArc, 0, endX2, endY2,//Draw inner arc path
                    'Z'//Cloth path
                ];
                $paths[i].attr("d", cmd.join(' '));
                startRadius += segmentAngle;
            }
        }

        function drawDoughnutText(animationDecimal, segmentTotal) {
            $summaryNumber
                .css({opacity: animationDecimal})
                .text((segmentTotal * animationDecimal).toFixed(1));
        }
        function animateFrame(cnt, drawData) {
            var easeAdjustedAnimationPercent =(settings.animation)? CapValue(easingFunction(cnt), null, 0) : 1;
            drawData(easeAdjustedAnimationPercent);
        }
        function animationLoop(drawData) {
            var animFrameAmount = (settings.animation)? 1 / CapValue(settings.animationSteps, Number.MAX_VALUE, 1) : 1,
                cnt =(settings.animation)? 0 : 1;
            requestAnimFrame(function() {
                cnt += animFrameAmount;
                animateFrame(cnt, drawData);
                if (cnt <= 1) {
                    requestAnimFrame(arguments.callee);
                } else {
                    settings.afterDrawed.call($this);
                }
            });
        }
        function Max(arr) {
            return Math.max.apply(null, arr);
        }
        function Min(arr) {
            return Math.min.apply(null, arr);
        }
        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        function CapValue(valueToCap, maxValue, minValue) {
            if (isNumber(maxValue) && valueToCap > maxValue) return maxValue;
            if (isNumber(minValue) && valueToCap < minValue) return minValue;
            return valueToCap;
        }
        return $this;
    };
})(jQuery);