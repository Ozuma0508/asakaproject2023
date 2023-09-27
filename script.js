import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

console.log(THREE);
console.log(OrbitControls);

// マップの3Dモデルが置かれているディレクトリのパスとファイル名をまとめた連想配列
const map3DModelPaths = {
	"全体マップ": {
		"dirPath": "data/map3DModel/",
		"fileNames": ["map"]
	},
	"10号館": {
		"dirPath": "data/map3DModel/building10/",
		"fileNames": ["10_1"]
	},
	"9号館": {
		"dirPath": "data/map3DModel/building9/",
		"fileNames": ["9_1"]
	}
};

// アイコンのパスをまとめた連想配列
const mapInfoIconPaths = {
	"男子トイレ": "data/icon/stairsIcon.png",
	"女子トイレ": "data/icon/stairsIcon.png",
	"階段": "data/icon/stairsIcon.png",
	"エスカレーター": "data/icon/stairsIcon.png",
	"エレベーター": "data/icon/stairsIcon.png",
	"プリンター": "data/icon/stairsIcon.png"
};

// レンダラーの作成
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
});
let rendererWidth;
let rendererHeight;

// シーンの作成と設定
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// カメラの作成と設定
let cameraMode = 1;
// cameraModeで透視投影カメラと平行投影カメラを切り替える
// 透視投影カメラ: 0
// 平行投影カメラ: 1
const cameras = [
	new THREE.PerspectiveCamera(),
	new THREE.OrthographicCamera()
];
cameras[0].fov = 40;
cameras[0].near = 0.1;
cameras[0].far = 2000;
cameras[0].position.set(0, 200, -450);

const cameraFrustumSize = 0.005;
// 平行投影カメラの視錐台の大きさを決める倍率
// この値をrendererの大きさにかけて平行投影カメラの視錐台の大きさを決めている
cameras[1].near = 0.1;
cameras[1].far = 2000;
cameras[1].position.set(0, 200, 0);

// レンダラーとカメラのサイズの初期化
resize();

// ライトの作成と設定
const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(0, 1, -1);
// ライトをシーンに追加
scene.add(light);

// レンダーループ
renderer.setAnimationLoop(animation);

// この関数をループさせている
function animation() {
	// OrbitControlsでカメラを滑らかに動かすためのupdate()
	controls.update();
	renderer.render(scene, cameras[cameraMode]);

	// 教室名やアイコンなどをマップのオブジェクトに付ける関数
	setMapInfoPos();
}

// 教室名やアイコンなどをマップのオブジェクトに付ける関数
function setMapInfoPos() {
	for (let mapInfo of document.getElementsByClassName("mapInfo")) {
		// 引数の名前のオブジェクトのcanvas上のx座標とy座標を返す関数
		let [x, y] = getCoord(mapInfo.dataset.name);

		x = x - mapInfo.getBoundingClientRect().width / 2;
		y = y - mapInfo.getBoundingClientRect().height / 2;
		mapInfo.style.left = x + "px";
		mapInfo.style.top = y + "px";
	}
}

// 引数の名前のオブジェクトのcanvas上のx座標とy座標を返す関数
function getCoord(mapObj) {
	let target = scene.getObjectByName(mapObj);
	
	const targetWorldPos = target.getWorldPosition(new THREE.Vector3());
	const targetCanvasPos = targetWorldPos.project(cameras[cameraMode]);
	
	const targetCanvasX = (rendererWidth / 2) * (targetCanvasPos.x + 1);
	const targetCanvasY = (rendererHeight / 2) * -(targetCanvasPos.y - 1);
	
	return [targetCanvasX, targetCanvasY];
}

let mapMode = 2;
// 教室名やアイコンなどを作る関数
function createMapInfo(mapNames) {
	const mapArea = document.getElementById("mapArea");
	switch (mapMode) {
		case 0:
			break;
		case 1:
			break;
		case 2:
			for (let mapObj of scene.getObjectByName(mapNames).children) {
				if (mapObj.name != "object") {
					const mapObjNamefirstWord = mapObj.name.substring(0, mapObj.name.indexOf("_"));
					if (Object.keys(mapInfoIconPaths).includes(mapObjNamefirstWord)) {
						// アイコンを作る
						const mapInfo = document.createElement("div");
						mapInfo.classList.add("mapInfo");
						mapInfo.classList.add("icon");
						mapInfo.dataset.name = mapObj.name;

						const icon = document.createElement("img");
						icon.src = mapInfoIconPaths[mapObjNamefirstWord];
						icon.alt = mapObjNamefirstWord;
						icon.width = 20;
						icon.height = 20;

						mapInfo.appendChild(icon);
						mapArea.appendChild(mapInfo);
					} else {
						// 教室名を作る
						const mapInfo = document.createElement("div");
						mapInfo.classList.add("mapInfo");
						mapInfo.classList.add("roomName");
						mapInfo.dataset.name = mapObj.name;
						mapInfo.textContent = mapObj.name;
						mapArea.appendChild(mapInfo);
					}
				}
			}
			break;
	}
}

// 引数の名前の3Dモデルを読み込む関数
async function loadMap(mapName) {
	let floorNames = [];
	const loader = new GLTFLoader();
	let count = 0;
	for (let fileName of map3DModelPaths[mapName]["fileNames"]) {
		const map3DModelPath = map3DModelPaths[mapName]["dirPath"] + fileName + ".glb";
		const glb = await loader.loadAsync(map3DModelPath);
		const map = glb.scene;

		// 読み込んだ3Dモデルに名前を付ける
		if (fileName.includes("_")) {
			// 各階の3Dモデルの場合は階の名前を付ける
			map.name = fileName.substring(fileName.indexOf("_") + 1);
		} else {
			// それ以外の3Dモデルの場合はファイル名をそのまま付ける
			map.name = fileName;
		}
		floorNames.push(map.name);
		map.position.set(0, count * 1, 0);

		scene.add(map);
		count++;
	}
	return floorNames;
}

// 引数の名前の3Dモデルを読み込む関数
// 3Dモデル読み込み後、教室名やアイコンなどを作る関数を実行
// そのとき読み込んだ3Dモデルの名前を配列mapNamesとして渡す
loadMap("10号館").then(function(mapNames) {
	console.log(mapNames);
	createMapInfo("1");
});

// カメラを操作
const test  = document.getElementById("mapArea");
console.log(renderer.domElement);
const controls = new OrbitControls(cameras[cameraMode], test);
controls.enableDamping = true;

// 3Dモデルのクリックの設定
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// canvasにクリックイベントを追加
canvas.addEventListener("click", function(event) {
	const canvasOffset = canvas.getBoundingClientRect();
	// .setFromCamera()に必要な正規化デバイス座標に変換したマウスカーソルの座標の取得方法
	// ブラウザウィンドウの左上を基準にマウスカーソルの座標を取得して、canvasの座標を引くことで、
	// canvasの左上を基準にしたマウスカーソルの座標を取得する
	// 取得したcanvas上のマウスカーソルのx座標をcanvasの幅で割る
	// これにより、canvasの幅を0から1としたときのマウスカーソルのx座標を得られる
	// これを2倍して1引くことで、-1から1の範囲でマウスカーソルのx座標を得られる
	pointer.x = (event.clientX - canvasOffset.left) / canvasOffset.width * 2 - 1;
	pointer.y = (event.clientY - canvasOffset.top) / canvasOffset.height * -2 + 1;
	raycaster.setFromCamera(pointer, cameras[cameraMode]);
	// console.log(pointer);

	const intersects = raycaster.intersectObjects(scene.children);
	// console.log(scene.children);
	// console.log(intersects);
	if (intersects.length > 0) {
		console.log(intersects[0].object);
	}
});

// 画面のリサイズ
window.addEventListener("resize", resize);

function resize() {
	// レンダラーのサイズの設定
	rendererWidth = window.innerWidth;
  rendererHeight = window.innerHeight;
	renderer.setSize(rendererWidth, rendererHeight);
	// 解像度に合わせて3Dモデルをきれいに表示
	renderer.setPixelRatio(window.devicePixelRatio);

	// カメラのサイズの設定
	if (cameraMode == 0) {
		const aspect = rendererWidth / rendererHeight;
		cameras[cameraMode].aspect = aspect;
	} else {
		cameras[cameraMode].left = -rendererWidth * cameraFrustumSize;
		cameras[cameraMode].right = rendererWidth * cameraFrustumSize;
		cameras[cameraMode].top = rendererHeight * cameraFrustumSize;
		cameras[cameraMode].bottom = -rendererHeight * cameraFrustumSize;
	}
	cameras[cameraMode].updateProjectionMatrix();
}