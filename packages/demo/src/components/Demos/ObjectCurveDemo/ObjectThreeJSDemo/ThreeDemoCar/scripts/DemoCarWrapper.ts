import * as THREE from 'three'
import colorString from 'color-string';
import { Object3D } from 'three';
import { DemoCarSettings } from './DemoCarSettings';

class DemoCarWrapper {
    car: Object3D;

    wheels: Object3D[];
    lights: { front: THREE.Light[], rear: THREE.Light[], interior: THREE.Light };

    materials: THREE.Material[];

    private _settings: DemoCarSettings = {};
    private _carMesh: THREE.Mesh[] = [];
    private _lightIntensity: { front: number, rear: number, interior: number };

    constructor(group: THREE.Group) {
        /* Get references to Object3D Components */
        const nameFilter = (name: string) => (child => child.name === name);

        this.car = group.children.filter(nameFilter('car'))[0];
        this._carMesh = this.car.children
            .filter(child => child instanceof THREE.Mesh)
            .map(child => child as THREE.Mesh);

        this.wheels = this.car.children.filter(nameFilter('wheels'))[0].children;

        const lights = this.car.children.filter(nameFilter('lights'))[0];
        this.lights = {
            front: lights.children.filter(nameFilter('lights_front'))[0].children.map(child => child.children[0] as THREE.Light),
            rear: lights.children.filter(nameFilter('lights_rear'))[0].children.map(child => child.children[0] as THREE.Light),
            interior: lights.children.filter(nameFilter('light_interior'))[0].children[0] as THREE.Light,
        };

        this._lightIntensity = {
            front: this.lights.front[0].intensity,
            rear: this.lights.rear[0].intensity,
            interior: this.lights.interior.intensity,
        }

        /* Correct windows (translucent material) */
        const windowMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x000000,
            roughness: 0.1,
            depthWrite: false,
            // @ts-ignore
            transparency: 0.35,
            refractionRatio: 1.05,
            opacity: 1.0,
            transparent: true,
            side: THREE.DoubleSide,
        });
        windowMaterial.name = 'windows';
        windowMaterial.morphTargets = true;

        const carWindowGeometry = this._carMesh
            .filter(mesh => ([mesh.material]).flat()[0].name === 'mm_windows')[0];
        carWindowGeometry.material = windowMaterial;

        /* Get references to materials for car and wheels */
        function getMaterials(object: Object3D): THREE.Material[] {
            return object.children
                .filter(child => child instanceof THREE.Mesh)
                .map(child => child as THREE.Mesh)
                .map(mesh => mesh.material).flat();
        }

        this.materials = getMaterials(this.car).concat(getMaterials(this.wheels[0]));
    }

    update(deltaTime: number) {
        this.wheels.forEach(wheel => {
            wheel.rotateOnAxis(
                new THREE.Vector3(1, 0, 0),
                ((this._settings.wheelSpeed ?? 1) * Math.PI * 2) * (deltaTime / 1000)
            );
        });
    }

    updateSettings(settings: DemoCarSettings) {
        this._settings = settings;

        // Color
        const color = colorString.get(settings.color ?? 'white');
        const material = (this.materials.filter(m => m.name === 'mm_ext')[0] as THREE.MeshBasicMaterial);
        material.vertexColors = false;
        material.color.setRGB(color.value[0] / 255, color.value[1] / 255, color.value[2] / 255);

        // Lights
        this.lights.front.forEach(light =>
            light.intensity = this._lightIntensity.front * ((settings.lights?.front ?? false) ? 1 : 0)
        );
        this.lights.rear.forEach(light =>
            light.intensity = this._lightIntensity.rear * ((settings.lights?.rear ?? false) ? 1 : 0)
        );
        this.lights.interior.intensity = this._lightIntensity.interior * ((settings.lights?.interior ?? true) ? 1 : 0);

        // Windows
        this._carMesh.forEach(mesh => {
            if (!mesh.morphTargetInfluences || mesh.morphTargetInfluences.length < 2) return;

            let rightIndex = 0;
            let leftIndex = 1;
            if (mesh.morphTargetDictionary) {
                rightIndex = mesh.morphTargetDictionary['window_down_right'] ?? rightIndex;
                leftIndex = mesh.morphTargetDictionary['window_down_left'] ?? leftIndex;
            }

            mesh.morphTargetInfluences[rightIndex] = settings.windowDown?.right ?? 0;
            mesh.morphTargetInfluences[leftIndex] = settings.windowDown?.left ?? 0;
        });

        // Suspension
        const suspensionHeight = -( ( settings.suspension ?? 0 ) / 10 );
        this._carMesh.forEach(mesh => {
            mesh.position.z = suspensionHeight;
        });
        this.car.children.filter(child => child.name === 'lights')[0].position.z = suspensionHeight;

        // Object data
        Object.assign(this.car, settings.objectData ?? {});
    }

}

export default DemoCarWrapper;
