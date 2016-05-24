var $ = require('jquery');
var Handlebars = require('handlebars');

// template = ['<div>', template, '</div>'].join('');

// 数据
var model = {
    list: [
    {
        name: 'todo 1'
    }, {
        name: 'todo 2'
    }, {
        name: 'todo 3'
    }
    ]
};

//定义模版
var mainTemplate = $('.template').text(); //从html中获取
var liTemplate = ''
    + '<li class="list-group-item">'
        + '<span>{{name}}</span>'
        + '<button class="item-remove btn btn-danger btn-sm float-right">X</button>'
    + '</li>';

//编译模版
// var lisTemplComplied = Handlebars.compile('{{#list}}' + liTemplate + '{{/list}}');
var liTemplComplied = Handlebars.compile(liTemplate);
var mainTemplComplied = Handlebars.compile(mainTemplate);

//初始化渲染页面
$('.container').html(mainTemplComplied((model)));

//代理事件区
var $container = $('.container');
var $ul = $container.find('ul');
var $itemName = $container.find('.item-name');
$container.delegate('.item-remove', 'click', function (e) {
    var $li = $(e.target).parents('li');
    $li.remove();
});
$container.delegate('.item-add', 'click', function () {
    var name = $itemName.val();
    // 清空输入框
    $itemName.val('');
    // 渲染新项目并插入
    $ul.append(Handlebars.compile(liTemplate)({
        name: name
    }));
});
$container.delegate('.item-run', 'click', function () {
    model = $.extend(true, {}, model);
    model.list=[];
    runTest(100);
});

//测试方法
var result=[], average=0;
var start;
var deltTime = 0;
function runTest(count) {

    if (!count) {
        result.push(deltTime);
        average = Math.floor(eval(result.join("+"))/result.length); //计算平均值
        $('.item-result').text(average);  //展示运行结果
        deltTime = 0;
        console.log("finished!",result);
        return;
    }

    model = $.extend(true, {}, model);
    var name = 'todo:' + Math.floor(Math.random() * (1000));
    model.list.push({
        name: name
    });

    start = Date.now();
    if(deltTime===0){
        $ul[0].innerHTML='';
    }
    render(name);
    deltTime += Date.now() - start;

    count--;
    requestAnimationFrame(runTest.bind(this, count));
};

function render(name){
    $ul.append(liTemplComplied({name:name}));
}