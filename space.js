//* Node modules 
//// import './style.css';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { WEBGL } from 'three/examples/jsm/WebGL';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { randInt } from 'three/src/math/MathUtils';

//* CDN  || https://cdn.skypack.dev/three to check version
//// import './style.css';
import * as THREE from 'https://cdn.skypack.dev/three@v0.131.3';
import { OrbitControls } from 'https://cdn.skypack.dev/three@v0.131.3/examples/jsm/controls/OrbitControls';
import { WEBGL } from 'https://cdn.skypack.dev/three@v0.131.3/examples/jsm/WebGL';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@v0.131.3/examples/jsm/loaders/GLTFLoader';
import { randInt } from 'https://cdn.skypack.dev/three@v0.131.3/src/math/MathUtils';



// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 250);  // TODO - Change 2500 -> 250
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg') });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// Responsive size & aspect ratio
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // TODO check what this does
})

camera.position.setZ(0);
// camera.position.setX();



// Lights
// * =============================================================================
// const pointLight = new THREE.PointLight(0xffffff);
// scene.add(pointLight);
// pointLight.position.set(20, 0, -50);


// const lightHelperPoint = new THREE.PointLightHelper(pointLight);
// scene.add(lightHelperPoint);

const spotLightV1 = new THREE.SpotLight();
spotLightV1.position.set( -100, 300, 0 );

scene.add(spotLightV1);

// const spotLightV1Helper = new THREE.SpotLightHelper(spotLightV1);
// scene.add(spotLightV1Helper);
// * =============================================================================

// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

// Helpers
// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);


// Introduction 
const clock = new THREE.Clock();
let mixer;

const loader = new GLTFLoader();
loader.load('./animations/astronaut/scene.gltf', function (gltf) { // TODO fix
    scene.add(gltf.scene);
    gltf.scene.position.x = 40;
    gltf.scene.position.z = -40;
    gltf.scene.position.y = -20;
    gltf.scene.scale.set(4, 4, 4); //Setting the scale of the model
    mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    })
});

let sleep = ms => {  return new Promise(resolve => setTimeout(resolve, ms));  };

//* Rocket
function createRocket(cordX) {
    const loader = new GLTFLoader();
    loader.load('./animations/rocket/scene.gltf', function (gltf) {
        scene.add(gltf.scene);
        gltf.scene.scale.set(500,500,500)
        gltf.scene.position.z = -250;

        // gltf.scene.rotation.z = 90;
        // gltf.scene.rotation.z = -80;
        // gltf.scene.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));  //?  <== To mirror/flip the model/object 
        // console.log(gltf.scene.position);

        // Tween - X == 25 - 65 | 80 - 350
        var position = { x : cordX, y: -240 };
        var target = { x : cordX, y: 190 }; //Target to 190 
        var tween = new TWEEN.Tween(position).to(target, 4000);

        tween.onUpdate(function(){
            gltf.scene.position.x = position.x;
            gltf.scene.position.y = position.y;

            if (gltf.scene.position.y == target.y) {
                scene.remove(gltf.scene);
                //? Add fireworks or something?
                // fireworks(cordX);

                // Mesh object //! | This works 
                // const geo = new THREE.TorusGeometry(10, 3, 16, 100);
                // const mesh = new THREE.MeshBasicMaterial({color:0xfe00})
                // const particle = new THREE.Mesh(geo, mesh);
                // scene.add(particle);
                // particle.position.z = -250;
                // particle.position.x = cordX;
                // particle.position.y = 100;

                // function animate2() {
                //     requestAnimationFrame(animate2);
                //     renderer.render(scene, camera);
                //     particle.rotateX(0.05);
                // }
                // animate2();
                
                // sleep(2000).then(() => {
                //     scene.remove(particle)
                //     geo.dispose();
                //     mesh.dispose();
                // });
                
                // End of line //*-------------------------------------------------------
            }
        });
        tween.start();
    });
}
setInterval(() => {
    createRocket(randInt(80, 350))  //X axis coordinates 
}, Math.floor(Math.random() * (2000) + 1000)); //return Math.floor((Math.random() * (max-min)) +min);
//* ---------------------------------------------------------------------------------------------------------------





// Solar System 
const planetsArray = Array(10)  // array to contain all the planets

// Earth Image
// const earthTexture = new THREE.TextureLoader().load('./images/world-map-binary-digit-texture-background.jpg');
// const earthTexture = new THREE.TextureLoader().load('./images/planets/earth.jpg');
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(32, 32, 32),
    new THREE.MeshBasicMaterial({
        // color: 0xFFFFFF
        map: new THREE.TextureLoader().load('./images/planets/earth.jpg') // earthTexture
    })
);
scene.add(earth);
earth.position.z = -20;
planetsArray.push(earth);

// Venus Image
const venus = new THREE.Mesh(
    new THREE.SphereGeometry(32, 32, 32),
    new THREE.MeshBasicMaterial({
        // color: 0xFFFFFF
        map: new THREE.TextureLoader().load('./images/planets/venus.png')
    })
);
scene.add(venus);
venus.position.z = -10;
venus.position.y = -60;
venus.position.x = -60;
planetsArray.push(venus);

// Mercury Image
const mercury = new THREE.Mesh(
    new THREE.SphereGeometry(16, 32, 32),
    new THREE.MeshBasicMaterial({
        // color: 0xFFFFFF
        map: new THREE.TextureLoader().load('./images/planets/mercury.png')
    })
);
scene.add(mercury);
mercury.position.z = -20;
mercury.position.y = -110;
mercury.position.x = -110;
planetsArray.push(mercury);

// Sun Image
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(128, 32, 32),
    new THREE.MeshBasicMaterial({
        // color: 0xFFFFFF
        map: new THREE.TextureLoader().load('./images/planets/sun.jpg')
    })
);
scene.add(sun);
sun.position.z = -20;
sun.position.y = -230;
sun.position.x = -230;
planetsArray.push(sun);

// Mars Image
const mars = new THREE.Mesh(
    new THREE.SphereGeometry(18, 32, 32),
    new THREE.MeshBasicMaterial({
        // color: 0xFFFFFF
        map: new THREE.TextureLoader().load('./images/planets/mars.png')
    })
);
scene.add(mars);
mars.position.z = -20;
mars.position.y = 45;
mars.position.x = 45;
planetsArray.push(mars);

// Jupiter Image
const jupiter = new THREE.Mesh(
    new THREE.SphereGeometry(64, 32, 32),
    new THREE.MeshBasicMaterial({
        // color: 0xFFFFFF
        map: new THREE.TextureLoader().load('./images/planets/jupiter.jpg')
    })
);
scene.add(jupiter);
jupiter.position.z = -20;
jupiter.position.y = 120;
jupiter.position.x = 120;
planetsArray.push(jupiter);

// Saturn Image
const saturn = new THREE.Mesh(
    new THREE.SphereGeometry(48, 32, 32),
    new THREE.MeshBasicMaterial({
        // color: 0xFFFFFF
        map: new THREE.TextureLoader().load('./images/planets/saturn.png')
    })
);
scene.add(saturn);
saturn.position.z = -60;
saturn.position.y = 210;
saturn.position.x = 210;
planetsArray.push(saturn);
// Saturn ring
const saturnRing = new THREE.Mesh(
    new THREE.TorusGeometry(60, 1.2, 30, 200),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./images/planets/saturnRing.jpg')
    })
);
scene.add(saturnRing);
saturnRing.position.z = -60;
saturnRing.position.y = 210;
saturnRing.position.x = 210;
saturnRing.rotation.x = 360;




// Uranus Image
const uranus = new THREE.Mesh(
    new THREE.SphereGeometry(32, 32, 32),
    new THREE.MeshBasicMaterial({
        // color: 0xFFFFFF
        map: new THREE.TextureLoader().load('./images/planets/uranus.jpg')
    })
);
scene.add(uranus);
uranus.position.z = -20;
uranus.position.y = 270;
uranus.position.x = 270;
planetsArray.push(uranus);

// Neptune Image
const neptune = new THREE.Mesh(
    new THREE.SphereGeometry(32, 32, 32),
    new THREE.MeshBasicMaterial({
        // color: 0xFFFFFF
        map: new THREE.TextureLoader().load('./images/planets/neptune.jpg')
    })
);
scene.add(neptune);
neptune.position.z = -20;
neptune.position.y = 300;
neptune.position.x = 300;
planetsArray.push(neptune);


// Creating stars 
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const starColors = [0xFF0000, 0xFFA500, 0xFFFFED, 0xFFFFFF, 0xF4F5FF, 0x0000FF]
    const material = new THREE.MeshBasicMaterial({ color: starColors[Math.floor(Math.random() * starColors.length)] });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));

    star.position.set(x, y, z);
    scene.add(star);
}

Array(400).fill().forEach(addStar);



// Just a random torus after the Solar System
const torus = new THREE.Mesh(new THREE.TorusGeometry(20, 6, 16, 100), new THREE.MeshNormalMaterial());
scene.add(torus);
torus.position.z = 400;
torus.position.x = 200;
torus.rotation.y = 200;


//! --------------------------------------------------------------------------------------------------------------------------------------
//! --------------------------------------------------------------------------------------------------------------------------------------
//! --------------------------------------------------------------------------------------------------------------------------------------
//! --------------------------------------------------------------------------------------------------------------------------------------
//! --------------------------------------------------------------------------------------------------------------------------------------
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    // console.log(`%cScroll Depth: ${t}`, "color:lime;font-size:1.25em"); //* Testing Only

    if (t >= -3500) {
        // moving the camera as the user scrolls 
        camera.position.z = t * + -0.1; //? When there's little content, faster
        // camera.position.z = t * -0.01; //? When there's a lot of content, slower
        camera.position.x = t * + 0.05; //? When there's little content, faster
        // camera.position.x = t * + 0.005; //? When there's a lot of content, slower
        camera.rotation.y = 0;

        // camera.rotation.y = t * -0.0002;

    }
    if (t < -3500) {
        camera.position.z = t * + -0.1;
        camera.position.x = t * + -0.05;
        camera.rotation.y = t * + -0.0002;
    }
}

document.body.onscroll = moveCamera;
moveCamera();


// - 4000

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Playing Astronaut Animation
    let delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );

    TWEEN.update();

    planetsArray.forEach(element => {
        element.rotation.y += 0.005;
    });

    // Rotating the torus
    torus.rotation.y += 0.05;
    torus.rotation.x += 0.01;
    torus.rotation.z += 0.05;


    renderer.render(scene, camera);
}
if (WEBGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    animate();

} else {
    const warning = WEBGL.getWebGLErrorMessage();
    document.getElementById('bg').appendChild(warning);
}