import {ui} from "./../ui/layaMaxUI";
import NameConfig from "./Configure/NameConfig";
import GameManager from "./GameManager";
import BIMManager, { LabelType } from "./BIM/BIMManager";

import Button = Laya.Button;
import Common from "./Common/Common";
import EventManager from "./Events/EventManager";
import { Events } from "./Events/Events";

import UITree from "./UI/Tree/UITree";
import { TreeItemData } from "./UI/Tree/UITreeItem";

export default class MainUI extends ui.MainScene.MainSceneUI{

    static _instance = null;

    private m_is2D:Boolean;
    private m_levelBtns:Array<Button>;
    private m_levelPos:Laya.WeakObject;

    private m_levelBtnOriPos:Laya.Vector2;

    private m_isShowMultiBtns:boolean = true;
    private m_isShowAllLevels:boolean = false;

    public CurrentLabelType:LabelType = LabelType.Usage;

    constructor(){
        super();
    }

    onEnable(){
        MainUI._instance = this;
        this.UIAdapter();   
        this.AddEvent(); 
        this.m_is2D = false;

        this.m_levelBtns = new Array<Button>();
        this.m_levelPos = new Laya.WeakObject();

        Laya.stage.on(Laya.Event.RESIZE,Laya.stage,()=>{
            this.UIAdapter();
        });
    }


    private UIAdapter(){
        let width = Laya.stage.width;
        let height = Laya.stage.height;

        this.width = width;
        this.height = height;

        this._2D3DBtn.pos(100,height-100)

        this.DepBtn.pos(100,height/3);
        this.UsageBtn.pos(100,height/3+150);
        this.AreaBtn.pos(100,height/3+300);

        this.MultiBtn.pos(width-150,height-180);    
        this.AllBtn.pos(width-150,height-100)

        //重新刷新levelbtn
        if(this.m_levelBtns&&this.m_levelBtns.length!=0){
            let index = 0
            this.m_levelBtns.forEach(element => {
                this.m_levelBtnOriPos = new Laya.Vector2(this.MultiBtn.x,this.MultiBtn.y);
                element.pos(this.MultiBtn.x,this.MultiBtn.y - ++index * 80)
                if(this.m_levelPos.has(element)){
                    this.m_levelPos.del(element); 
                    this.m_levelPos.set(element,new Laya.Vector2(element.x,element.y));
                }   
            });
        }
    }

    //应该有RemoveEvenet
    AddEvent(){
        this._2D3DBtn.on(Laya.Event.CLICK,null,(e)=>{
            this._2D3DBtnClicked();
            e.stopPropagation();
        });

        this.DepBtn.on(Laya.Event.CLICK,null,(e)=>{
             GameManager.Instance().BIM.RefreshLabelContent(LabelType.Depart);
             this.CurrentLabelType = LabelType.Depart;
             e.stopPropagation();
        });

        this.UsageBtn.on(Laya.Event.CLICK,null,(e)=>{
            GameManager.Instance().BIM.RefreshLabelContent(LabelType.Usage);
            this.CurrentLabelType = LabelType.Usage;
            e.stopPropagation();
        });

        this.AreaBtn.on(Laya.Event.CLICK,null,(e)=>{
             GameManager.Instance().BIM.RefreshLabelContent(LabelType.Area);
             e.stopPropagation();
        });

        this.MultiBtn.on(Laya.Event.CLICK,null,(e)=>{
            this.ShowLevels(this.m_isShowMultiBtns);
            e.stopPropagation();   
        });  

        this.AllBtn.on(Laya.Event.CLICK,null,(e)=>{

            this.m_isShowAllLevels = !this.m_isShowAllLevels

            GameManager.Instance().BIM.ShowAllLevels(this.m_isShowAllLevels);
            
            e.stopPropagation();   
        });  
    }

    CreateLevels(levels:Array<string>){
        if(levels==null||levels.length == 0)
            return;

        this.m_levelBtns.splice(0);
        
        var underGroundLevel = new Array<string>();
        var upGroundLevel = new Array<string>();

        levels.forEach(element => {

            if(element.length!=15){
                console.debug("level name is not legal!");
                return;
            }

            if(Common.GetPurLevel(element).match("B")!=null){
                underGroundLevel.push(element);
            }else{
                upGroundLevel.push(element);
            }
        });

        underGroundLevel.sort((a,b):number=>{
            return a.charAt(14)>b.charAt(14)?-1:1;
        });

        upGroundLevel.sort((a,b):number=>{
            return a.charAt(14)>b.charAt(14)?1:-1;
        });

        var realLevels:Array<string> = underGroundLevel.concat(upGroundLevel);

        //temp
        let index = 0;
        this.m_levelBtnOriPos = new Laya.Vector2(this.MultiBtn.x,this.MultiBtn.y);

        realLevels.forEach(element => {
            this.CreateOneButton(element,new Laya.Vector2(this.m_levelBtnOriPos.x,this.m_levelBtnOriPos.y - ++index*80))
        });
    }

    CreateOneButton(levelCode:string,pos:Laya.Vector2){
        if(levelCode == null) return ;

        var purLevel = Common.GetPurLevel(levelCode);

        var lvlBtn:Button = new Button("comp/button.png");
        
        lvlBtn.name = levelCode;
        lvlBtn.width = 80;
        lvlBtn.height = 60;
        lvlBtn.pos(pos.x,pos.y);
        lvlBtn.labelSize = 30;
        lvlBtn.label = purLevel.charAt(0)+purLevel.charAt(3);
        lvlBtn.on(Laya.Event.CLICK,null,(e,lvlName)=>{
            e.stopPropagation();
            EventManager.Instance().PostEvent(Events.OnUI_LevelBtn_Clicked.toString(),lvlBtn.name)
        })

        Laya.stage.addChild(lvlBtn);

        this.m_levelBtns.push(lvlBtn);

        this.m_levelPos.set(lvlBtn,new Laya.Vector2(lvlBtn.x,lvlBtn.y));
    }

    ShowLevels(b:boolean){
        this.m_isShowMultiBtns = !b;

        if(!this.m_isShowMultiBtns){
            this.MultiBtn.label = "展开";
            this.m_levelBtns.forEach(element => {
                Laya.Tween.to(element,{x:this.m_levelBtnOriPos.x,y:this.m_levelBtnOriPos.y},50,Laya.Ease.linearIn,Laya.Handler.create(this,()=>{
                    element.visible = this.m_isShowMultiBtns;
                }));
            });
        }else{
            this.MultiBtn.label = "折叠";
            this.m_levelBtns.forEach(element => {
                element.visible = this.m_isShowMultiBtns;
                var pos = this.m_levelPos.get(element) as Laya.Vector2;
                Laya.Tween.to(element,{x:pos.x,y:pos.y},50);
            });
        }
    }

    _2D3DBtnClicked(){
        this.m_is2D = !this.m_is2D;
        GameManager.Instance().Camera.ResetCamera(this.m_is2D);
        if(this.m_is2D){
            this._2D3DBtn.label = "3D";
        }else{
            this._2D3DBtn.label = "2D";
        }
    }


    m_orgLevel1:Laya.WeakObject = new Laya.WeakObject();
    m_orgLevel2:Laya.WeakObject = new Laya.WeakObject();
    m_level1arrs:Array<string> = new Array<string>();
    CreateTree(orgs:Array<string>){
        //TEMP:默认为3级

        let level1:string;
        let level2:string;
        let level3:string;
        orgs.forEach(element => {
            switch(element.length){
                case 2:
                    if(!this.m_orgLevel1.has(element)) {
                        this.m_orgLevel1.set(element,new Array<string>());
                        this.m_level1arrs.push(element);
                    }
                break;
                case 4:
                    level1 = element.substr(0,2);
                    level2 = element.substr(0,4);

                    if(!this.m_orgLevel1.has(level1)) {
                        this.m_orgLevel1.set(level1,new Array<string>());
                        this.m_level1arrs.push(level1);
                    }
                    let b = this.m_orgLevel1.get(level1).some((code):boolean =>{return code == level2});
                    if(!b) this.m_orgLevel1.get(level1).push(level2);
                break;
                case 6:
                    level1 = element.substr(0,2);
                    level2 = element.substr(0,4);
                    level3 = element.substr(0,6);

                    if(!this.m_orgLevel1.has(level1)) {
                        this.m_orgLevel1.set(level1,new Array<string>());
                        this.m_level1arrs.push(level1);
                    }
                    let b2 = this.m_orgLevel1.get(level1).some((code):boolean =>{return code == level2});
                    if(!b2) this.m_orgLevel1.get(level1).push(level2);
    
                    if(!this.m_orgLevel2.has(level2)) {
                        this.m_orgLevel2.set(level2,new Array<string>());
                    }
                    let b3 = this.m_orgLevel2.get(level2).some((code):boolean =>{return code == level3});
                    if(!b3) this.m_orgLevel2.get(level2).push(level3);          
                break;
            }
        });
        
        
        let uitree = new UITree();
        let treedata:Array<TreeItemData> = new Array<TreeItemData>();

        this.m_level1arrs.forEach(lvl1 => {
            let root:TreeItemData = this.createTreeItem(lvl1,GameManager.Instance().Data.GetOneOrganizationName(lvl1),1,false,null);
            treedata.push(root);

            this.m_orgLevel1.get(lvl1).forEach(lvl2 => {
                let isleaf = (!this.m_orgLevel2.has(lvl2) || this.m_orgLevel2.get(lvl2).length == 0)?true:false;
                let level2:TreeItemData = this.createTreeItem(lvl2,GameManager.Instance().Data.GetOneOrganizationName(lvl2),2,isleaf,lvl1);
                root.children.push(level2);

                if(this.m_orgLevel2.has(lvl2)){
                    this.m_orgLevel2.get(lvl2).forEach(lvl3=>{
                        let level3:TreeItemData = this.createTreeItem(lvl3,GameManager.Instance().Data.GetOneOrganizationName(lvl3),3,true,lvl2);
                        level2.children.push(level3);
                    });
                } 
            });           
        });

        uitree.InitTree(treedata,null,new Laya.Vector2(Laya.Browser.width - 500,10),"#FFD700");
        uitree.OnValueChanged =(data,b)=>{
            this.OnValueChanged(data,b);
        } 
    }

    createTreeItem(code:string,name:string,level:number,isLeaf:boolean,parentCode:string):TreeItemData{
        let item:TreeItemData = new TreeItemData();
        item.code = code;
        item.name = name;
        item.level = level;
        item.isLeaf = isLeaf;
        item.parentCode = parentCode;
        item.children = new Array<TreeItemData>();
        return item;
    }

    OnValueChanged(arr:Array<any>,b:boolean){

        let str = new Array<string>();
        arr.forEach(element => {
            str.push(element.ItemData.code);
        });

        EventManager.Instance().PostEvent(Events.OnDepTreeItemClicked.toString(),[str,b]);
    }
}