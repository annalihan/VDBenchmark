var $ = require('jquery');
var Handlebars = require('handlebars');

// 数据
var model = {
    list: [
    /*{
        name: 'list 1'
    }, {
        name: 'list 2'
    }, {
        name: 'list 3'
    }*/
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
var lisTemplComplied = Handlebars.compile('{{#list}}' + liTemplate + '{{/list}}');
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
    runTest();
});

//测试方法
var result=[], average=0;
function runTest(){
    var time = Date.now();
    $ul[0].innerHTML = '';
    model.list=[];
    var count = 100;
    for (var i = 0; i < count; i++) {
        var name = 'item-' + Math.floor(Math.random() * (1000));
        model = $.extend(true, {}, model); //数据不可变性
        model.list.push({
            name: name
        });
        render(name);
    }

    result.push(Date.now() - time); //存储数据用于绘制图表，数据放大100倍
    console.log(result);
    
    var sum = 0;
    result.map(function(val){ sum += val;});
    average = Math.floor(sum/result.length); //计算平均值

    $('.item-result').text(average); //展示运行结果
}

function render(name){
    $ul.append(liTemplComplied({
        name: name
    }));
    // $ul.html(lisTemplComplied(model));
}