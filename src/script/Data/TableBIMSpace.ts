import GameManager from "../GameManager";

export default class TableBIMSpace{

    private readonly TabelName:string = "BIMSpace";

    private m_levelSpaceCodes:Laya.WeakObject;
    private SpaceDataDic:Laya.WeakObject;

    IsLoaded:boolean;

    Init(url:string,finished?:any){

        this.InitContainer();

        var postUrl = url.concat("/IVS/BIMSpace/dynamicQuery");
        var postBody = JSON.stringify({"levelCodeList":["PUMCHW-D03-F001","PUMCHW-D03-F002","PUMCHW-D03-F003"]});

        this.AsynLoadData(postUrl,postBody,finished);
    }

    GetOneSpaceData(code:string):SpaceData{
        if(code == null) return null;
        if(this.SpaceDataDic.has(code)){
            return this.SpaceDataDic.get(code);
        } else
        return null;
    }

    GetOrganizationByCode(code:string){
        if(code == null) return null;
        if(this.SpaceDataDic.has(code)){
            return this.SpaceDataDic.get(code).organizationCode;
        } else
        return null;
    }

    GetOneLevelOrgnizations(level:string):Array<string>{
        let orgs = new Array<string>();

        if(this.m_levelSpaceCodes.has(level)){
            this.m_levelSpaceCodes.get(level).forEach(element => {
                let orgCode = this.GetOrganizationByCode(element);

                let b = orgs.some((code):boolean=>{return code == orgCode;})
                if(!b) orgs.push(orgCode);       
            });
        }
        return orgs;
    }

    GetOneLevelCodesByOrgs(level:string,orgs:Array<string>):Array<string>{
        let floorCodes = new Array<string>();

        if(this.m_levelSpaceCodes.has(level)){
            this.m_levelSpaceCodes.get(level).forEach(element => {
                let orgCode = this.GetOrganizationByCode(element);
                let b = orgs.some((code):boolean=>{
                    return code == orgCode;
                });              
                if(b){
                    floorCodes.push(element);
                }
            });
        }
        return floorCodes;
    }

    private InitContainer(){
        this.m_levelSpaceCodes = new Laya.WeakObject();
        this.SpaceDataDic = new Laya.WeakObject();
    }

    private AsynLoadData(url:string,postBody:any,finished?:any){
        if(url == null || postBody ==null) return ;

        GameManager.Instance().Http.post(url,postBody,this,(e:any)=>{
            if(e.state == "succeed"){
                var rst =e.data["data"]["list"];
                rst.forEach(element => {
                    var ele = this.CreateSpaceData(element);
                    if(ele!=null&& ele.code!=null){
                        if(!this.SpaceDataDic.has(ele.code)){
                            this.SpaceDataDic.set(ele.code,ele);
                        }
                    }
                    //levelCodes
                    let level = ele.levelCode;
                    if(!this.m_levelSpaceCodes.has(level)) {
                        this.m_levelSpaceCodes.set(level,new Array<string>());
                    }
                    this.m_levelSpaceCodes.get(level).push(ele.code);
                });

                finished.apply();
                this.IsLoaded = true;
            }
        });
    }

    private CreateSpaceData(element:any):SpaceData {
        var data: SpaceData = new SpaceData();
        data.code = element.code;
        data.usageName = element.usageName;
        data.buildingCode = element.buildingCode;
        data.campusCode = element.campusCode;
        data.levelCode = element.levelCode;
        data.organizationCode = element.organizationCode;
        data.usageTypeCode = element.usageTypeCode;
        data.useArea = element.useArea.toFixed(2).toString() + "m²";
        data.perimeter = element.perimeter;
        return data;
    }
}


export class SpaceData{
    public code:             string;
    public usageName:        string;
    public buildingCode:     string;
    public campusCode:       string;
    public levelCode:        string;
    public organizationCode: string;
    public usageTypeCode:    string;
    public useArea:          string;
    public perimeter:        string;
}  

