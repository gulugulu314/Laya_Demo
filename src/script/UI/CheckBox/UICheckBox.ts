import UICheckBoxItem, { CheckBoxItemData, CheckBoxItemStyle, CheckBoxStyle } from "./UICheckBoxItem";

export default class UICheckBox{

    public OnValueChanged:Function;
  
    private m_checkBox:Laya.VBox;
    private m_allCheckBoxItem:UICheckBoxItem;

    private m_ItemCodes:Array<string>;
    private m_CheckBoxItemsDic:Laya.WeakObject;
    private m_valueChangedItem:Array<UICheckBoxItem>;

    constructor(){
        this.m_ItemCodes = new Array<string>();
        this.m_CheckBoxItemsDic = new Laya.WeakObject();
        this.m_valueChangedItem = new Array<UICheckBoxItem>();
    }

    InitCheckBox(data:Array<CheckBoxItemData>,pos?:Laya.Vector2,style?:CheckBoxStyle,bgColor?:string,atlasPath?:string){
        if(data == null||data.length == 0) return ;

        let defalutAltasPath = "res/atlas/tree.atlas";
        defalutAltasPath = atlasPath == null?defalutAltasPath:atlasPath;
        Laya.loader.create(defalutAltasPath,Laya.Handler.create(this,()=>{
            this.ClearItems();
            
            if(this.m_checkBox == null){       
                this.CreateCheckBoxVBox(pos,bgColor);

                this.CreateAllCheckItem();
            }           

            data.forEach(element => {
                this.AddItem(element,style);
            });
        }));
    }

    private CreateAllCheckItem(){
        this.m_allCheckBoxItem = new UICheckBoxItem();
        let data = new CheckBoxItemData();
        data.code = "";
        data.name = "全选";
        this.m_allCheckBoxItem.InitCheckBoxItem(data,CheckBoxStyle.Normal);
        this.m_allCheckBoxItem.OnCheckBoxClicked =((item,b)=>{this.OnCheckBoxItemClicked(item,b);});
        this.m_checkBox.addChild(this.m_allCheckBoxItem.CheckBoxItem);
    }

    private CreateCheckBoxVBox(pos?:Laya.Vector2,bgColor?:string){
        this.m_checkBox = new Laya.VBox();
        this.m_checkBox.name = "checkbox";
        this.m_checkBox.x = pos==null?0:pos.x;
        this.m_checkBox.y = pos==null?0:pos.y;
        this.m_checkBox.bgColor = bgColor == null?"#ffffff":bgColor;
        Laya.stage.addChild(this.m_checkBox);
    }

    private AddItem(item:CheckBoxItemData,style?:CheckBoxStyle){
        if(item == null) return ;
        let checkboxItem:UICheckBoxItem = new UICheckBoxItem();
        checkboxItem.InitCheckBoxItem(item,style);
        checkboxItem.OnCheckBoxClicked =((item,b)=>{this.OnCheckBoxItemClicked(item,b);});

        this.m_ItemCodes.push(item.code);
        if(!this.m_CheckBoxItemsDic.has(item.code)) 
            this.m_CheckBoxItemsDic.set(item.code,checkboxItem);

        this.m_checkBox.addChild(checkboxItem.CheckBoxItem);
    }


    private OnCheckBoxItemClicked(item:UICheckBoxItem,b:boolean){
        if(item == null) return ;

        this.m_valueChangedItem.splice(0);
        if(item.CheckBoxData.code == ""){
            this.RefreshStatusByAllCheckBox(b);
        }else{
            this.m_valueChangedItem.push(item);
        }

        this.RefreshAllCheckBoxStatusByChildren();

        if(this.OnValueChanged) this.OnValueChanged(this.m_valueChangedItem,b);
    }

    private ClearItems(){
        this.m_ItemCodes.forEach(element => {
            if(this.m_CheckBoxItemsDic.has(element)){
                let item:UICheckBoxItem = this.m_CheckBoxItemsDic.get(element);
                item.CheckBoxItem.destroy();
                this.m_CheckBoxItemsDic.del(element);
            } 
        });
        this.m_ItemCodes.splice(0);
    }


    private RefreshStatusByAllCheckBox(b:boolean){
        this.m_ItemCodes.forEach(element => {
            let checkbox:UICheckBoxItem = this.m_CheckBoxItemsDic.get(element);
            if(checkbox){
                checkbox.SetStatus(b);
                this.m_valueChangedItem.push(this.m_CheckBoxItemsDic.get(element));
            }           
        });
    }

    private RefreshAllCheckBoxStatusByChildren(){
        let check:number = 0;
        this.m_ItemCodes.forEach(element => {
            let checkbox:UICheckBoxItem = this.m_CheckBoxItemsDic.get(element);
            if(checkbox && checkbox.CheckBoxData.status) check++
        });

        if(check ==0){
            this.m_allCheckBoxItem.SetStatus(false);
        }else if(check == this.m_ItemCodes.length){
            this.m_allCheckBoxItem.SetStatus(true);
        }else{
            this.m_allCheckBoxItem.SetStatus(false,true);
        }
    }
}