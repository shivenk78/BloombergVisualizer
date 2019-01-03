//Made by Shiven Kumar using BabylonJS 101 Tutorials
canvas = document.getElementById("renderCanvas"); // Get the canvas element 
engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
items = [];
areas = [];
versions = [];
uptimes = [];
hostnames = [];
uniqueAreas = [];
uniqueVersions = [];
let uptimePerArea = [];
uptimePerVersion = [];


/******* Add the create scene function ******/
function createScene() {

        for(var i = 0; i<11; i++){
                uptimePerArea.push(0);
        }

        // Create the scene space
        var scene = new BABYLON.Scene(engine);
        var pilot = new BABYLON.Vector3(0,0,0);

        // Add a camera to the scene and attach it to the canvas
        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);
        camera.attachControl(canvas, true);

        // Add lights to the scene
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
        
        $.getJSON("https://shivenk78.github.io/BloombergVisualizer/SBHSData.json", function(data){
                $.each(data, function (index, value) {
                        areas.push(value.area);
                        versions.push(value.version);
                        if(value.uptime===""){
                                value.uptime = 0;
                        }else{
                                uptimes.push(value.uptime);
                        }
                        hostnames.push(value.hostname);
                        if(!uniqueAreas.includes(value.area)){
                                uniqueAreas.push(value.area);
                        }
                        if(!uniqueVersions.includes(value.version)){
                                uniqueVersions.push(value.version);
                        }
                        items.push(value);
                        uptimePerArea[uniqueAreas.indexOf(value.area)] += parseInt(value.uptime, 10);
                        uptimePerVersion[uniqueVersions.indexOf(value.version)] += parseInt(value.uptime, 10);
                });

                var count = 0;
                for(var i = 0; i < uptimePerArea.length; i++){
                        var box = BABYLON.MeshBuilder.CreateBox("box", {height: parseInt(uptimePerArea[i]/10000)+0.001, width:10, depth:10}, scene);
                        box.position = new BABYLON.Vector3(20*count, uptimePerArea[i]/20000, 0);
                        console.log(uptimePerArea[i]);
                        count++;
                }
        });

        return scene;
};
/******* End of the create scene function ******/    

var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () { 
        scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () { 
        engine.resize();
});