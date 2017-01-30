"use strict";

//var $ = require("jquery"),
//    v = require("core/vdom");


QUnit.module("Common");

/*QUnit.test("test", function(assert) {
    var date = new Date();
    var str = "dx-datagrid dx-datagrid";

    for(var i = 0; i < 1000000; i++) {
        str.indexOf(" ");
    }

    assert.equal(new Date() - date, 0);

    date = new Date();
    for(var i = 0; i < 1000000; i++) {
        str.split(" ");
    }

    assert.equal(new Date() - date, 0);

    date = new Date();
    for(var i = 0; i < 1000000; i++) {
        str.substr(0, 10);
    }

    assert.equal(new Date() - date, 0);

});*/


QUnit.test("namespace", function(assert) {
    assert.equal(typeof v, "function", "v is function");
    assert.ok(typeof v.fn, "v.fn is object");
});

QUnit.test("init", function(assert) {
    var el = v("<div>");

    assert.ok(el, "vdom element is created");
    assert.equal(typeof el, "object", "vdom element type");
    assert.ok(el instanceof v.fn.init, "vdom element is instance of v");
});

QUnit.test("apply attributes on dom element", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el, { id: "test-id", class: "test1 test2", style: "width: 200px; height: 100px" });

    assert.ok(el.v, "vdom element is created");
    assert.strictEqual(el.v, v1, "vdom element instance in dom");
    assert.ok(el.v instanceof v.fn.init, "vdom element is instance of v");
    assert.equal(el.getAttribute("id"), "test-id", "id attribute");
    assert.equal(el.getAttribute("class"), "test1 test2", "class attribute");
    assert.equal(el.className, "test1 test2", "className property");
    assert.equal(el.style.width, "200px", "style.width property");
});

QUnit.test("apply attributes as object on dom element", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el, { id: "test-id", class: { test1: true, test2: true, test3: false }, style: { width: "200px", height: "100px" } });

    assert.ok(el.v, "vdom element is created");
    assert.strictEqual(el.v, v1, "vdom element instance in dom");
    assert.ok(el.v instanceof v.fn.init, "vdom element is instance of v");
    assert.equal(el.getAttribute("id"), "test-id", "id attribute");
    assert.equal(el.getAttribute("class"), "test1 test2", "class attribute");
    assert.equal(el.className, "test1 test2", "className property");
    assert.equal(el.style.width, "200px", "style.width property");
});


QUnit.test("apply attributes on virtual dom element", function(assert) {
    var el = document.createElement("div");
    var v1 = v(el, { id: "test-id-old" });

    var v2 = v(v1, { id: "test-id-new", class: "test1 test2", style: "width: 200px; height: 100px" });

    assert.ok(el.v, "vdom element is created");
    assert.ok(el.v === v1, "vdom element instance in dom");
    assert.ok(v1 === v2, "vdom element is not recreated");
    assert.ok(el.v instanceof v.fn.init, "vdom element is instance of v");
    assert.equal(el.getAttribute("id"), "test-id-new", "id attribute");
    assert.equal(el.getAttribute("class"), "test1 test2", "class attribute");
    assert.equal(el.className, "test1 test2", "className property");
    assert.equal(el.style.width, "200px", "style.width property");
});

QUnit.test("apply attributes on dom element several times", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el, { id: "test-id-old" });

    var v2 = v(el, { id: "test-id-new", class: "test1 test2", style: "width: 200px; height: 100px" });

    assert.ok(el.v, "vdom element is created");
    assert.ok(el.v === v1, "vdom element instance in dom");
    assert.ok(v1 === v2, "vdom element is not recreated");
    assert.ok(el.v instanceof v.fn.init, "vdom element is instance of v");
    assert.equal(el.getAttribute("id"), "test-id-new", "id attribute");
    assert.equal(el.getAttribute("class"), "test1 test2", "class attribute");
    assert.equal(el.className, "test1 test2", "className property");
    assert.equal(el.style.width, "200px", "style.width property");
});

QUnit.test("apply text content", function(assert) {
    var el = document.createElement("div");

    v(el, { id: "test-id" }, "Test Text");

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.getAttribute("id"), "test-id", "id attribute");
    assert.equal(el.textContent, "Test Text", "inner text");
});

QUnit.test("apply text content several times", function(assert) {
    var el = document.createElement("div");

    v(el, { id: "test-id" }, "Test Text 1");
    v(el, { id: "test-id" }, "Test Text 2");

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.getAttribute("id"), "test-id", "id attribute");
    assert.equal(el.textContent, "Test Text 2", "inner text");
});

QUnit.test("apply one children as virtual node", function(assert) {
    var el = document.createElement("div");

    v(el, v("<span>", "Test Text 1"));

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.childNodes.length, 1, "children count");
    assert.equal(el.childNodes[0].tagName, "SPAN", "child 1 node type");
    assert.equal(el.childNodes[0].textContent, "Test Text 1", "children node 1 text");
});

QUnit.test("apply children as virtual nodes", function(assert) {
    var el = document.createElement("div");

    v(el, { id: "test-id" }, [v("<span>", "Test Text 1"), v("<span>", "Test Text 2")]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.getAttribute("id"), "test-id", "id attribute");
    assert.equal(el.childNodes.length, 2, "children count");
    assert.equal(el.childNodes[0].tagName, "SPAN", "child 1 node type");
    assert.equal(el.childNodes[0].textContent, "Test Text 1", "children node 1 text");
    assert.equal(el.childNodes[1].tagName, "SPAN", "child 2 node type");
    assert.equal(el.childNodes[1].textContent, "Test Text 2", "children node 2 text");
});

QUnit.test("apply children as virtual node arrays", function(assert) {
    var el = document.createElement("div");

    v(el, { id: "test-id" }, [["<span>", "Test Text 1"], ["<span>", "Test Text 2"]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.getAttribute("id"), "test-id", "id attribute");
    assert.equal(el.childNodes.length, 2, "children count");
    assert.equal(el.childNodes[0].tagName, "SPAN", "child 1 node type");
    assert.equal(el.childNodes[0].textContent, "Test Text 1", "children node 1 text");
    assert.equal(el.childNodes[1].tagName, "SPAN", "child 2 node type");
    assert.equal(el.childNodes[1].textContent, "Test Text 2", "children node 2 text");
});

QUnit.test("apply children as virtual nodes arrays and texts", function(assert) {
    var el = document.createElement("div");

    v([el, { id: "test-id" }, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.getAttribute("id"), "test-id", "id attribute");
    assert.equal(el.childNodes.length, 3, "children count");
    assert.equal(el.innerHTML, "<span>Test Text 1</span>Test Text 2<span>Test Text 3</span>", "inner html");
});

QUnit.test("apply attrs and children by array", function(assert) {
    var el = document.createElement("div");

    v([el, { id: "test-id" }, [["<span>", "Test Text 1"], ["<span>", "Test Text 2"]]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.getAttribute("id"), "test-id", "id attribute");
    assert.equal(el.childNodes.length, 2, "children count");
    assert.equal(el.childNodes[0].tagName, "SPAN", "child 1 node type");
    assert.equal(el.childNodes[0].textContent, "Test Text 1", "children node 1 text");
    assert.equal(el.childNodes[1].tagName, "SPAN", "child 2 node type");
    assert.equal(el.childNodes[1].textContent, "Test Text 2", "children node 2 text");
});

QUnit.test("apply children recursive", function(assert) {
    var el = document.createElement("div");

    v(el, { id: "test-id" }, ["<div>", [["<span>", "Test Text 1"], ["<span>", "Test Text 2"]]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.getAttribute("id"), "test-id", "id attribute");
    assert.equal(el.childNodes.length, 1, "children count");
    assert.equal(el.childNodes[0].tagName, "DIV", "child 1 node type");
    assert.equal(el.childNodes[0].childNodes.length, 2, "children count");
    assert.equal(el.childNodes[0].childNodes[0].tagName, "SPAN", "child 1 node type");
    assert.equal(el.childNodes[0].childNodes[0].textContent, "Test Text 1", "children node 1 text");
    assert.equal(el.childNodes[0].childNodes[1].tagName, "SPAN", "child 2 node type");
    assert.equal(el.childNodes[0].childNodes[1].textContent, "Test Text 2", "children node 2 text");
});

QUnit.test("update textContent in children", function(assert) {
    var el = document.createElement("div");

    v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);

    var v1 = el.childNodes[0].v;
    var v2 = el.childNodes[1].v;
    var v3 = el.childNodes[2].v;

    v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 4"]]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.childNodes.length, 3, "children count");
    assert.equal(el.childNodes[0].v.node, v1.node, "node instance is not changed for child node 1");
    assert.equal(el.childNodes[1].v.node, v2.node, "node instance is not changed for child node 2");
    assert.equal(el.childNodes[2].v.node, v3.node, "node instance is not changed for child node 3");
    assert.equal(el.innerHTML, "<span>Test Text 1</span>Test Text 2<span>Test Text 4</span>", "inner html");
});

QUnit.test("add node in children to end", function(assert) {
    var el = document.createElement("div");

    v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);

    var v3 = el.childNodes[2].v;

    v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"], ["<span>", "Test Text 4"]]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.childNodes.length, 4, "children count");
    assert.equal(el.childNodes[2].v.node, v3.node, "node instance is not changed for child node 3");
    assert.equal(el.innerHTML, "<span>Test Text 1</span>Test Text 2<span>Test Text 3</span><span>Test Text 4</span>", "inner html");
});

QUnit.test("add node in children to middle", function(assert) {
    var el = document.createElement("div");

    v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);

    //var v3 = el.childNodes[2].v;

    v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<div>", "Test Text 4"], ["<span>", "Test Text 3"]]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.childNodes.length, 4, "children count");
    //assert.equal(el.childNodes[3].v, v3, "vNode instance is not changed for child node 3");
    assert.equal(el.innerHTML, "<span>Test Text 1</span>Test Text 2<div>Test Text 4</div><span>Test Text 3</span>", "inner html");
});

QUnit.test("add node in children to start when key is not used", function(assert) {
    var el = document.createElement("div");

    v([el, [["<span>", "Test Text 1"], ["<span>", "Test Text 2"]]]);
    var v0 = el.childNodes[0].v;
    var v1 = el.childNodes[1].v;

    v([el, [["<span>", "Test Text 0"], ["<span>", "Test Text 1"], ["<span>", "Test Text 2"]]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.childNodes.length, 3, "children count");
    assert.equal(el.childNodes[0].v.node, v0.node, "node instance is not changed for first node");
    assert.equal(el.childNodes[1].v.node, v1.node, "node instance is not changed for second node");
    assert.equal(el.innerHTML, "<span>Test Text 0</span><span>Test Text 1</span><span>Test Text 2</span>", "inner html");
});

QUnit.test("add node in children to start when key is used", function(assert) {
    var el = document.createElement("div");

    v([el, [["<span>", { key: 1 }, "Test Text 1"], ["<span>", { key: 2 }, "Test Text 2"]]]);
    var v0 = el.childNodes[0].v;
    var v1 = el.childNodes[1].v;

    v([el, [["<span>", { key: 0 }, "Test Text 0"], ["<span>", { key: 1 }, "Test Text 1"], ["<span>", { key: 2 }, "Test Text 2"]]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.childNodes.length, 3, "children count");
    assert.equal(el.childNodes[1].v.node, v0.node, "node instance is moved for first node to second");
    assert.equal(el.childNodes[2].v.node, v1.node, "node instance is moved for second node to third");
    assert.equal(el.innerHTML, "<span>Test Text 0</span><span>Test Text 1</span><span>Test Text 2</span>", "inner html");
});

QUnit.test("reorder nodes in children when key is used", function(assert) {
    var el = document.createElement("div");

    v([el, [["<span>", { key: 0 }, "Test Text 0"], ["<span>", { key: 1 }, "Test Text 1"], ["<span>", { key: 2 }, "Test Text 2"]]]);
    var v0 = el.childNodes[0].v;
    var v1 = el.childNodes[1].v;
    var v2 = el.childNodes[2].v;

    v([el, [["<span>", { key: 2 }, "Test Text 2"], ["<span>", { key: 1 }, "Test Text 1"], ["<span>", { key: 0 }, "Test Text 0"]]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.childNodes.length, 3, "children count");
    assert.equal(el.childNodes[0].v.node, v2.node, "node 0 equal prev vNode 2");
    assert.equal(el.childNodes[1].v.node, v1.node, "node 1 equal prev vNode 1");
    assert.equal(el.childNodes[2].v.node, v0.node, "node 2 equal prev vNode 0");
    assert.equal(el.innerHTML, "<span>Test Text 2</span><span>Test Text 1</span><span>Test Text 0</span>", "inner html");
});

QUnit.test("reorder nodes random in children when key is used", function(assert) {
    var el = document.createElement("div");

    v([el, [["<span>", { key: 0 }, "Test Text 0"], ["<span>", { key: 1 }, "Test Text 1"], ["<span>", { key: 2 }, "Test Text 2"], ["<span>", { key: 3 }, "Test Text 3"]]]);
    var v0 = el.childNodes[0].v;
    var v1 = el.childNodes[1].v;
    var v2 = el.childNodes[2].v;
    var v3 = el.childNodes[3].v;

    v([el, [["<span>", { key: 0 }, "Test Text 0"], ["<span>", { key: 3 }, "Test Text 3"], ["<span>", { key: 2 }, "Test Text 2"], ["<span>", { key: 1 }, "Test Text 1"]]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.childNodes.length, 4, "children count");
    assert.equal(el.childNodes[0].v.node, v0.node, "node 0 equal prev node 0");
    assert.equal(el.childNodes[1].v.node, v3.node, "node 1 equal prev node 3");
    assert.equal(el.childNodes[2].v.node, v2.node, "node 2 equal prev node 2");
    assert.equal(el.childNodes[3].v.node, v1.node, "node 2 equal prev node 1");
    assert.equal(el.innerHTML, "<span>Test Text 0</span><span>Test Text 3</span><span>Test Text 2</span><span>Test Text 1</span>", "inner html");
});

QUnit.test("remove node in children from end", function(assert) {
    var el = document.createElement("div");

    v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);

    v([el, [["<span>", "Test Text 1"], "Test Text 2"]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.childNodes.length, 2, "children count");
    assert.equal(el.innerHTML, "<span>Test Text 1</span>Test Text 2", "inner html");
});

QUnit.test("remove text node in children from middle", function(assert) {
    var el = document.createElement("div");

    v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);

    v([el, [["<span>", "Test Text 1"], ["<span>", "Test Text 3"]]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.childNodes.length, 2, "children count");
    assert.equal(el.innerHTML, "<span>Test Text 1</span><span>Test Text 3</span>", "inner html");
});

QUnit.test("remove text from node", function(assert) {
    var el = document.createElement("div");

    v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);

    v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>"]]]);

    assert.ok(el.v, "vdom element is created");
    assert.equal(el.childNodes.length, 3, "children count");
    assert.equal(el.innerHTML, "<span>Test Text 1</span>Test Text 2<span></span>", "inner html");
});

QUnit.test("apply event on virtual dom element", function(assert) {
    var el = document.createElement("div");

    var clickCount = 0;

    v(el, { onclick: function() { clickCount++; } });

    el.dispatchEvent(new MouseEvent("click"));

    assert.equal(clickCount, 1, "click count");
});

QUnit.test("apply event on dom element several times", function(assert) {
    var el = document.createElement("div");

    var clickCount = 0;

    v(el, { onclick: function() { clickCount++; } });

    v(el, { onclick: function() { clickCount++; } });

    el.dispatchEvent(new MouseEvent("click"));

    assert.equal(clickCount, 1, "click count");
});

QUnit.test("vNode from node", function(assert) {
    var el = document.createElement("div");
    var child1 = document.createElement("span");
    child1.textContent = "Test Text 1";
    el.appendChild(child1);
    var child2 = document.createElement("span");
    child2.textContent = "Test Text 2";
    el.appendChild(child2);
    el.id = "test-id";
    el.style.width = "100px";

    var vNode = v(el);

    assert.equal(vNode.tagName, "DIV", "root tagName");
    assert.deepEqual(vNode.attrs, { style: { width: "100px" }, id: "test-id" }, "root attrs");
    assert.equal(vNode.childNodes.length, 2, "root children count");
    assert.equal(vNode.childNodes[0].tagName, "SPAN", "children 1 tagName");
    assert.equal(vNode.childNodes[0].textContent, "Test Text 1", "children 1 textContent");
    assert.equal(vNode.childNodes[1].tagName, "SPAN", "children 2 tagName");
    assert.equal(vNode.childNodes[1].textContent, "Test Text 2", "children 2 textContent");
});

QUnit.test("apply visible hook on dom element", function(assert) {
    var el = document.createElement("div");

    v(el, { visible: false }, [["<div>"], ["<div>"]]);

    assert.equal(el.style.display, "none", "element is hidden");
    assert.equal(el.childNodes.length, 0, "children count");

    v(el, { visible: true }, [["<div>"], ["<div>"]]);

    assert.equal(el.style.display, "", "element is visible");
    assert.equal(el.childNodes.length, 2, "children count");

    v(el, { visible: false }, [["<div>"], ["<div>"]]);

    assert.equal(el.style.display, "none", "element is hidden");
    assert.equal(el.childNodes.length, 2, "children count");
});

QUnit.test("apply html hook on dom element", function(assert) {
    var el = document.createElement("div");

    v(el, { html: "<span>Test Text</span>" });

    assert.equal(el.innerHTML, "<span>Test Text</span>", "element innerHTML");
});

QUnit.test("apply text hook on dom element", function(assert) {
    var el = document.createElement("div");

    v(el, { text: "<span>Test Text</span>" });

    assert.equal(el.textContent, "<span>Test Text</span>", "element textContent");
});

QUnit.test("apply attr hook on dom element", function(assert) {
    var el = document.createElement("div");

    v(el, { attr: { id: "test-id", "data-test": "test" } });

    assert.equal(el.getAttribute("id"), "test-id", "element id attribute");
    assert.equal(el.getAttribute("data-test"), "test", "element data-test attribute");
});

QUnit.test("apply event hook on virtual dom element", function(assert) {
    var el = document.createElement("div");

    var clickCount = 0;
    var mousedownCount = 0;

    v(el, { event: { click: function() { clickCount++; }, mousedown: function() { mousedownCount++; } } });

    el.dispatchEvent(new MouseEvent("click"));
    el.dispatchEvent(new MouseEvent("mousedown"));

    assert.equal(clickCount, 1, "click count");
    assert.equal(mousedownCount, 1, "mousedown count");
});

QUnit.module("jQuery vdom");

QUnit.test("init", function(assert) {
    var v1 = v("<div>");

    assert.ok(v1, "vdom element is created");
    assert.ok(v1 instanceof v, "vdom element is instance of v");
    assert.strictEqual(v1.length, 1, "vdom element length");
    assert.strictEqual(v1[0], v1.node, "vdom element node by 0 key");
});

QUnit.test("text", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el).text("Test");

    assert.equal(v1[0].textContent, "Test", "vdom element textContent");
});

QUnit.test("several append and text", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    v1.append(v("<span>").text("Test1"));
    v1.append(v("<span>").text("Test2"));

    assert.equal(v1[0].innerHTML, "<span>Test1</span><span>Test2</span>", "vdom element innerHTML");
});

QUnit.test("several appendTo and text", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    v("<span>").appendTo(v1).text("Test1");
    v("<span>").appendTo(v1).text("Test2");

    assert.equal(v1[0].innerHTML, "<span>Test1</span><span>Test2</span>", "vdom element innerHTML");
});

QUnit.test("several append and text", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    v1.prepend(v("<span>").text("Test1"));
    v1.prepend(v("<span>").text("Test2"));

    assert.equal(v1[0].innerHTML, "<span>Test2</span><span>Test1</span>", "vdom element innerHTML");
});

QUnit.test("several appendTo and text", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    v("<span>").prependTo(v1).text("Test1");
    v("<span>").prependTo(v1).text("Test2");

    assert.equal(v1[0].innerHTML, "<span>Test2</span><span>Test1</span>", "vdom element innerHTML");
});


QUnit.test("empty", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    v1.append(v("<span>").text("Test1"));
    v1.empty();
    v1.append(v("<span>").text("Test2"));

    assert.equal(v1[0].innerHTML, "<span>Test2</span>", "vdom element innerHTML");
});


QUnit.test("detach", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    var v2 = v("<span>").appendTo(v1).text("Test1");
    var v3 = v("<span>").appendTo(v1).text("Test2");

    assert.equal(v1[0].innerHTML, "<span>Test1</span><span>Test2</span>", "vdom element innerHTML");

    v2.detach();

    assert.equal(v1[0].innerHTML, "<span>Test2</span>", "vdom element innerHTML after remove");
});

QUnit.test("remove", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    var v2 = v("<span>").appendTo(v1).text("Test1");
    var v3 = v("<span>").appendTo(v1).text("Test2");

    assert.equal(v1[0].innerHTML, "<span>Test1</span><span>Test2</span>", "vdom element innerHTML");

    v2.remove();

    assert.equal(v1[0].innerHTML, "<span>Test2</span>", "vdom element innerHTML after remove");
});

QUnit.test("appendTo and remove last", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    var v2 = v("<span>").appendTo(v1).text("Test1");
    var v3 = v("<span>").appendTo(v1).text("Test2");

    assert.equal(v1[0].innerHTML, "<span>Test1</span><span>Test2</span>", "vdom element innerHTML");

    v("<span>").appendTo(v1).text("Test3");
    v3.remove();

    assert.equal(v1[0].innerHTML, "<span>Test1</span><span>Test3</span>", "vdom element innerHTML after remove");
});

QUnit.skip("appendTo and remove first", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    var v2 = v("<span>").appendTo(v1).text("Test1");
    var v3 = v("<span>").appendTo(v1).text("Test2");

    assert.equal(v1[0].innerHTML, "<span>Test1</span><span>Test2</span>", "vdom element innerHTML");

    v("<span>").appendTo(v1).text("Test3");
    v2.remove();

    assert.equal(v1[0].innerHTML, "<span>Test2</span><span>Test3</span>", "vdom element innerHTML after remove");
});

QUnit.test("addClass/removeClass/toggleClass", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);

    v1.addClass("test1")
        .addClass("test2")
        .toggleClass("test3");

    assert.equal(v1[0].className, "test1 test2 test3", "vdom element className");

    v1.removeClass("test1")
        .toggleClass("test2")
        .toggleClass("test3", false)
        .toggleClass("test4", true);

    assert.equal(v1[0].className, "test4", "vdom element className");
});

QUnit.test("remove class when addClass is not called during repaint", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);

    var v2 = v("<div>")
        .addClass("test1")
        .addClass("test2")
        .appendTo(v1);

    assert.equal(v2[0].className, "test1 test2", "vdom element className");

    v1.empty();

    v2 = v("<div>")
        .addClass("test1")
        .appendTo(v1);

    assert.equal(v2[0].className, "test1", "vdom element className");
});

QUnit.skip("remove all classes when addClass is not called during repaint", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);

    var v2 = v("<div>")
        .addClass("test1")
        .addClass("test2")
        .appendTo(v1);

    assert.equal(v2[0].className, "test1 test2", "vdom element className");

    v1.empty();

    v2 = v("<div>")
        .appendTo(v1);

    assert.equal(v2[0].className, "", "vdom element className");
});

QUnit.test("attr/removeAttr", function(assert) {
    var parent = document.createElement("div");
    var el = document.createElement("div");
    parent.appendChild(el);

    var v1 = v(el);

    v1.attr("id", "test1")
        .attr("test", "test2");

    assert.equal(v1[0].parentNode.innerHTML, "<div id=\"test1\" test=\"test2\"></div>", "vdom element html");

    v1.removeAttr("test");

    assert.equal(v1[0].parentNode.innerHTML, "<div id=\"test1\"></div>", "vdom element html");
});

QUnit.test("prop/removeProp", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);

    v1.prop("test1", "test1")
        .prop("test2", "test2");

    assert.strictEqual(v1[0].test1, "test1", "vdom element prop test1");
    assert.strictEqual(v1.prop("test1"), "test1", "vdom element prop test1");
    assert.strictEqual(v1[0].test2, "test2", "vdom element prop test2");
    assert.strictEqual(v1.prop("test2"), "test2", "vdom element prop test2");
    assert.strictEqual(v1.prop("test3"), undefined, "vdom element prop test3");

    v1.removeProp("test1");

    assert.strictEqual(v1[0].test1, undefined, "vdom element prop test1");
    assert.strictEqual(v1[0].test2, "test2", "vdom element prop test2");
});

QUnit.test("css as object", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);

    v1.css({ width: "100px", color: "red" });

    assert.equal(v1[0].style.width, "100px", "vdom element html");
    assert.equal(v1[0].style.color, "red", "vdom element html");
});

QUnit.test("css as name", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);

    v1.css("width", "100px");

    assert.equal(v1[0].style.width, "100px", "vdom element html");
});

QUnit.test("data", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);

    v1.data("test1", "test1")
        .data("test2", "test2");

    assert.deepEqual(v1.data(), { test1: "test1", test2: "test2" }, "vdom element data");
    assert.strictEqual(v1.data("test1"), "test1", "vdom element data test1");
    assert.strictEqual(v1.data("test2"), "test2", "vdom element data test2");
    assert.strictEqual(v1.data("test3"), undefined, "vdom element data test3");
    assert.deepEqual($.data(v1[0]), { test1: "test1", test2: "test2" }, "vdom element data");
    assert.strictEqual($.data(v1[0], "test1"), "test1", "vdom element data test1");
    assert.strictEqual($.data(v1[0], "test2"), "test2", "vdom element data test2");
    assert.strictEqual($.data(v1[0], "test3"), undefined, "vdom element data test2");
});

QUnit.test("on/off", function(assert) {
    var el = document.createElement("div");
    $("#qunit-fixture").append(el);
    var v1 = v(el);

    var eventArgs = [];

    var v2 = v("<span>").appendTo(v1);

    v1.on("click.test", function(e) {
        eventArgs.push($.extend({}, e));
    });

    v1.trigger("click");
    v2.trigger("click");

    v1.off("click.test");

    v1.trigger("click");
    v2.trigger("click");

    assert.strictEqual(eventArgs.length, 2, "event count");
    assert.strictEqual(eventArgs[0].type, "click", "event 0 type");
    assert.strictEqual(eventArgs[0].target, el, "event 0 target");
    assert.strictEqual(eventArgs[0].currentTarget, el, "event 0 currentTarget");
    assert.strictEqual(eventArgs[0].delegateTarget, el, "event 0 delegateTarget");
    assert.strictEqual(eventArgs[1].type, "click", "event 1 type");
    assert.strictEqual(eventArgs[1].target, v2[0], "event 1 target");
    assert.strictEqual(eventArgs[1].currentTarget, el, "event 1 currentTarget");
    assert.strictEqual(eventArgs[1].delegateTarget, el, "event 1 delegateTarget");
});


QUnit.test("on with selector", function(assert) {
    var el = document.createElement("div");
    $("#qunit-fixture").append(el);
    var v1 = v(el);

    var eventArgs = [];

    var v2 = v("<div>").addClass("test").appendTo(v1);
    var v3 = v("<span>").appendTo(v2);

    v1.on("click.test", ".test", function(e) {
        eventArgs.push($.extend({}, e));
        assert.strictEqual(this, e.currentTarget);
    });

    v3.trigger("click");


    assert.strictEqual(eventArgs.length, 1, "event count");
    assert.strictEqual(eventArgs[0].type, "click", "event 1 type");
    assert.strictEqual(eventArgs[0].target, v3[0], "event 1 target");
    assert.strictEqual(eventArgs[0].currentTarget, v2[0], "event 1 currentTarget");
    assert.strictEqual(eventArgs[0].delegateTarget, v1[0], "event 1 delegateTarget");
});

QUnit.test("change text in inner element", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    var v2 = v("<span>").appendTo(v1).text("Test1");
    var v3 = v("<span>").appendTo(v1).text("Test2");

    assert.equal(v1[0].innerHTML, "<span>Test1</span><span>Test2</span>", "vdom element innerHTML");

    v3.text("Test2 new");
    v3.apply();

    assert.equal(v1[0].innerHTML, "<span>Test1</span><span>Test2 new</span>", "vdom element innerHTML");
});

QUnit.test("apply for non-changed element", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    var v2 = v("<span>").appendTo(v1).text("Test1");
    var v3 = v("<span>").appendTo(v1).text("Test2");

    assert.equal(v1[0].innerHTML, "<span>Test1</span><span>Test2</span>", "vdom element innerHTML");

    var el2 = v2.node;
    var el3 = v3.node;

    v1.apply();

    assert.equal(v1[0].innerHTML, "<span>Test1</span><span>Test2</span>", "vdom element innerHTML");
    assert.strictEqual(el2, v1[0].childNodes[0], "vdom element innerHTML");
    assert.strictEqual(el3, v1[0].childNodes[1], "vdom element innerHTML");
});

QUnit.test("empty and replace", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    var v2 = v("<div>").addClass("test1").appendTo(v1);
    var v3 = v("<div>").addClass("test2").appendTo(v1);

    v("<span>").text("1").appendTo(v2);
    v("<span>").addClass("selected").text("2").appendTo(v3);
    v("<span>").text("3").appendTo(v3);

    assert.equal(v1[0].innerHTML, "<div class=\"test1\"><span>1</span></div><div class=\"test2\"><span class=\"selected\">2</span><span>3</span></div>", "vdom element innerHTML");

    v1.empty();
    v3 = v("<div>").addClass("test2").appendTo(v1);
    v("<span>").text("2").appendTo(v3);
    v("<span>").addClass("selected").text("3").appendTo(v3);

    v3.width();

    assert.equal(v1[0].innerHTML, "<div class=\"test2\"><span>2</span><span class=\"selected\">3</span></div>", "vdom element innerHTML after remove");
});

QUnit.test("replaceWith", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    var v2 = v("<div>").addClass("test1").appendTo(v1);
    var v3 = v("<div>").addClass("test2").appendTo(v1);

    v("<span>").text("1").appendTo(v2);
    v("<span>").addClass("selected").text("2").appendTo(v3);
    v("<span>").text("3").appendTo(v3);

    assert.equal(v1[0].innerHTML, "<div class=\"test1\"><span>1</span></div><div class=\"test2\"><span class=\"selected\">2</span><span>3</span></div>", "vdom element innerHTML");

    var v3new = v("<div>").addClass("test2");
    v("<span>").text("2").appendTo(v3new);
    v("<span>").addClass("selected").text("3").appendTo(v3new);

    v3.replaceWith(v3new);

    v3new.width();

    assert.equal(v1[0].innerHTML, "<div class=\"test1\"><span>1</span></div><div class=\"test2\"><span>2</span><span class=\"selected\">3</span></div>", "vdom element innerHTML after remove");
});


QUnit.test("append tr in table", function(assert) {
    var el = document.createElement("div");

    var v1 = v(el);
    var table = v("<table>").appendTo(v1);
    v("<colgroup>").appendTo(table);

    v("<tr>").appendTo(table);
    v("<tr>").appendTo(table);

    assert.equal(v1[0].innerHTML, "<table><colgroup></colgroup><tbody><tr></tr><tr></tr></tbody></table>", "vdom element innerHTML");
});