//Made by Shiven Kumar using BabylonJS 101 Tutorials
canvas = document.getElementById("renderCanvas"); // Get the canvas element 
engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
items = [];
areas = [];
versionCounts = [];
versions = [];
uptimes = [];
hostnames = [];
uniqueAreas = [];
uniqueVersions = [];
uptimePerArea = [];
uptimePerVersion = [];
totalVersionCount = 0;
DATA_SCALE = 20;


/******* Add the create scene function ******/
function createScene() {

        for(var i = 0; i<54; i++){
                uptimePerVersion.push(0);
        }
        for(var i = 0; i<54; i++){
                versionCounts.push(0);
        }

        var scene = new BABYLON.Scene(engine);
        var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, 1.0), scene);
        var camera = new BABYLON.UniversalCamera("UniversalCamera", BABYLON.Vector3.Zero(), scene);
        camera.cameraAcceleration = 5;
        light.position = new BABYLON.Vector3(0, 25, -50);
        camera.attachControl(canvas, true);

        // Add lights to the scene
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        
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
                        uptimePerVersion[uniqueVersions.indexOf(value.version)] += parseInt(value.uptime, 10);
                        versionCounts[uniqueVersions.indexOf(value.version)] ++;
                });

                /*var count = 0;
                for(var i = 0; i < uptimePerArea.length; i++){
                        var box = BABYLON.MeshBuilder.CreateBox("box", {height: parseInt(uptimePerArea[i]/10000)+0.001, width:10, depth:10}, scene);
                        box.position = new BABYLON.Vector3(20*count, uptimePerArea[i]/20000, 0);
                        console.log(uptimePerArea[i]);
                        count++;
                }*/

                // Data

        for(var i in versionCounts){
                totalVersionCount += parseInt(i, 10);
        }

        var scale = 0.6;
        var areaSeries = [];
        console.log(versionCounts);
        var versionSeries = [];
        for(var i = 0; i<uptimePerVersion.length; i++){
                var colorMod = 255-(i*(255/uptimePerVersion.length));
                versionSeries.push({label: uniqueVersions[i], value: (uptimePerVersion[i]/DATA_SCALE)/versionCounts[i], color: new BABYLON.Color3(153/255, 51/255, 1)});
        }
        console.log(versionSeries);
        
        var browsers_Series = [
                { label: "IE", value: 32, color: new BABYLON.Color3(0, 0, 1) },
                { label: "Chrome", value: 28, color: new BABYLON.Color3(1, 0, 0) },
                { label: "Firefox", value: 16, color: new BABYLON.Color3(1, 0, 1) },
                { label: "Opera", value: 14, color: new BABYLON.Color3(1, 1, 0) },
                { label: "Safari", value: 10, color: new BABYLON.Color3(0, 1, 1) }        
            ];

        var currentSeries = versionSeries;
        var playgroundSize = 100;//currentSeries.length*20 + 50;
        camera.setTarget(new BABYLON.Vector3(playgroundSize/2, 20, -10));

        var background = BABYLON.Mesh.CreatePlane("background", playgroundSize, scene, false);
        background.material = new BABYLON.StandardMaterial("background", scene);
        background.scaling.y = 0.5;
        background.position.z = playgroundSize / 2 - 0.5;
        background.position.y = playgroundSize / 4;
        background.receiveShadows = true;
        var backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
        background.material.diffuseTexture = backgroundTexture;
        background.material.specularColor = new BABYLON.Color3(0, 0, 0);
        background.material.backFaceCulling = false;

        backgroundTexture.drawText("Bloomberg", null, 80, "bold 70px Segoe UI", "white", "#555555");
        backgroundTexture.drawText("Average Uptime per Version", null, 250, "35px Segoe UI", "white", null);

        // Ground    
        var ground = BABYLON.Mesh.CreateGround("ground", 10000, 10000, 1, scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground.material = groundMaterial;
        ground.receiveShadows = true;
        ground.position.y = -0.1;
        
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
                shadowGenerator.usePoissonSampling = true;
    
    var createSeries = function (series) {
        var margin = 0.1;
        var offset = 20; //playgroundSize / (series.length) - margin;
        var x = -playgroundSize / 2 + offset / 2;

        for (var index = 0; index < series.length; index++) {
            var data = series[index];

            var bar = BABYLON.Mesh.CreateBox(data.label, 1.0, scene, false);
            bar.scaling = new BABYLON.Vector3(offset / 2.0, 0, offset / 2.0);
            bar.position.x = x;
            bar.position.y = 0;
            
            // Animation
            var animation = new BABYLON.Animation("anim", "scaling", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3);
            animation.setKeys([
                { frame: 0, value: new BABYLON.Vector3(offset / 2.0, 0, offset / 2.0) },
                { frame: 100, value: new BABYLON.Vector3(offset / 2.0, data.value * scale, offset / 2.0) }]);
            bar.animations.push(animation);
            
            animation = new BABYLON.Animation("anim2", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            animation.setKeys([
                { frame: 0, value: 0 },
                { frame: 100, value: (data.value * scale) / 2 }]);
            bar.animations.push(animation);            
            scene.beginAnimation(bar, 0, 100, false, 2.0);

            // Materials
            bar.material = new BABYLON.StandardMaterial(data.label + "mat", scene);
            bar.material.diffuseColor = data.color;
            bar.material.emissiveColor = data.color.scale(0.3);
            bar.material.specularColor = new BABYLON.Color3(0, 0, 0);

            // Shadows
            shadowGenerator.getShadowMap().renderList.push(bar);
                        
            // Graph Legend
            var barLegend = BABYLON.Mesh.CreateGround(data.label + "Legend", playgroundSize / 2, offset * 2, 1, scene, false);
            barLegend.position.x = x;
            barLegend.position.z = -playgroundSize / 4;
            barLegend.rotation.y = Math.PI / 2;
            
            barLegend.material = new BABYLON.StandardMaterial(data.label + "LegendMat", scene);
            var barLegendTexture = new BABYLON.DynamicTexture("dynamic texture", 700, scene, true);
            barLegendTexture.hasAlpha = true;
            barLegend.material.diffuseTexture = barLegendTexture;
            barLegend.material.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0.4); 
            
            var size = barLegendTexture.getSize();
            barLegendTexture.drawText(data.label + " (" + Number.parseFloat((data.value*DATA_SCALE)/totalVersionCount).toFixed(2) + "%)", 80, size.height / 2 + 30, "bold 50px Segoe UI", "white", "transparent");
            
            // Moving on to the next bar
            x += offset + margin;
        }
    };

    createSeries(currentSeries);
        });

        camera.attachControl(canvas, true);


    // Limit camera
    camera.minZ = 0;


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