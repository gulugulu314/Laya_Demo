import UICheckBoxItem, { CheckBoxItemData, CheckBoxStyle } from "./UICheckBoxItem";
import UICheckBox from "./UICheckBox";

export default class UICheckBoxTest{
    constructor(){

        this.CreateCheckBoxs();
    }

    public CreateCheckBoxs(){
        let checkbox:Array<CheckBoxItemData> = new Array<CheckBoxItemData>();

        let item:CheckBoxItemData = new CheckBoxItemData();
        item.code = "1";
        item.name = "111";
        item.legendColor = "#E9967A";

        let item2:CheckBoxItemData = new CheckBoxItemData();
        item2.code = "2";
        item2.name = "222";
        item2.legendColor = "#CAFF70";

        let item3:CheckBoxItemData = new CheckBoxItemData();
        item3.code = "3";
        item3.name = "333";
        item3.legendColor = "#B8860B";

        let item4:CheckBoxItemData = new CheckBoxItemData();
        item4.code = "4";
        item4.name = "444";
        item4.legendColor = "#8E388E";

        checkbox.push(item);
        checkbox.push(item2);
        checkbox.push(item3);
        checkbox.push(item4);

        //Normal
        let defaultCheckBox = new UICheckBox();
        defaultCheckBox.InitCheckBox(checkbox,null);
        defaultCheckBox.OnValueChanged =(data,b)=>{
            this.OnValueChanged(data,b);
        }

        //Icon
        let IconCheckBox = new UICheckBox();
        IconCheckBox.InitCheckBox(checkbox,new Laya.Vector2(300,0),CheckBoxStyle.Icon);
        IconCheckBox.OnValueChanged =(data,b)=>{
            this.OnValueChanged(data,b);
        }
    }

    OnValueChanged(data:Array<UICheckBoxItem>,b:boolean){
        //TEMP:
        let str;
        data.forEach(element => {
            str += element.CheckBoxData.code + ",";
        });
        console.debug("改变的元素为："+str);
    }

}