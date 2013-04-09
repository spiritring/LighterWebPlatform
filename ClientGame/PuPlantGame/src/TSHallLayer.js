var TSHallLayer = cc.Layer.extend({

    menu:null,

    init:function () {
        var bRet = false;
        if (this._super()) {

            G_SceneState = G_SceneType.TSHallLayer;

            var sp = cc.Sprite.create(s_loading);
            sp.setAnchorPoint(cc.p(0,0));
            this.addChild(sp, 0, 1);

            cc.MenuItemFont.setFontName("Arial");
            cc.MenuItemFont.setFontSize(26);
            var label = cc.LabelTTF.create("Back MainMenu", "Arial", 20);
            var back = cc.MenuItemLabel.create(label, this.onBackCallback);
            back.setScale(0.8);

            this.menu = cc.Menu.create(back);
            this.menu.alignItemsInColumns(1);
            this.addChild(this.menu);

            var cp_back = back.getPosition();
            cp_back.y -= 50.0;
            back.setPosition(cp_back);

            bRet = true;


            var sPacket = {
                MM:"SysOrder",
                Order:"CreateRoom"
            };
            SendBuffer(G_hSocket, sPacket);
        }

        return bRet;
    },
    onBackCallback:function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(TSMainMenu.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    onMessageProc:function(oPacket){

        switch (oPacket.MM) {
            case "CreateRoom":
                var sName = oPacket.NAME;

                cc.MenuItemFont.setFontName("Arial");
                cc.MenuItemFont.setFontSize(26);
                var label = cc.LabelTTF.create("MainPlayer:"+sName, "Arial", 20);
                var back = cc.MenuItemLabel.create(label);
                back.setScale(0.8);

                this.menu.addChild(back);
                break;
        }
    }
});

var G_TSHallLayer = null;

TSHallLayer.create = function () {
    var sg = new TSHallLayer();
    if (sg && sg.init()) {
        G_TSHallLayer = sg;
        return sg;
    }
    return null;
};

TSHallLayer.MessageProc = function (oPacket) {
    if (G_TSHallLayer == null)
        return;
    G_TSHallLayer.onMessageProc(oPacket);
};

