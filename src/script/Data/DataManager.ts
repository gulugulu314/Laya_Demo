import Handler = laya.utils.Handler;
import NameConfig from "../Configure/NameConfig";
import GameManager from "../GameManager";
import TableOrgnization from "./TableOrgnization";
import MtHttp from "../Network/MtHttp";
import TableUsageType from "./TableBIMUsageType";
import TableBIMSpace, { SpaceData } from "./TableBIMSpace";

export default class DataManager{

    tableOrganization:TableOrgnization;
    tableUsageType:TableUsageType;
    tableBimSpace:TableBIMSpace;

    constructor(){}

    Init(){
        this.RegisterTables();
    }

    RegisterTables(){
        this.tableBimSpace = new TableBIMSpace();
        this.tableBimSpace.Init(GameManager.Instance().Http.URL,()=>{

            this.tableOrganization = new TableOrgnization();
            this.tableOrganization.Init(GameManager.Instance().Http.URL,()=>{

                this.tableUsageType = new TableUsageType();
                this.tableUsageType.Init(GameManager.Instance().Http.URL,()=>{

                    GameManager.Instance().LoadRes();

                });
            });    
        });
    }


    GetOneOrganizationName(code:string,level?:string):string{
        if(this.tableOrganization.IsLoaded){
            return this.tableOrganization.GetOneOrganizationName(code,level);
        }else
            return null;        
    }

    GetOneOrganizationColor(code:string):string{
        if(this.tableOrganization.IsLoaded){
            return this.tableOrganization.GetOneOrganizationColor(code);
        }else
            return null;
    }

    GetOneUsageName(code:string):string{
        if(this.tableUsageType.IsLoaded){
            return this.tableUsageType.GetOneUsageName(code);
        }else
            return null;
    }

    GetOneUsageColor(code:string):string{
        if(this.tableUsageType.IsLoaded){
            return this.tableUsageType.GetOneUsageColor(code);
        }else
            return null;
    }

    GetOneSpaceData(code:string):SpaceData{
        if(this.tableBimSpace.IsLoaded){
            return this.tableBimSpace.GetOneSpaceData(code);
        }else
            return null;
    }

    GetOneLevelOrganizations(level:string):Array<string>{
        if(this.tableBimSpace.IsLoaded){
            return this.tableBimSpace.GetOneLevelOrgnizations(level);
        }else
            return null;
    }

    GetOneLevelFloorsByOrgs(level:string, orgs:Array<string>):Array<string>{
        if(this.tableBimSpace.IsLoaded){
            return this.tableBimSpace.GetOneLevelCodesByOrgs(level,orgs);
        }else{
            return null;
        }
    }
}
