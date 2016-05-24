var $ = require('jquery');
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

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

var $container = $('.container');

var hyperItems = {};

var hyperHeader = h('div.dbl-top-margin', [
        h('button.dbl-top-margin.btn.btn-primary.col-xs-12.item-run', 'Run Test'),
        h('p',[
            h('span','test result(unit ms): '),
            h('span.item-result', '')
        ])

    ]);

var hyperFooter = h('div.dbl-top-margin', [
        h('input.form-control.item-name', {
            placeholder: 'New Item',
            type: 'text'
        }),
        h('button.dbl-top-margin.btn.btn-primary.col-xs-12.item-add', '+')
    ]);

function generateTree(model) {
    return h('div', [
        hyperHeader,
        h('ul.list-group.dbl-top-margin', model.list.map(function (item, index) {
            hyperItems[item.name] = hyperItems[item.name] || h('li.list-group-item', [
                item.name,
                h('button.item-remove.btn.btn-danger.btn-sm.float-right', {
                    value: item.name
                }, 'X')
            ]);
            return hyperItems[item.name];
        })),
        hyperFooter
    ])
}

var root;
var tree;
function render(model) {
    var newTree = generateTree(model);
    if (!root) {
        tree = newTree;
        root = createElement(tree);
        $container.append(root);
        return;
    }
    var patches = diff(tree, newTree);
    root = patch(root, patches)
    tree = newTree;
}

var result=[], average=0;
function runTest(){
    var time = Date.now();
    model.list=[];
    var count = 100;
    for (var i = 0; i < count; i++) {
        model = $.extend(true, {}, model); //数据不可变性
        model.list.push({
            name: 'item-' + Math.floor(Math.random() * (1000))
        });
        render(model);
    }

    result.push(Date.now() - time); //存储数据用于绘制图表，数据放大100倍
    console.log(result);
    
    var sum = 0;
    result.map(function(val){ sum += val;});
    average = Math.floor(sum/result.length); //计算平均值

    $('.item-result').text(average); //展示运行结果
}


$container.delegate('.item-remove', 'click', function (e) {
    var value = $(e.target).val();
    model = $.extend(true, {}, model);
    for (var i = 0; i < model.list.length; i++) {
        if (model.list[i].name === value) {
            model.list.splice(i, 1);
            break;
        }
    }
    render(model);
});

$container.delegate('.item-add', 'click', function () {
    var name = $('.item-name').val();
    model.list.push({
        name: name
    });
    render(model);
});

$container.delegate('.item-run', 'click', function () {
    runTest();
});

//初始化渲染
render(model);