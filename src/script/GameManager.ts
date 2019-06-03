
import MtHttp from "./Network/MtHttp";
import NameConfig from "./Configure/NameConfig";
import DataManager from "./Data/DataManager";

import GameUI from "./GameUI";

import Handler = Laya.Handler;
import CameraMoveScript from "./Component/CameraMoveScript";
import LabelUpdatPos from "./Component/LabelUpdate";
import MainUI from "./MainUI";
import BIMManager, { LabelType } from "./BIM/BIMManager";
import CameraManager from "./Camera/CameraManager";
import EventManager from "./Events/EventManager";
import { Events } from "./Events/Events";



export default class GameManager{

    private static _instance:GameManager;    

    static Instance():GameManager{
        if(GameManager._instance == null){
            GameManager._instance = new GameManager();
        }
        return GameManager._instance;
    }

    public BIM:BIMManager;
    public Data:DataManager;
    public Camera:CameraManager;
    public Http :MtHttp;

    public MainScene:Laya.Scene3D;
    public MainUI:MainUI;

    private IsInitScene:boolean;

    public LoginLock:Boolean = false;

    constructor(){
        this.Http = new MtHttp(NameConfig.ip,NameConfig.port);

        this.BIM = new BIMManager();
        this.Data = new DataManager();
        this.Camera = new CameraManager();
   
        this.AddEvents();
    }   


    AddEvents(){
        EventManager.Instance().AddEventListener(Events.OnUI_LevelBtn_Clicked.toString(),this,this.OnLevelBtnClicked)
    }


    OnLevelBtnClicked(levelName:string){
        this.BIM.HideOneLevelFloors(this.BIM.CurrenLevel);
        this.BIM.ShowOneLevelFloors(levelName);

        EventManager.Instance().PostEvent(Events.OnLevelChanged.toString(),[this.BIM.CurrenLevel,this.BIM.PreLevel]);

        this.MainUI.CreateTree(this.Data.GetOneLevelOrganizations(this.BIM.CurrenLevel));
    }

    public Login(){   

        if(this.LoginLock) return ;

        var longinUrl =  this.Http.URL.concat("/IVS/login");
        var postBody = JSON.stringify({"name":NameConfig.userName,
                                       "pwd":NameConfig.userPassprot,
                                       "thirdPartyCode":"0"});
        this.Http.post(longinUrl,postBody,this,this.LoginSucceed);
        
        this.LoginLock = true;
    }

    LoginSucceed(e:any){
        if(e.state == "succeed"){
            console.debug("Login succeed!");
            this.LoadData();

            //test
            //this.LoadRes();
        } else{
            alert(e.msg);
        }   
    }

    LoadData(){

        this.Data.Init();
    
    }

    LoadRes(){

        Laya.loader.load("res/JsonFile/res_pumchw.json",Handler.create(this,(data)=>{

            var resUrl:Array<string> = new Array<string>();

            data.url.forEach(element => {
                resUrl.push(this.Http.URL.concat("/Patch/res/",element));
            });

            this.BIM.LoadRes(resUrl,()=>{

                this.InitMainUI();

                this.BIM.ShowOneLevelFloors(this.BIM.CurrenLevel);
            });
        }))
    }
    
    Init3DScene(){

        if(this.IsInitScene) return;

        Laya3D.init(0, 0, true);

        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;

        //Laya.Stat.show();

        this.MainScene = new Laya.Scene3D();
        Laya.stage.addChild(this.MainScene);
       
        this.Camera.InitCamera();

        this.IsInitScene = true;
    }

    InitMainUI(){
        this.MainUI = new MainUI();
        Laya.stage.addChild(this.MainUI);


        //this.MainUI.CreateTree(this.Data.GetOneLevelOrganizations(this.BIM.CurrenLevel));
        this.MainUI.CreateLevels(this.BIM.Levels);
    }

}