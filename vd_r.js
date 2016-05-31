var $ = require('jquery');
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

var model = {
    list: [
        {
            name: 'todo 1',key:1, type:'todo', time:'2016-05-01'
        }, {
            name: 'todo 2',key:2, type:'doing', time:'2016-05-15'
        }, {
            name: 'todo 3',key:3, type:'done', time:'2016-05-28'
        }
    ]
};
var pic = {
    todo  :'img/pic1.png',
    doing :'img/pic2.png',
    done  :'img/pic3.png'
}
var dataType=['todo','doing','done'];

var $container = $('.container');

var hyperItems = {};

var hyperHeader = h('div.dbl-top-margin', [
        h('button.dbl-top-margin.btn.btn-primary.col-xs-4.item-run-add', 'Run Add Test'),
        h('button.dbl-top-margin.btn.btn-primary.col-xs-4.item-run-shift', 'Run Shift Test'),
        h('button.dbl-top-margin.btn.btn-primary.col-xs-4.item-run-sort', 'Run Sort Test'),
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
                h('i',{
                    class: 'icon_'+item.type
                }),
                h('img',{
                    src     :pic[item.type],
                    width   :60,
                    height  :60
                }),
                h('span', item.name),
                h('button.item-remove.btn.btn-danger.btn-sm.float-right', {
                    value: item.name
                }, 'X'),
                h('span.float-right',item.time)
            ]);
            return hyperItems[item.name];
        })),
        hyperFooter
    ])
}
function genData(){
    var key =  Math.floor(Math.random() * (1000));
    var index = model.list.length%3;
    var item = {
        name: 'todo:' +key,
        key: key,
        type: dataType[index],
        time: '2016-5-28'
    };
    return item;
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
function renderSort(model) {
    var newTree = generateTree(model);
    var patches = diff(tree, newTree);
    root = patch(root, patches)
    tree = newTree;
}

//测试添加数据
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
        // console.log("finished!",result);
        return;
    }

    model = $.extend(true, {}, model);
    model.list.push(genData());

    start = Date.now();
    render(model);
    deltTime += Date.now() - start;

    count--;
    requestAnimationFrame(runAdd.bind(this, count));
};

//测试随机移动数据
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
    model.list.splice(indexA, 1);
    model.list.splice(indexB, 0, genData());

    start = Date.now();
    render(model);
    deltShift += Date.now() - start;

    count--;
    requestAnimationFrame(runShift.bind(this, count));
};

//测试排序
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

$container.delegate('.item-run-add', 'click', function () {
    // model = $.extend(true, {}, model);
    // model.list=[];
    runAdd(100);
});
$container.delegate('.item-run-sort', 'click', function () {
    runSort();
});
$container.delegate('.item-run-shift', 'click', function () {
    runShift(100);
});

//初始化渲染
render(model);