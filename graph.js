var network = null,
    data = null,
    visitedColor = '#97FCC2',
    normalColor = '#97C2FC',
    order = 1,
    visitedNodes = [],
    btnDraw = document.getElementById('draw'),
    btnClear = document.getElementById('clear'),
    btnDepthBypass = document.getElementById('depthBypass'),
    btnBreadthBypass = document.getElementById('breadthBypass'),
    txtData = document.getElementById('data'),
    txtError = document.getElementById('error');

btnDraw.onclick = draw;
btnClear.onclick = clearGraph;
btnDepthBypass.onclick = depthBypass;
btnBreadthBypass.onclick = breadthBypass;

window.onresize = function() {
    network.redraw()
};

function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
}

function clearGraph() {
    for (var i in network.nodes) {
        network.nodes[i].options.color.background = normalColor;
    }

    order = 1;
    visitedNodes = [];
    network.redraw();
}

function highlightNode(node, timeout) {
    setTimeout(function() {
        node.options.color.background = visitedColor;
        network.redraw();
    }, timeout);
}

function getSelectedNode() {
    node = network.nodes[network.getSelectedNodes()[0]];
    txtError.innerHTML = '';

    if (!node) {
        txtError.innerHTML = 'Choose one node';
    }

    return node;
}

function breadthBypass() {

    var node = getSelectedNode(),
        q = [node.id];

    clearGraph();

    while (q.length) {
        var nodeId = q.shift(),
            node = network.nodes[nodeId];

        visitedNodes.push(nodeId);
        highlightNode(node, 1000 * order++);

        for (var i = 0; i < node.edges.length; i++) {
            var edge = node.edges[i],
                nextNode = edge.from == node ?
                    nextNode = edge.to.id :
                    nextNode = edge.from.id;

            if (!visitedNodes.contains(nextNode)) {
                q.push(nextNode);
            }
        }
    }
}

function depthBypass() {

    var selectedNode = getSelectedNode();

    clearGraph();

    depth(selectedNode);
}

function depth(node) {

    visitedNodes.push(node.id);
    highlightNode(node, 1000 * order++);

    for (var i = 0; i < node.edges.length; i++) {
        var edge = node.edges[i],
            nextNode = edge.from == node ?
                nextNode = edge.to.id :
                nextNode = edge.from.id;

        if (!visitedNodes.contains(nextNode)) {
            depth(network.nodes[nextNode]);
        }
    }
}

function draw() {

    destroy();

    try {
        txtError.innerHTML = '';

        var nodes = [], edges = [],
            data = txtData.value.split('\n'),
            n = parseInt(data[0]);

        for (var i = 1; i <= n; i++) {
            nodes.push({id: i, color: normalColor});
        }

        for (var i = 1; i < data.length; i++) {
            var edge = data[i].split(' ');
            edges.push({
                from: parseInt(edge[0]),
                to: parseInt(edge[1]),
                color: normalColor
            });
        }

        var container = document.getElementById('mynetwork'),
            options = {};

        network = new vis.Network(
            container,
            {edges:edges, nodes:nodes},
            options
        );

    } catch (err) {
        var match = /\(char (.*)\)/.exec(err);
        if (match) {
            var pos = Number(match[1]);

            if(txtData.setSelectionRange) {
                txtData.focus();
                txtData.setSelectionRange(pos, pos);
            }
        }

        txtError.innerHTML =  err.toString();
    }
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
