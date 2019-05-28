import UITree from "./UITree";
import { TreeItemData, TreeItemStyle } from "./UITreeItem";

export default class UITreeTest{

    constructor(){

        this.CreateTree();
    }

    public CreateTree(){

        let tree:Array<TreeItemData> = new Array<TreeItemData>();

        let item:TreeItemData = new TreeItemData();
        item.code = "1";
        item.name = "111";
        item.parentCode = null;
        item.level = 1;
        item.isLeaf = false;
        item.children = new Array<TreeItemData>();

        let item2:TreeItemData = new TreeItemData();
        item2.code = "2";
        item2.name = "222";
        item2.parentCode = "1";
        item2.level = 2;
        item2.isLeaf = false;
        item2.children = new Array<TreeItemData>();

        let item7:TreeItemData = new TreeItemData();
        item7.code = "7";
        item7.name = "777";
        item7.parentCode = "2";
        item7.level = 3;
        item7.isLeaf = true;

        item2.children.push(item7);

        let item3:TreeItemData = new TreeItemData();
        item3.code = "3";
        item3.name = "333";
        item3.parentCode = "1";
        item3.level = 2;
        item3.isLeaf = true;

        let item4:TreeItemData = new TreeItemData();
        item4.code = "4";
        item4.name = "444";
        item4.parentCode = "1";
        item4.level = 2;
        item4.isLeaf = true;

        let item5:TreeItemData = new TreeItemData();
        item5.code = "5";
        item5.name = "555";
        item5.parentCode = null;
        item5.level = 1;
        item5.isLeaf = false;
        item5.children = new Array<TreeItemData>();

        let item6:TreeItemData = new TreeItemData();
        item6.code = "6";
        item6.name = "666";
        item6.parentCode = "5";
        item6.level = 2;
        item6.isLeaf = true;

        item5.children.push(item6);

        item.children.push(item2);
        item.children.push(item3);
        item.children.push(item4);


        tree.push(item);
        tree.push(item5);

        //默认tree
        let defaultTree = new UITree();
        defaultTree.InitTree(tree,null,new Laya.Vector2(500,0),"#C0FF3E");
        defaultTree.OnValueChanged =(data,b)=>{
            this.OnValueChanged(data,b);
        } 

        //自定义tree style,ItemColor与BgColor一致
        let style:TreeItemStyle = new TreeItemStyle();
        style.ItemHeigth = 40;
        style.ItemWidth = 200;
        style.ItemIntentLevel = 10;
        style.LabelFontsize = 18;
        style.LabelColor = "#CD2626";
        style.ItemColor = "#EEB422";

        let customTree = new UITree();
        customTree.InitTree(tree,style,new Laya.Vector2(1000,0),"#EEB422");
        customTree.OnValueChanged =(data,b)=>{
            this.OnValueChanged(data,b);
        } 

    }

    OnValueChanged(arr:Array<any>,b:boolean){
        //TEMP:
        let str;
        arr.forEach(element => {
            str += element.ItemData.code + ",";
        });
        console.debug("改变的元素为："+str);
    }
}