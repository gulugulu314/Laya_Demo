import Vector3 = Laya.Vector3;
import Handler = Laya.Handler;

import GameManager from "../GameManager";
import EventManager from "../Events/EventManager";
import { Events } from "../Events/Events";
import CameraMoveScript from "../Component/CameraMoveScript";
import RaySelector from "../Component/RaySelector";
import LightControl from "../Component/LightControl";
import MtTween from "../Common/MtTween";


export default class CameraManager{

    Camera:Laya.Camera;

    public Is2D:Boolean;

    private _3dPos:Vector3;
    private _3dRot:Vector3;
    private _2dPos:Vector3;
    private _2dRot:Vector3;
    private _oriOrthSize;

    //temp
    private _levelDistance = 3;

    constructor(){
        this._3dPos = new Vector3(-6,45,17);
        this._3dRot = new Vector3(-78,0,0);
        this._2dPos = new Vector3(-5,50,17);
        this._2dRot = new Vector3(-90,0,0);
        this._oriOrthSize = 70;

        this.AddEvents();
    }

    AddEvents(){
        EventManager.Instance().AddEventListener(Events.OnLevelChanged.toString(),this,this.OnLevelBtnClicked);

    }

    InitCamera(){
        var camera:Laya.Camera = new Laya.Camera(); 
        camera.transform.position = this._3dPos;
        camera.transform.localRotationEuler = this._3dRot;
        camera.clearColor = new Laya.Vector4(0,0,0,0);
        this.Camera = camera;

        //摄像机控制
        camera.addComponent(CameraMoveScript);
        let camctrl = camera.getComponent(CameraMoveScript) as CameraMoveScript;
        camctrl.m_scene3d = GameManager.Instance().MainScene;

        //射线检测
        camera.addComponent(RaySelector);
        var rayselector = camera.getComponent(RaySelector) as RaySelector;
        rayselector.Scene3D = GameManager.Instance().MainScene;

        GameManager.Instance().MainScene.addChild(camera);

        this.InitLight();
    }

    InitLight(){
        var directionLight: Laya.DirectionLight = new Laya.DirectionLight();
        GameManager.Instance().MainScene.addChild(directionLight);
        directionLight.color = new Laya.Vector3(0.2, 0.2, 0.2);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
        directionLight.transform.position = this.Camera.transform.position;
        directionLight.transform.rotation = this.Camera.transform.rotation;

        directionLight.addComponent(LightControl);
        var lightcontrl = directionLight.getComponent(LightControl) as LightControl;
        lightcontrl.Camera = this.Camera;
    }

    ResetCamera(is2D:Boolean){
        this.Is2D = is2D;
        var component = this.Camera.getComponent(CameraMoveScript) as CameraMoveScript;
        if(is2D){
            MtTween.Rotate(this.Camera,this._2dRot,100);
            MtTween.Move(this.Camera,this._2dPos,500,null,Laya.Handler.create(this,()=>{
                this.Camera.orthographic = true;
                this.Camera.orthographicVerticalSize = 60;
                component.Is2D = true;
            }));
        }else{
            MtTween.Rotate(this.Camera,this._3dRot,100);
            MtTween.Move(this.Camera,this._3dPos,500,null,Laya.Handler.create(this,()=>{
                this.Camera.orthographic = false;
                component.Is2D = false;
            }));            
        }
    }


    OnLevelBtnClicked(curLevel:string,preLevel:string){
        let distance = 0;
        let toPos = this.Camera.transform.position;
        if(curLevel == preLevel) distance = 0;
        let levels = GameManager.Instance().MainUI.LevelNames;
        distance = (levels.indexOf(curLevel) - levels.indexOf(preLevel)) * this._levelDistance;
        toPos = new Laya.Vector3(toPos.x,toPos.y + distance,toPos.z);
        MtTween.Move(this.Camera,toPos,500,null,Laya.Handler.create(this,()=>{

        }))
    }
}