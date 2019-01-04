//Made by Shiven Kumar using BabylonJS 101 Tutorials
var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

        /******* Add the create scene function ******/
        function createScene() {
            var scene = new BABYLON.Scene(engine);
            var camera = new BABYLON.ArcRotateCamera("cam", -Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero());
            var anchor = new BABYLON.TransformNode("");
        
            camera.wheelDeltaPercentage = 0.01;
            camera.attachControl(canvas, true);
        
            // Create the 3D UI manager
            var manager = new BABYLON.GUI.GUI3DManager(scene);
        
            var panel = new BABYLON.GUI.SpherePanel();
            panel.margin = 0.2;
         
            manager.addControl(panel);
            panel.linkToTransformNode(anchor);
            panel.position.z = -1.5;
            
            //Adding Buttons

            function buttonMaker(){
                var upVsArea = new BABYLON.GUI.HolographicButton("orientation");
                panel.addControl(upVsArea);
                upVsArea.text = "Uptime per Area";

                var upVsVersion = new BABYLON.GUI.HolographicButton("orientation");
                panel.addControl(upVsVersion);
                upVsVersion.text = "Uptime per Version";
            }
            
            panel.blockLayout = true;
            for (var index = 0; index < 30; index++) {
                buttonMaker();    
            }
            panel.blockLayout = false;
        
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