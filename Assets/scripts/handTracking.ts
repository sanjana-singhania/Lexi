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

    onAwake() {
        // Retrieve HandInputData from SIK's definitions.
        let handInputData = SIK.HandInputData;

        this.createEvent('OnStartEvent').bind(() => {
            this.onStart(handInputData);
        });

    }    

    onStart( handInputData: HandInputData) {
        // let toggleButton = this.sceneObject.getComponent(
        //     ToggleButton.getTypeName()
        // );

        // if (this.button.onStateChanged) {
        //     this.isDrawing = !this.isDrawing;
        // }

        let hand = handInputData.getHand("right");

        this.createEvent('UpdateEvent').bind(()=>{
            this.onUpdate(hand);
        });
        
    }

    onUpdate(hand : TrackedHand) {

        let isDrawing = this.button.isToggledOn;
        if (isDrawing &&  hand.isPinching) {
            print("here")
            this.spawn3DObject(hand.indexUpperJoint);
        }
        

    }

    spawn3DObject( keypoint : Keypoint) {
        if (!this.modelPrefab) {
            print("Model prefab is not available");
            return;
        }

        // Create a new instance of the 3D model
        let newObject = this.modelPrefab.instantiate(this.sceneObject);

        // Optionally, set the position, scale, and rotation of the new object
        newObject.getTransform().setLocalPosition(new vec3(keypoint.position.x,  keypoint.position.y, keypoint.position.z - 20.0 )); // Adjust as needed
    }
    
}