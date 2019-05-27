import Label = Laya.Label;

export default class ShowMessage{

    private static _instance = null;
    static Instance(){
        if(this._instance == null){
            if(ShowMessage._instance == null){
                ShowMessage._instance = new ShowMessage();
            }
            return ShowMessage._instance;
        }
    }

    public Label:Laya.Label;

    private m_text:string;
    private m_font:string;
    private m_fontSize:number;
    private m_color:string;
    private m_stroke:number;
    private m_strokeColor:string;


    private InitDefault(){
        this.m_font = "Microsoft YaHei";
        this.m_fontSize = 12;
        this.m_text = "Message";
        this.m_color = "#000000";
        this.m_stroke = 1;
        this.m_strokeColor = "#ffffff";
    }

    public createLabel(pos:Laya.Vector2, isStroke?:boolean) {

        this.InitDefault();
        
        this.Label = new Label();
        this.Label.font = this.m_font;
        this.Label.fontSize = this.m_fontSize;
        this.Label.text = this.m_text;
        this.Label.color = this.m_color;
        if(isStroke){
            this.Label.stroke = this.m_stroke;
            this.Label.strokeColor = this.m_strokeColor;
        }
        this.Label.pos(pos.x,pos.y);
        Laya.stage.addChild(this.Label);
    }

    public SetMessage(msg:string){
        if(this.Label!=null){
            this.Label.text = msg;
        }
    }

    public SetLabelColor(hexColor:string){
        if(this.Label != null){
            this.Label.color = hexColor;
        }
    }
}