export class CheckBoxItemData{
    public code:string;
    public name:string;
    public legendColor:string;
    public iconPath:string;
    public number:string;

    public status:boolean;
}

export class CheckBoxItemStyle{
    public itemWidth:number;
    public itemHeight:number;
    public itemInnerSpace:number;
    public itemColor:string;
    public legendWidth:number;
    public legendHeight:number;
    public labelAlign:string;
    public fontSize:number;
    public labelColor:string;
}

export enum CheckBoxStyle{
    Normal,
    Icon,
    Number
}
     
export default class UICheckBoxItem{

    constructor(){}

    public CheckBoxItem:Laya.HBox;
    public CheckBoxData:CheckBoxItemData;

    public OnCheckBoxClicked:Function;

    private CheckBoxClip:Laya.Clip;
    private Legend:Laya.Box;
    private Label:Laya.Label;
    private Icon:Laya.Clip;
    private Number:Laya.Label;

    private itemHeight = 40;
    private itemWidth = 200;
    private itemInnerSpace = 5;
    private itemBgColor = "#ffffff";

    private legendWidth = 80;
    private legendHeight = 20;

    private labelAlign = "left";
    private fontSize = 16;
    private labelColor = "#000000";

    InitCheckBoxItem(data:CheckBoxItemData,style?:CheckBoxStyle,itemStyle?:CheckBoxItemStyle){
        if(data == null) return ;
        this.CheckBoxData = data;

        this.InitCheckBox(style);
    }

    SetCheckBoxItemStyle(style:CheckBoxItemStyle){
        if(style == null) return;
        this.itemWidth = style.itemWidth == null?this.itemWidth:style.itemWidth;
        this.itemHeight = style.itemHeight == null?this.itemHeight:style.itemHeight;
        this.itemInnerSpace = style.itemInnerSpace == null?this.itemInnerSpace:style.itemInnerSpace;
        this.itemBgColor = style.labelColor == null?this.itemBgColor:style.itemColor;
        this.legendWidth = style.legendWidth == null?this.legendWidth:style.legendWidth;
        this.legendHeight = style.legendHeight == null?this.legendHeight:style.legendHeight;
        this.labelAlign = style.labelAlign == null?this.labelAlign:style.labelAlign;
        this.fontSize = style.fontSize == null?this.fontSize:style.fontSize;
    }

    SetStatus(b:boolean,isPartly?:boolean){
        this.CheckBoxData.status = b;
        if(isPartly!=null){
            if(this.CheckBoxClip) this.CheckBoxClip.index = 1;
        }
        else if(this.CheckBoxClip){
            if(b) this.CheckBoxClip.index = 2;
            else this.CheckBoxClip.index = 0;
        }else if(this.Icon){
            if(b) this.Icon.index = 1;
            else this.Icon.index = 0;
        }
    }

    private InitCheckBox(style?:CheckBoxStyle){
        if(style == null) 
            style = CheckBoxStyle.Normal;
        switch(style){
            case CheckBoxStyle.Normal:
                this.CreateCheckBoxClip();
                this.CreateLegendSpirte();
                this.CreateLabel();
                this.CreateCheckBoxHBox(style);
            break;
            case CheckBoxStyle.Icon:
                this.CreateIconClip();
                this.CreateLabel();
                this.CreateCheckBoxHBox(style);
            break;
            case CheckBoxStyle.Number:

            break;
        }
    }

    private CreateCheckBoxHBox(style?:CheckBoxStyle){
        this.CheckBoxItem = new Laya.HBox();
        this.CheckBoxItem.name = "checkbox";
        this.CheckBoxItem.x = 5;
        this.CheckBoxItem.width = this.itemWidth;
        this.CheckBoxItem.height = this.itemHeight;
        this.CheckBoxItem.bgColor = this.itemBgColor;
        this.CheckBoxItem.space = this.itemInnerSpace;

        this.AddChilds(style);

        Laya.stage.addChild(this.CheckBoxItem);
    }

    private AddChilds(style:CheckBoxStyle){
        if(style == null) 
            style = CheckBoxStyle.Normal;
        switch(style){
            case CheckBoxStyle.Normal:
               if(this.CheckBoxClip) this.CheckBoxItem.addChild(this.CheckBoxClip);
               if(this.Legend) this.CheckBoxItem.addChild(this.Legend);
               if(this.Label) this.CheckBoxItem.addChild(this.Label);
            break;
            case CheckBoxStyle.Icon:
                if(this.Icon) this.CheckBoxItem.addChild(this.Icon);
                if(this.Label) this.CheckBoxItem.addChild(this.Label);
            break;
            case CheckBoxStyle.Number:

            break;
        }
    }

    private CreateCheckBoxClip(){
        this.CheckBoxClip = new Laya.Clip("tree/checkbox.png",1,2);

        this.CheckBoxClip.width = this.itemHeight > 20 ? this.itemHeight - 20 : this.itemHeight;
        this.CheckBoxClip.height = this.itemHeight > 20 ? this.itemHeight - 20 : this.itemHeight;
        this.CheckBoxClip.y = this.itemHeight > 20? 10 : 0;
        this.CheckBoxClip.clipY = 3;
        this.CheckBoxClip.name = "checkbox";

        this.SetStatus(true);

        this.CheckBoxClip.on(Laya.Event.CLICK,this,(e)=>{
            e.stopPropagation(); 
            this.SetStatus(!this.CheckBoxData.status);
            if(this.OnCheckBoxClicked)
                this.OnCheckBoxClicked(this, this.CheckBoxData.status);
        });

        Laya.stage.addChild(this.CheckBoxClip);
    }

    private CreateLegendSpirte(){
        if(this.CheckBoxData.legendColor == null)return ;

        let legendImage = new Laya.Image(null);
        legendImage.width = this.legendWidth;
        legendImage.height = this.legendHeight;
        legendImage.y = (this.itemHeight - this.legendHeight) / 2;

        this.Legend = new Laya.Box();
        this.Legend.width = this.legendWidth;
        this.Legend.height = this.legendHeight;
        this.Legend.y = (this.itemHeight - this.legendHeight) / 2;
        if(this.CheckBoxData) this.Legend.bgColor = this.CheckBoxData.legendColor;   
        this.Legend.addChild(legendImage);

        Laya.stage.addChild(this.Legend);
    }

    private CreateLabel(){
        this.Label = new Laya.Label();
        this.Label.name = "label"
        this.Label.height = this.itemHeight;
        this.Label.align = this.labelAlign;
        this.Label.valign = "middle";
        this.Label.fontSize = this.fontSize;
        this.Label.color = this.labelColor;
        this.Label.text = this.CheckBoxData == null?"":this.CheckBoxData.name;
        Laya.stage.addChild(this.Label);
    }

    private CreateIconClip(){
        let defaultIconName = "tree/arrow.png";
        let iconName = this.CheckBoxData.iconPath == null?defaultIconName:this.CheckBoxData.iconPath;
        this.Icon = new Laya.Clip(iconName,1,2);

        this.Icon.width = this.itemHeight > 20 ? this.itemHeight - 20 : this.itemHeight;
        this.Icon.height = this.itemHeight > 20 ? this.itemHeight - 20 : this.itemHeight;
        this.Icon.y = this.itemHeight > 20? 10 : 0;
        this.Icon.clipY = 2;
        this.Icon.name = "Icon";

        this.SetStatus(true);

        this.Icon.on(Laya.Event.CLICK,this,(e)=>{
            e.stopPropagation(); 
            this.SetStatus(!this.CheckBoxData.status);
            if(this.OnCheckBoxClicked)
                this.OnCheckBoxClicked(this, this.CheckBoxData.status);
        });

        Laya.stage.addChild(this.Icon);
    }

    private CreateNumberLable(){

    }
}