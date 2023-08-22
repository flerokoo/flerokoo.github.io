
const container = document.querySelector("main");
const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false} );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );

const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
camera.position.set( 10, 10, 10 );
camera.lookAt(0, 0, 0)

const gizmo = new THREE.AxesHelper(5)
scene.add(gizmo)

window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
};


async function startup() {
    window.onclick = undefined;
    await requestPermission();
    setupVis();
    animate();
}

async function requestPermission() {
    if (!window.DeviceOrientationEvent?.requestPermission) {
        return Promise.resolve();
    }
    return window.DeviceOrientationEvent.requestPermission().then((response) => {
        if (response !== 'granted') {
            alert("No device motion event")
            throw new Error("No permission")
        }
    })
}

function setupVis() {

}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

window.onclick = startup;
