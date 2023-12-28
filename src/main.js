import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

// Renderer
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 50;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 1);
directionalLight.position.x = 10;
directionalLight.position.z = 10;
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// axis
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Mesh
const crown_loader = new OBJLoader();
const jaw_loader = new OBJLoader();
let crownObject, jawObject;

crown_loader.load(
  'models/crown.obj',
    function (obj) {
      obj.traverse(function (child) {
        if (child.isMesh) child.material = material;
      });
  
      //로드된 오브젝트 scene에 추가
      crownObject = obj;
      scene.add(crownObject);

      //Align “crown mesh” to the origin (0,0,0)
      resetCenter(crownObject, controls);
    },
);

jaw_loader.load(
  'models/lower_jaw.obj',
    function (obj) {
      obj.traverse(function (child) {
        if (child.isMesh) child.material = material;
      });
  
      //로드된 오브젝트 scene에 추가
      jawObject = obj;
      scene.add(jawObject);

      //Align “lower jaw mesh” to the origin (0,0,0)
      resetCenter(jawObject, controls);

      //Crown mesh and lower jaw mesh should be aligned together.
      jawObject.position.copy(crownObject.position);

      //object 위치 변경을 control에도 반영
      controls.reset();
    },
);

const resetCenter = (object, controls) => {
  //Object를 감싸는 Box 생성
  const box = new THREE.Box3().setFromObject(object);
  //생성된 Box 속성을 통해 Object Size 구하기
  const size = {x: box.max.x - box.min.x, y: box.max.y - box.min.y, z: box.max.z - box.min.z};
  
  //Repositioning
  object.position.x = -box.min.x - size.x / 2;
  object.position.y = -box.min.y - size.y / 2;
  object.position.z = -box.min.z - size.z / 2;
  
  //object 위치 변경을 control에도 반영
  controls.reset();
}

// Recommend to use this material for crown and jaw mesh.
const material = new THREE.MeshLambertMaterial({
    color: new THREE.Color(0xffffff),
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();