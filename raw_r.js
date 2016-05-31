var $ = require('jquery');
var Handlebars = require('handlebars');

// template = ['<div>', template, '</div>'].join('');

// 数据
var model = {
    list: [
    {
        name: 'todo 1',key:1, todo:true, time:'2016-05-01'
    }, {
        name: 'todo 2',key:2, doing:true, time:'2016-05-15'
    }, {
        name: 'todo 3',key:3, done:true, time:'2016-05-28'
    }
    ]
};

//定义模版
var mainTemplate = $('.template').text(); //从html中获取
var liTemplate = ''
    + '<li class="list-group-item">'
        + '{{#if doing}}<i class="icon_doing"></i>'
        + '{{else if todo}}<i class="icon_todo"></i>'
        + '{{else}}<i class="icon_done"></i>{{/if}}'
        + '{{#if doing}}<img src="img/pic2.png" alt="" width="60" height="60">'
        + '{{else if todo}}<img src="img/pic3.png" alt="" width="60" height="60">'
        + '{{else}}<img src="img/pic1.png" alt="" width="60" height="60">{{/if}}'
        + '<span>{{name}}</span>'
        + '<button class="item-remove btn btn-danger btn-sm float-right">X</button>'
        + '<span class="float-right">{{time}}</span>'
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
$container.delegate('.item-run-add', 'click', function () {
    /*model = $.extend(true, {}, model);
    model.list=[];*/
    runAdd(100);
});
$container.delegate('.item-run-sort', 'click', function () {
    runSort();
});
$container.delegate('.item-run-shift', 'click', function () {
    runShift(100);
});

//测试方法
function genData(){
    var key =  Math.floor(Math.random() * (1000));
    var item = {
        name: 'todo:' +key,
        key: key,
        time: '2016-5-28'
    };
    var status = model.list.length%3;
    if(status==0){
        item.todo = true;
    }else if(status==1){
        item.doing = true;
    }else {
        item.done = true;
    }
    return item;
}
var result=[], average=0;
var start;
var deltTime = 0;
function runAdd(count) {

    if (!count) {
        result.push(deltTime);

        var sum = 0;
        result.map(function(val){ sum += val;});
        average = Math.floor(sum/result.length); //计算平均值

        $('.item-result').text(average);  //展示运行结果
        deltTime = 0;
        console.log("finished!",result);
        return;
    }
    var item = genData();
    model = $.extend(true, {}, model);
    model.list.push(item);

    start = Date.now();
    /*if(deltTime===0){
        $ul[0].innerHTML='';
    }*/
    render(item);
    deltTime += Date.now() - start;

    count--;
    requestAnimationFrame(runAdd.bind(this, count));
};

//测试随机替换数据
var resultShift=[], average=0,indexA,indexB;
var deltShift = 0;
function runShift(count) {
    if (!count) {
        resultShift.push(deltShift);

        var sum = 0;
        resultShift.map(function(val){ sum += val;});
        average = Math.floor(sum/resultShift.length); //计算平均值

        $('.item-result').text(average);  //展示运行结果
        deltShift = 0;
        console.log("finished!",resultShift);
        return;
    }

    model = $.extend(true, {}, model);

    indexA =Math.floor(Math.random() * (model.list.length-1));
    indexB =Math.floor(Math.random() * (model.list.length-1));

    model.list.splice(indexA,1);
    var item = genData();
    model.list.splice(indexB,0,item);

    start = Date.now();
    // renderShift(indexA, indexB, item);
    renderShift2(model);
    deltShift += Date.now() - start;

    count--;
    requestAnimationFrame(runShift.bind(this, count));
};

function runSort() {
    model = $.extend(true, {}, model);
    /*model.list.sort(function(a,b){
        return a.key+Math.floor(Math.random() * (1000))-b.key;
    });*/
    model.list.reverse();

    start = Date.now();
    renderSort(model);

    $('.item-result').text(Date.now() - start);  //展示运行结果

};

function render(item){
    $ul.append(liTemplComplied(item));
}

function renderShift(indexA,indexB,item){
    // 删除
    $ul.children()[indexA].remove();
    // 插入
    var node = $ul.children()[indexB];
    $(node).after(liTemplComplied(item));
}

function renderShift2(model){
    $ul[0].innerHTML = (lisTemplComplied(model));
}

function renderSort(model){
    $ul.html(lisTemplComplied(model));
}