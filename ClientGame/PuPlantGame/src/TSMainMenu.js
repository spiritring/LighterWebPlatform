cc.dumpConfig();

var TSMainMenu = cc.Layer.extend({
    init:function() {
        var bRet = false;
        if (this._super()) {

            G_SceneState = G_SceneType.TSMainMenuLayer;

            var sp = cc.Sprite.create(s_loading);
            sp.setAnchorPoint(cc.p(0, 0));
            this.addChild(sp, 0, 1);

            var logo = cc.Sprite.create(s_logo);
            logo.setAnchorPoint(cc.p(0, 0));
            logo.setPosition(cc.p(0, 250));
            this.addChild(logo, 10, 1);

            var lbScore = cc.LabelBMFont.create(String(G_hSocket.PORT), s_arial14_fnt);
            lbScore.setAnchorPoint( cc.p(1,0) );
            lbScore.setAlignment( cc.TEXT_ALIGNMENT_RIGHT );
            lbScore.setPosition(winSize.width - 5 , winSize.height - 30);
            this.addChild(lbScore, 1000);

            var newGameNormal = cc.Sprite.create(s_menu, cc.rect(0, 0, 126, 33));
            var newGameSelected = cc.Sprite.create(s_menu, cc.rect(0, 33, 126, 33));
            var newGameDisabled = cc.Sprite.create(s_menu, cc.rect(0, 33 * 2, 126, 33));

            var gameSettingsNormal = cc.Sprite.create(s_menu, cc.rect(126, 0, 126, 33));
            var gameSettingsSelected = cc.Sprite.create(s_menu, cc.rect(126, 33, 126, 33));
            var gameSettingsDisabled = cc.Sprite.create(s_menu, cc.rect(126, 33 * 2, 126, 33));

            var aboutNormal = cc.Sprite.create(s_menu, cc.rect(252, 0, 126, 33));
            var aboutSelected = cc.Sprite.create(s_menu, cc.rect(252, 33, 126, 33));
            var aboutDisabled = cc.Sprite.create(s_menu, cc.rect(252, 33 * 2, 126, 33));

            var newGame = cc.MenuItemSprite.create(newGameNormal, newGameSelected, newGameDisabled,
                this.onNewGame, this);
            var gameSettings = cc.MenuItemSprite.create(gameSettingsNormal, gameSettingsSelected, gameSettingsDisabled,
                this.onSettings, this);
            var about = cc.MenuItemSprite.create(aboutNormal, aboutSelected, aboutDisabled,
                this.onAbout, this);

            var menu = cc.Menu.create(newGame, gameSettings, about);
            menu.alignItemsVerticallyWithPadding(10);
            this.addChild(menu, 1, 2);
            menu.setPosition(winSize.width / 2, winSize.height / 2 - 80);
            this.schedule(this.update, 0.1);

            bRet = true;
        }
        return bRet;
    },

    onNewGame:function (pSender) {
        console.log("onNewGame Clicked!");

        var scene = cc.Scene.create();
        scene.addChild(TSGameLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    onSettings:function (pSender) {
        console.log("onSettings Clicked!");

        var scene = cc.Scene.create();
        scene.addChild(TSSettingsLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    onAbout:function (pSender) {
        console.log("onAbout Clicked!");

        var scene = cc.Scene.create();
        scene.addChild(TSAboutLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    update:function () {

    }
});

TSMainMenu.create = function () {
    var sg = new TSMainMenu();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

TSMainMenu.scene = function () {
    var scene = cc.Scene.create();
    var layer = TSMainMenu.create();
    scene.addChild(layer);
    return scene;
};

TSMainMenu.MessageProc = function(oPacket) {
    G_Output.innerHTML += ('<strong>登陆成功!</strong>' + oPacket.UUID + '<br>\n');
}
