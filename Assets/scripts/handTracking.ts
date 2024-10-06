import { PinchButton } from "SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton";
import { ToggleButton } from "SpectaclesInteractionKit/Components/UI/ToggleButton/ToggleButton";
import { HandInputData } from "SpectaclesInteractionKit/Providers/HandInputData/HandInputData";
import { Keypoint } from "SpectaclesInteractionKit/Providers/HandInputData/Keypoint";
import TrackedHand from "SpectaclesInteractionKit/Providers/HandInputData/TrackedHand";
import { SIK } from "SpectaclesInteractionKit/SIK";



@component
export class NewScript extends BaseScriptComponent {
    
    @input
    modelPrefab: ObjectPrefab;
    @input
    button: ToggleButton;
    points = [];
    spawns = [];

    onAwake() {
        // Retrieve HandInputData from SIK's definitions.
        let handInputData = SIK.HandInputData;

        this.createEvent('OnStartEvent').bind(() => {
            this.onStart(handInputData);
        });

    }    

    onStart( handInputData: HandInputData) {

        let hand = handInputData.getHand("right");

        this.createEvent('UpdateEvent').bind(()=>{
            this.onUpdate(hand);
        });
    }

    onUpdate(hand : TrackedHand) {
        let isDrawing = this.button.isToggledOn;
        if (isDrawing &&  hand.isPinching) {
            this.points.push(hand.indexTip);
            this.spawn3DObject(hand.indexTip);
        } 
        else {
            this.spawns.forEach((object) => {
                    object.destroy();
            })
            this.spawns = []
        }
        
    }

    spawn3DObject(keypoint : Keypoint) {
        if (!this.modelPrefab || !this.button) {
            print("some components are missing  is not available");
            return;
        }

        // Create a new instance of the 3D model
        let newObject = this.modelPrefab.instantiate(this.sceneObject);

        // Optionally, set the position, scale, and rotation of the new object
        newObject.getTransform().setLocalPosition(new vec3(keypoint.position.x,  keypoint.position.y, 
            this.sceneObject.getTransform().getLocalPosition().z)); // Adjust as needed

        let medianObject = this.modelPrefab.instantiate(this.sceneObject);
        let prevKeyPoint = this.points.pop();

        medianObject.getTransform().setLocalPosition(new vec3(
            (prevKeyPoint.position.x + keypoint.position.x)/2,
            (prevKeyPoint.position.y + keypoint.position.y)/2, 
            this.sceneObject.getTransform().getLocalPosition().z)); // Adjust as needed

        this.spawns.push(newObject, medianObject);
    }
    
}