const container = document.querySelector("main");
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0)


const gizmo = (() => {
    const gizmo = new THREE.Group();

    const axes = new THREE.AxesHelper(5)
    gizmo.add(axes)

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 2, 1, 1),
        new THREE.MeshBasicMaterial({color: 0x00ff00})
    )
    gizmo.add(plane)

    const backPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 2, 1, 1),
        new THREE.MeshBasicMaterial({color: 0xff0000})
    )
    backPlane.rotateX(Math.PI)
    gizmo.add(backPlane)

    return gizmo;
})();
scene.add(gizmo)


window.onresize = window.ondeviceorientation = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};


const requestPermission = async () => {
    if (!window.DeviceOrientationEvent?.requestPermission) {
        alert("No device motion event")
        throw new Error("No event")
    }
    return window.DeviceOrientationEvent.requestPermission().then((response) => {
        if (response !== 'granted') {
            alert("No device motion permission")
            throw new Error("No permission")
        }
    })
};

const subscribe = () => window.addEventListener("deviceorientation", event => {
    const D2R = Math.PI / 180;
    const {alpha, beta, gamma} = event; // yxz
    const euler = new THREE.Euler(beta * D2R, gamma * D2R, alpha * D2R, "YXZ")
    gizmo.setRotationFromEuler(euler)

    scene.rotation.set(0, 0, 0)
    scene.rotateX(-Math.PI / 2)

    document.querySelector("#info").innerHTML = [alpha, beta, gamma].map(Math.round).join("  ")
});

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};


window.onclick = async function () {
    window.onclick = undefined;
    await requestPermission();
    subscribe();
    animate();
};
