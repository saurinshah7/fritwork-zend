
           
         
var QueryString = function () {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
        // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]], pair[1] ];
            query_string[pair[0]] = arr;
        // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    } 
    return query_string;
} ();
            
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
            
function sortDropDownListByText() {
    // Loop for each select element on the page.
    $("#friends").each(function() {
         
        // Keep track of the selected option.
        var selectedValue = $(this).val();
 
        // Sort all the options by text. I could easily sort these by val.
        $(this).html($("option", $(this)).sort(function(a, b) {
            return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
        }));
 
   
    });
    $('#friends option:first-child').attr("selected", "selected");
}
        
function getData(no)
{
    var json;
    $.ajax({
        url: "data/graph.json",
        async: false,
        success: function (data) {
            json=data;
            console.log(json)
               
        },
        error: function (error, message) {
               
        }
    });
        
        
    return json;
} 
            

            
            
function getDataForNodes()
{
    var json=[];
    $.ajax({
        url: "fritwork/friends",
        async: false,
        dataType: "json",
        success: function (data) {
            var js=data;
            for(var i=0;i<js.length;i++)
            {
                json[i]=js[i]
                        
            
            }
        },
        error: function (error, message) {
               
        }
    });
        
        
    return json;
} 
            
            
function getDataForEdges()
{
    var json=[];
    $.ajax({
        url: "fritwork/friendships",
        dataType: "json",
        async: false,
        success: function (data) {
            js=data;
            
                       
            for(var i=0;i<js.length;i++){
                var a=js[i]['source'];
                var b=js[i]['target'];
                
               
                //   console.log(str);
                
                json.push([a,b]);
                           
                           
            }
           
                        
        //   console.log(json)
               
        },
        error: function (error, message) {
            console.log(error)
        }
    });
        
        
    return json;
} 
            
function inputDataIntoSelect(){
           
    for(var i=0;i<nodes.length;i++){
        // console.log(i)
        if(nodes[i]['uid']!=-1)
            $("#friends").append("<option value=\""+nodes[i]['uid']+"\">"+nodes[i]['name']+"</option>")
                
                
    }
    sortDropDownListByText()
            
            
}
            
function doAction(){
    var id=$('#friends').find(":selected").attr("value");
    var opt=$('#action').find(":selected").attr("value");
               
    switch (opt){
        case 'add':
            addNodeToGraph(id);
                       
            break;
        case 'delete':
            deleteNodeFromGraph(id);
            break;
                        
        case 'panTo':
            panToNode(id);
            break;
                            
        case 'indi':
            genGraph(1,id);
            break;
    }
               
               
               
}
            
            
function findNodeBasedOnId(id){
    var i=0
    while(nodes[i]['uid']!=id){
        i++;
    }
    return nodes[i];          
               
}

function addNodeToGraph(id){
    var type;
   
    type="image"; 
    var colors = [
    '#617db4',
    '#668f3c',
    '#c6583e',
    '#b956af'
    ];
                
    if(typeof main.graph.nodes(id)=="undefined")
    {
                
        if (!((main.forceatlas2 || {}).isRunning)) {
            main.startForceAtlas2();
            var node=nodes[id];
            main.graph.addNode({
                id: ""+node['uid'],
                label:""+ node['name'],
                type: type,
                url: node['pic_square'] ,
                x: Math.random(),
                y: Math.random(),
                size: Math.random(),
                color: colors[Math.floor(Math.random() * colors.length)]
                            
            })
            main.stopForceAtlas2();
        }
        else
        {
            var node=nodes[id];
            main.graph.addNode({
                id: ""+node['uid'],
                label:""+ node['name'],
                type: type,
                url: node['pic_square'] ,
                x: Math.random(),
                y: Math.random(),
                size: Math.random(),
                color: colors[Math.floor(Math.random() * colors.length)]
                            
            })
                        
        }
        
        for(var i=0;i<edges.length;i++){
            if((edges[i][0]==id && (typeof main.graph.nodes(""+edges[i][1])!="undefined")) || (edges[i][1]==id && (typeof main.graph.nodes(""+edges[i][0])!="undefined")) ){
                console.log(edges[i][0]+","+edges[i][1])
                           
                main.graph.addEdge({
                    id:  edges[i][0]+',' +  edges[i][1],
                    type:"curve", 
                    source: '' + edges[i][0],
                    target: '' + edges[i][1],
                    size: 1
                                    
                                    
                })
            }
        }
                        
    }
    else{
        alert("Node already on the graph");
    }
}


           
function deleteNodeFromGraph(id){
    if(typeof main.graph.nodes(""+id)=="undefined")
    {
        alert("Node not present on graph")
    }else
    {
        main.graph.dropNode(""+id)
        main.refresh();
    }
                
                
}
        
function panToNode(id){
                
        
    if(typeof main.graph.nodes(id)=="undefined")
    {
        alert("Node not present on graph")
    }else
    {
        var node=main.graph.nodes(id);
        main.cameras[0].goTo({
            x: node['read_cam0:x'],
            y: node['read_cam0:y'],
            angle: 0,
            ratio: 0.09375
        })
        // main.stopForceAtlas2();
        highlightNode(id);
        
    }
}
        
           
            
function highlightNode(id){
                
                
    var edgesOnGraph=main.graph.edges();
    for(var i=0;i<edgesOnGraph.length;i++){
        if(edgesOnGraph[i].source==id || edgesOnGraph[i].target==id )
            edgesOnGraph[i].hidden=false;
        else
            edgesOnGraph[i].hidden=true;  
    }
                                  
                                  
                                  
    panOnNode=1;
    main.stopForceAtlas2();
    document.getElementById('toggle-layout').innerHTML = 'Start: Cluster Formation';
    main.settings('edgeColor','default');
    main.settings('minEdgeSize','1.5');
    main.settings('maxEdgeSize','1.5');
    main.settings('drawEdges',true);
    main.refresh();
              
               
}    
           


         
           
function genGraph(conNo,id){
    document.getElementById('toggle-layout').innerHTML = 'Stop: See Connections';
    var type="image";
   
   if(typeof main!='undefined')
    {
        main.graph.clear();
        $("#graph-container").html("");
        main.settings('edgeColor','source');
        main.settings('minEdgeSize','1');
        main.settings('maxEdgeSize','1');
    }
                 
    var i,
    s,
    g = {
        nodes: [],
        edges: []
    },
    urls = [
    'img/img1.png',
    'img/img2.png',
    'img/img3.png',
    'img/img4.png'
    ],
    loaded = 0,
    colors = [
    '#617db4',
    '#668f3c',
    '#c6583e',
    '#b956af'
    ];
                                
    s=main;
    if(conNo==0){
        var numb=(typeof QueryString.nodes!="undefined")?QueryString.nodes:300;
        for (i = 0; i < nodes.length; i++) {
               
            if(nodes[i]['uid']<numb &&nodes[i]['uid']!=-1)
                g.nodes.push({
                    id: ""+nodes[i]['uid'],
                    label:""+ nodes[i]['name'],
                    type: type,
                    url: nodes[i]['pic_square'] ,
                    x: Math.random(),
                    y: Math.random(),
                    size: Math.random(),
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
        }

        for (i = 0; i < edges.length; i++)
            if(edges[i][0]<numb && edges[i][1]<numb ){
                g.edges.push({
                    id:  edges[i][0]+',' +  edges[i][1],
                    type:"curve", 
                    source: '' + edges[i][0],
                    target: '' + edges[i][1],
                    size: 1
                });
            }
    }
    else
    {
        var edgeNo=0,ar=[];
        g.nodes.push({
            id: ""+nodes[id]['uid'],
            label:""+nodes[id]['name'],
            type: type,
            url: nodes[id]['pic_square'] ,
            x: Math.random(),
            y: Math.random(),
            size: Math.random(),
            color: colors[Math.floor(Math.random() * colors.length)]
        });
                
        ar[id]=1;
                                        
        for (i = 0; i < edges.length; i++){
                        
            if(edges[i][0]==id || edges[i][1]==id ){
               
                g.edges.push({
                    id: edges[i][0]+',' +  edges[i][1],
                    type:"curve", 
                    source: '' + edges[i][0],
                    target: '' + edges[i][1],
                    size: 1
                })
                edgeNo++;
                
                if(typeof ar[edges[i][0]]=='undefined'){
                  
                    g.nodes.push({
                        id: ""+nodes[edges[i][0]]['uid'],
                        label:""+nodes[edges[i][0]]['name'],
                        type: type,
                        url: nodes[edges[i][0]]['pic_square'] ,
                        x: Math.random(),
                        y: Math.random(),
                        size: Math.random(),
                        color: colors[Math.floor(Math.random() * colors.length)]
                    });
                
                    ar[edges[i][0]]=1;
                    
                }
                
                if(typeof ar[edges[i][1]]=='undefined'){
                   g.nodes.push({
                        id: ""+nodes[edges[i][1]]['uid'],
                        label:""+ nodes[edges[i][1]]['name'],
                        type: type,
                        url: nodes[edges[i][1]]['pic_square'] ,
                        x: Math.random(),
                        y: Math.random(),
                        size: Math.random(),
                        color: colors[Math.floor(Math.random() * colors.length)]
                    });
                
                    ar[edges[i][1]]=1;
                    
                }
                
            
            }
                
                
        ;
        }
                
        for (i = 0; i < edges.length; i++){
                      
            if((typeof ar[edges[i][1]]!='undefined' && edges[i][1]!=id) && (typeof ar[edges[i][0]]!='undefined' && edges[i][0]!=id) ){
                //     console.log(edges[i][0]+",,"+edges[i][1])
                    
                g.edges.push({
                    id: edges[i][0]+',' +  edges[i][1],
                    type:"curve", 
                    source: '' + edges[i][0],
                    target: '' + edges[i][1],
                    size: 1
                })
                edgeNo++;
            }
                    
        }
                   
                   
    }
                
   
    urls.forEach(function(url) {
        sigma.canvas.nodes.image.cache(
            url,
            function() {
                if (++loaded === urls.length)
                { // Instanciate sigma:
                    s = new sigma({
                        graph: g,
                        renderer: {
                            // IMPORTANT:
                            // This works only with the canvas renderer, so the
                            // renderer type set as "canvas" is necessary here.
                            container: document.getElementById("graph-container"),
                            type: 'canvas'
                        },
                        settings: {
                            minNodeSize: 8,
                            maxNodeSize: 16,
                            drawEdges:false,
                            labelThreshold: 30
                        }
                    });
                    var k=-5;
                    var startNode=new Date();
                    
                    s.bind('clickNode', function(e) {
                         
                        var diff=new Date()-startNode;
                        if(k==e.data.node.id && diff<=300){
                               
                                   
                            s.graph.clear(); 
                            s.refresh(); 
                                
                            console.log(k)
                            genGraph(1,e.data.node.id)
                                
                        }
                        else
                        {
                            k=e.data.node.id;
                            startNode=new Date();
                            highlightNode(k);
                        }
                         
                        $("#dispName").html( "Name: "+ e.data.node.label)     
                        console.log(e.type, e.data.node.label, e.data.node.id);
                           
                           
                    });
                        
                    s.bind('clickStage', function(e) {                      
                        console.log("clickStage")
                        if((main.cameras[0].x==camx && main.cameras[0].y==camy) && panOnNode==1 && !(main.forceatlas2 || {}).isRunning){
                            document.getElementById('toggle-layout').innerHTML = 'Start: Cluster Formation';
                            var edgesOnGraph=main.graph.edges();
                            for(var i=0;i<edgesOnGraph.length;i++){
                                edgesOnGraph[i].hidden=false;
                            }
                            main.settings('edgeColor','source'); 
                            main.settings('minEdgeSize','1');
                            main.settings('maxEdgeSize','1');
                            main.refresh();
                            panOnNode=0;    
                        }
                            
                        startStage=new Date();                          
                    })
                    
                    s.startForceAtlas2();                        
                    document.getElementById('getAll').addEventListener('click', function(){
                        s.graph.clear(); 
                        s.refresh();                               
                        genGraph(0,1)
                    })
                    main=s;
                }
            }
            );
    });
                
            
}


function clickPicture(){
           
    var imgData;      
    imgData = main.renderers[0].domElements.scene.toDataURL();      
    console.log(imgData);    
    window.open(imgData)           
}

function onCompletingRequest(){
    
   
    console.log(new Date()-strt)
    inputDataIntoSelect();
    $("#graph-container").html("");
    genGraph(0,1)
    document.getElementById('toggle-layout').addEventListener('click', function() {
        if ((main.forceatlas2 || {}).isRunning) {
            main.stopForceAtlas2();
                               
            main.settings('drawEdges',true);
            document.getElementById('toggle-layout').innerHTML = 'Start: Cluster Formation';
        } else {
            main.settings('drawEdges',false);
          
            main.startForceAtlas2();
          
            document.getElementById('toggle-layout').innerHTML = 'Stop: See Connections';
        }
    });
    
}      
 
var main,camx,camy,panOnNode=0,edgesDone=0,nodesDone=0,tot,edgesQ=-1,ed1=[],edges=[];
     
var strt=new Date();

//getTotalFriends();
//console.log(new Date()-strt)

var nodes=getDataForNodes();
var edges=getDataForEdges();
onCompletingRequest()