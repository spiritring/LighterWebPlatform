
var TSJoinLayer = cc.Layer.extend({
    init:function () {
        var bRet = false;
        if (this._super()) {

            G_SceneState = G_SceneType.TSJoinLayer;

            var sp = cc.Sprite.create(s_loading);
            sp.setAnchorPoint(cc.p(0,0));
            this.addChild(sp, 0, 1);

            cc.MenuItemFont.setFontName("Arial");
            cc.MenuItemFont.setFontSize(26);
            var label = cc.LabelTTF.create("Back MainMenu", "Arial", 20);
            var back = cc.MenuItemLabel.create(label, this.onBackCallback);
            back.setScale(0.8);

            var menu = cc.Menu.create(back);
            menu.alignItemsInColumns(1);
            this.addChild(menu);

            var cp_back = back.getPosition();
            cp_back.y -= 50.0;
            back.setPosition(cp_back);

            bRet = true;
        }

        return bRet;
    },

    onBackCallback:function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(TSMainMenu.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },

    onMessageProc:function (oPacket) {

    }
});

var G_TSJoinLayer = null;

TSJoinLayer.create = function () {
    var sg = new TSJoinLayer();
    if (sg && sg.init()) {
        G_TSJoinLayer = sg;
        return sg;
    }
    return null;
};

TSJoinLayer.MessageProc = function(oPacket) {
    G_TSJoinLayer.onMessageProc(oPacket);
};
