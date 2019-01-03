//Made by Shiven Kumar using BabylonJS 101 Tutorials
var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
var items = [];
var areas = [];
var versions = [];
var uptimes = [];
var hostnames = [];
var uniqueAreas = [];
var uniqueVersions = [];
var uptimePerArea = [];
var uptimePerVersion = [];


/******* Add the create scene function ******/
function createScene() {

        for(var i = 0; i<12; i++){
                uptimePerArea.push(0);
                uptimePerVersion.push(0);
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
        });


        for(var i = 0; i<uptimePerArea.length; i++){
                var box = BABYLON.MeshBuilder.CreateBox("box", {height: parseInt(uptimePerArea[i], 10), width:1, depth:1}, scene);
                box.position = new BABYLON.Vector3(2*i, 0, 0);
        }

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