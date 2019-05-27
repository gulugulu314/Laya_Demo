export class TreeItemData{
    public code:string;
    public name:string;
    public level:number;
    public isLeaf:boolean;
    public parentCode:string;
    public children:Array<TreeItemData>;

    public arrowStatus:boolean;
    public status:CheckStatus;
}
export class TreeItemStyle{
    public ItemWidth:number;
    public ItemHeigth:number;
    public ItemIntentLevel:number;
    public ItemInnerSpace:number;
    public ItemColor:string;
    public LabelColor:string;
    public LabelFontsize:number;
    public LabelAlign:string;
}

export enum TreeStyle{
    Normal,
    Legend
}

export enum CheckStatus{
    check,
    partly,
    uncheck,
}

export default class UITreeItem{

    public TreeItem:Laya.HBox;
    public ItemData:TreeItemData;    

    public OnArrowClick:Function;
    public OnCheckBoxClick:Function;
    public OnTreeItemClick:Function;

    private Arrow:Laya.Clip;
    private CheckBox:Laya.Clip;
    private Label:Laya.Label;

    private m_treeItemWidth = 300;
    private m_treeItemHeight = 50;
    private m_treeItemIntentLevel = 30;
    private m_treeItemInnerSpace = 10;
    private m_treeItemBgColor = "#ffffff";

    private m_labelColor = "#000000";
    private m_fontsize = 30;
    private m_align = "left";
   
    /** *******************Public Methods*************************************************/
    public InitTreeItem(data:TreeItemData,itemStyle?:TreeItemStyle){
        if(data == null) return;

        this.ItemData = data as TreeItemData;

        this.SetTreeItemStyle(itemStyle);

        this.CreateArrow();
        this.CreateCheckBox();
        this.CreateLabel();
        this.CreateHBox();
    }

    public SetTreeItemStyle(style?:TreeItemStyle){
        if(style == null) return;
        this.m_treeItemWidth = style.ItemWidth == null?this.m_treeItemWidth:style.ItemWidth;
        this.m_treeItemHeight = style.ItemHeigth == null?this.m_treeItemHeight:style.ItemHeigth;
        this.m_treeItemIntentLevel = style.ItemIntentLevel == null?this.m_treeItemIntentLevel:style.ItemIntentLevel;
        this.m_treeItemInnerSpace = style.ItemInnerSpace == null?this.m_treeItemInnerSpace:style.ItemInnerSpace;
        this.m_treeItemBgColor = style.ItemColor == null?this.m_treeItemBgColor:style.ItemColor; 
        this.m_labelColor = style.LabelColor == null?this.m_labelColor:style.LabelColor;
        this.m_fontsize = style.LabelFontsize == null?this.m_fontsize: style.LabelFontsize;
        this.m_align = style.LabelAlign == null?this.m_align:style.LabelAlign;
    }

    public SetArrowStatus(b:boolean){
        this.ItemData.arrowStatus = b;
        if(this.ItemData.arrowStatus) {
            this.Arrow.index = 1;
        } else {
            this.Arrow.index = 0;
        }
    }

    public SetCheckboxStatus(status:CheckStatus){
        switch(status){
            case CheckStatus.check : 
                this.CheckBox.index = 2;
                this.ItemData.status = CheckStatus.check;
                break;
            case CheckStatus.partly : 
                this.CheckBox.index = 1;
                this.ItemData.status = CheckStatus.partly;
                break;
            case CheckStatus.uncheck : 
                this.CheckBox.index = 0;
                this.ItemData.status = CheckStatus.uncheck;
                break;
        }
    }
    
    public SetContent(content:string){
        this.Label.text = content;
    }

    /****************************TreeItem**************************************************/
    private CreateHBox(intentLevel?:number){
        this.TreeItem = new Laya.HBox();
        this.TreeItem.name = "treeItem";
        this.TreeItem.space = this.m_treeItemInnerSpace;
        this.TreeItem.width = this.m_treeItemWidth
        this.TreeItem.height =  this.m_treeItemHeight
        if(this.m_treeItemBgColor.length>7){
            this.m_treeItemBgColor = this.m_treeItemBgColor.substr(0,7) + "00";
        }
        this.TreeItem.bgColor = this.m_treeItemBgColor;
        this.TreeItem.x = this.m_treeItemIntentLevel * (this.ItemData.level - 1);

        this.TreeItem.addChild(this.Arrow);
        this.TreeItem.addChild(this.CheckBox);
        this.TreeItem.addChild(this.Label);

        Laya.stage.addChild(this.TreeItem);
    }
    
    /** ***********************arrow*******************************************************/
    private CreateArrow(){
        let arrowRes = "tree/arrow.png";
        this.Arrow = new Laya.Clip(arrowRes,1,2);
        this.Arrow.width = this.m_treeItemHeight - 20;
        this.Arrow.height = this.m_treeItemHeight - 20;
        this.Arrow.y = 10;
        this.Arrow.clipY = 2;
        this.Arrow.name = "arrow";

        if(this.ItemData.isLeaf) this.Arrow.visible = false; 
        
        this.SetArrowStatus(true);

        this.Arrow.on(Laya.Event.CLICK,this,(e)=>{
            e.stopPropagation();
            this.ItemData.arrowStatus = !this.ItemData.arrowStatus;
            this.SetArrowStatus(this.ItemData.arrowStatus);
            if(this.OnArrowClick)
                this.OnArrowClick(this,this.ItemData.arrowStatus);
        });
        Laya.stage.addChild(this.Arrow);      
    }

    /******************CheckBox************************************************************/
    private CreateCheckBox(){
        this.CheckBox = new Laya.Clip("tree/checkbox.png",1,2);
        this.CheckBox.width = this.m_treeItemHeight - 20;
        this.CheckBox.height = this.m_treeItemHeight - 20;
        this.CheckBox.y = 10
        this.CheckBox.clipY = 3;
        this.CheckBox.name = "checkbox";

        this.SetCheckboxStatus(CheckStatus.check); //默认全选

        this.CheckBox.on(Laya.Event.CLICK,this,(e)=>{
            e.stopPropagation(); 

            let b:boolean = this.ItemData.status == CheckStatus.uncheck ? false:true;
            this.SetCheckboxStatus(!b?CheckStatus.check:CheckStatus.uncheck)

            if(this.OnCheckBoxClick)
                this.OnCheckBoxClick(this,!b);
        });
        Laya.stage.addChild(this.CheckBox);
    }

    /****************Label*****************************************************************/
    private CreateLabel(){
        this.Label = new Laya.Label();
        this.Label.name = "label"
        this.Label.height = this.m_treeItemHeight;
        this.Label.align = this.m_align;
        this.Label.valign = "middle";
        this.Label.fontSize = this.m_fontsize;
        this.Label.color = this.m_labelColor;

        this.SetContent(this.ItemData.name);

        Laya.stage.addChild(this.Label);
    }
}