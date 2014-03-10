sigma.canvas.edges.curve = function(edge, source, target, context, settings) {
    var color = edge.color,
    prefix = settings('prefix') || '',
    edgeColor = settings('edgeColor'),
    defaultNodeColor = settings('defaultNodeColor'),
    defaultEdgeColor = settings('defaultEdgeColor'),
    controlPointX =
    (source[prefix + 'x'] + target[prefix + 'x']) / 2 +
    (target[prefix + 'y'] - source[prefix + 'y']) / 4,
    controlPointY =
    (source[prefix + 'y'] + target[prefix + 'y']) / 2 +
    (source[prefix + 'x'] - target[prefix + 'x']) / 4;

    if (!color)
        switch (edgeColor) {
            case 'source':
                color = source.color || defaultNodeColor;
                break;
            case 'target':
                color = target.color || defaultNodeColor;
                break;
            default:
                color = defaultEdgeColor;
                break;
        }

    context.strokeStyle = color;
    context.lineWidth = edge[prefix + 'size'];
    context.beginPath();
    context.moveTo(source[prefix + 'x'], source[prefix + 'y']);
    context.quadraticCurveTo(
        controlPointX,
        controlPointY,
        target[prefix + 'x'],
        target[prefix + 'y']
        );

    context.stroke();
};                        
             
             

sigma.canvas.nodes.image = (function() {
    var _cache = {},
    _loading = {},
    _callbacks = {};

    // Return the renderer itself:
    var renderer = function(node, context, settings) {
        var args = arguments,
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        color = node.color || settings('defaultNodeColor'),
        url = node.url;

        if (_cache[url]) {
            context.save();

            // Draw the clipping disc:
            context.beginPath();
            context.arc(
                node[prefix + 'x'],
                node[prefix + 'y'],
                node[prefix + 'size'],
                0,
                Math.PI * 2,
                true
                );
            context.closePath();
            context.clip();

            // Draw the image
            context.drawImage(
                _cache[url],
                node[prefix + 'x'] - size,
                node[prefix + 'y'] - size,
                2 * size,
                2 * size
                );

            // Quit the "clipping mode":
            context.restore();

            // Draw the border:
            context.beginPath();
            context.arc(
                node[prefix + 'x'],
                node[prefix + 'y'],
                node[prefix + 'size'],
                0,
                Math.PI * 2,
                true
                );
            context.lineWidth = size / 2.5;
            context.strokeStyle = node.color || settings('defaultNodeColor');
            context.stroke();
        } else {
            sigma.canvas.nodes.image.cache(url);
            sigma.canvas.nodes.def.apply(
                sigma.canvas.nodes,
                args
                );
        }
    };

    // Let's add a public method to cache images, to make it possible to
    // preload images before the initial rendering:
    renderer.cache = function(url, callback) {
        if (callback)
            _callbacks[url] = callback;

        if (_loading[url])
            return;

        var img = new Image();

        img.onload = function() {
            _loading[url] = false;
            _cache[url] = img;

            if (_callbacks[url]) {
                _callbacks[url].call(this, img);
                delete _callbacks[url];
            }
        };

        _loading[url] = true;
        img.crossOrigin = 'anonymous'; 
        img.src = url;
        img.onerror = function (){
            this.onerror=null;
            this.src="images/unkProf.jpg"
        }
    };

    return renderer;
})();