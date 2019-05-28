import UITreeItem, { TreeItemData, CheckStatus, TreeItemStyle } from "./UITreeItem";
import Handler = Laya.Handler;
import Vector2 = Laya.Vector2;

/**
 * 创建简易树
 */
export default class UITree{

    private m_tree:Laya.VBox;

    private m_ItemCodes:Array<string>;
    private m_treeItemsDic:Laya.WeakObject;

    private m_valueChangedItem:Array<UITreeItem>;
    public OnValueChanged:Function;

    constructor(){
        this.m_ItemCodes = new Array<string>();
        this.m_treeItemsDic = new Laya.WeakObject();
        this.m_valueChangedItem = new Array<UITreeItem>();
    }

    InitTree(items:Array<TreeItemData>,style?:TreeItemStyle,treePos?:Laya.Vector2,treeBgColor?:string,uitreeAtlas?:string){
        if(items == null||items.length == 0)return ;

        let defaultPath = "res/atlas/tree.atlas";
        let _uitreeAtlas = uitreeAtlas == null?defaultPath:uitreeAtlas;

        Laya.loader.load(_uitreeAtlas,Handler.create(this,()=>{

            this.ClearTreeItemDic();

            if(this.m_tree ==null){
                //Temp，用VBox制作一个Tree
                this.m_tree = new Laya.VBox();
                this.m_tree.x = treePos==null?0:treePos.x;
                this.m_tree.y = treePos==null?0:treePos.y;
                this.m_tree.bgColor = treeBgColor == null?"#ffffff":treeBgColor;
                Laya.stage.addChild(this.m_tree);
            }

            if(treeBgColor != null){
                if(style == null) 
                    style = new TreeItemStyle();          
                style.ItemColor = treeBgColor;
            }
 
            items.forEach(element => {
                this.AddItem(element,style);
            });

            this.RefreshItemPosition();
        }));
    }


    private AddItem(item:TreeItemData,style?:TreeItemStyle){
        if(item == null) return ;
        let treeItem:UITreeItem = new UITreeItem();
        treeItem.InitTreeItem(item,style);
        treeItem.OnArrowClick =((item,b)=>{this.OnArrowClicked(item,b);});
        treeItem.OnCheckBoxClick =((item,b)=>{this.OnCheckBoxClicked(item,b);});

        this.m_ItemCodes.push(item.code);
        if(!this.m_treeItemsDic.has(item.code)) 
            this.m_treeItemsDic.set(item.code,treeItem);

        this.m_tree.addChild(treeItem.TreeItem);

        if(!item.isLeaf){
            item.children.forEach(element => {
                this.AddItem(element,style);
            });
        }        
    }

    private OnArrowClicked(item:UITreeItem, b:boolean){
        if(item == null) return ;

        this.RefreshArrowStatus(item.ItemData.code,b);
        
        this.RefreshItemPosition();
    }
 

    private OnCheckBoxClicked(item:UITreeItem,b:boolean){
        if(item == null) return ;

        this.m_valueChangedItem.splice(0);

        if(!item.ItemData.isLeaf)
            this.RefreshCheckStatusByParent(item.ItemData,b);
        else
            this.m_valueChangedItem.push(item);

        this.RefreshCheckStatusByChildren(item.ItemData);

        if(this.OnValueChanged) this.OnValueChanged(this.m_valueChangedItem,b);
    }

    private RefreshCheckStatusByParent(data:TreeItemData,b:boolean){
        if(data == null || !this.m_treeItemsDic.has(data.code)) return ;
        
        let treeItem = this.m_treeItemsDic.get(data.code) as UITreeItem;

        if(treeItem.ItemData.children != null){
            treeItem.ItemData.children.forEach(element => {
                if(this.m_treeItemsDic.has(element.code)){

                    let child:UITreeItem = this.m_treeItemsDic.get(element.code);
                   
                    child.SetCheckboxStatus(b?CheckStatus.check:CheckStatus.uncheck);

                    if(child.ItemData.isLeaf)
                        this.m_valueChangedItem.push(child);
                    
                    this.RefreshCheckStatusByParent(child.ItemData,b);
                }  
            });
        }
    }

    private RefreshCheckStatusByChildren(data:TreeItemData){
        if(data.level == 1) return ;

        let check = 0;
        let partly = 0;
        let parent:UITreeItem = this.m_treeItemsDic.has(data.parentCode)?this.m_treeItemsDic.get(data.parentCode):null;
        if(parent){
            parent.ItemData.children.forEach(element => {
               switch(element.status){
                   case CheckStatus.check:check++;break;
                   case CheckStatus.partly:partly++;break;
               }
            });

            if(partly>0){
                parent.SetCheckboxStatus(CheckStatus.partly);
            }else{
                if(check == 0){
                    parent.SetCheckboxStatus(CheckStatus.uncheck);
                    this.RefreshCheckStatusByChildren(parent.ItemData);
                }else if(check == parent.ItemData.children.length){
                    parent.SetCheckboxStatus(CheckStatus.check);
                    this.RefreshCheckStatusByChildren(parent.ItemData);
                }else{
                    parent.SetCheckboxStatus(CheckStatus.partly);

                }
            }
        } 
    }

    private RefreshArrowStatus(code:string,b:boolean){
        if(code == null || !this.m_treeItemsDic.has(code)) return ;
        
        let treeItem = this.m_treeItemsDic.get(code) as UITreeItem;
        treeItem.ItemData.children.forEach(element => {
            if(this.m_treeItemsDic.has(element.code)){
                let child:UITreeItem = this.m_treeItemsDic.get(element.code);
                child.TreeItem.visible = b;

                if(!b && !child.ItemData.isLeaf){
                    this.RefreshArrowStatus(child.ItemData.code,b);
                    child.SetArrowStatus(b);
                }
            }  
        });
    }

    private RefreshItemPosition(){
        let treelist = new Array<UITreeItem>();
        treelist.splice(0);
        this.m_ItemCodes.forEach(element => {
            let item = this.m_treeItemsDic.get(element) as UITreeItem;
            if(item.TreeItem.visible){
                treelist.push(item);
            }
        });

        let treeItemHeight = treelist[0].TreeItem.height;
        for(let i = 0;i<treelist.length;i++){
            treelist[i].TreeItem.y = i * treeItemHeight;
        }            
        this.m_tree.height = treelist.length * treeItemHeight;
    }

    private ClearTreeItemDic(){
        this.m_ItemCodes.forEach(element => {
            if(this.m_treeItemsDic.has(element)){
                let item:UITreeItem = this.m_treeItemsDic.get(element);
                item.TreeItem.destroy();
                this.m_treeItemsDic.del(element);
            } 
        });
        this.m_ItemCodes.splice(0);
    }
}