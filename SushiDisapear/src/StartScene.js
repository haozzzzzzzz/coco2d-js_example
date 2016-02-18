/**
 * Created by luohao on 2016/2/16 0016.
 */

var StartLayer = cc.Layer.extend({
    ctor : function(){
        this._super();

        var size = cc.winSize;

        var helloLabel = new cc.LabelTTF('Hello world', '', 38);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2;
        this.addChild( helloLabel );

        // add bg
        this.bgSprite = new cc.Sprite( res.background_png );
        this.bgSprite.attr({
            x : size.width / 2,
            y : size.height / 2
        });

        this.addChild( this.bgSprite, 0 );

        // add start menu
        var startItem = new cc.MenuItemImage(
            res.start_N_png,
            res.start_S_png,
            function(){
                //cc.log('Menu is clicked');
                //cc.director.runScene( new PlayScene() );
                //cc.director.runScene( new cc.TransitionCrossFade( 1, new PlayScene(), false ) );
                //cc.director.runScene( new cc.TransitionFade( 1, new PlayScene(), false ) );
                //cc.director.runScene( new cc.TransitionFadeTR( 1, new PlayScene(), false ) );
                //cc.director.runScene( new cc.TransitionJumpZoom( 1, new PlayScene(), false ) );
                //cc.director.runScene( new cc.TransitionMoveInL( 1, new PlayScene(), false ) );
                cc.director.runScene( new cc.TransitionPageTurn( 1, new PlayScene(), false ) );

                //cc.director.runScene( new cc.TransitionProgressHorizontal( 1, new PlayScene() ) );
                //cc.director.runScene( new cc.TransitionProgressInOut( 1, new PlayScene() ) );
                //cc.director.runScene( new cc.TransitionProgressOutIn( 1, new PlayScene() ) );
                //cc.director.runScene( new cc.TransitionProgressRadialCCW( 1, new PlayScene() ) );
                //cc.director.runScene( new cc.TransitionProgressVertical( 1, new PlayScene() ) );

                //cc.director.runScene( new cc.TransitionRotoZoom( 1, new PlayScene(), false ) );
                //cc.director.runScene( new cc.TransitionSceneOriented( 1, new PlayScene(), false ) );
                //cc.director.runScene( new cc.TransitionShrinkGrow( 1, new PlayScene(), false ) );
                //cc.director.runScene( new cc.TransitionSlideInL( 1, new PlayScene(), false ) );
                //cc.director.runScene( new cc.TransitionSplitCols( 1, new PlayScene(), false ) );
                //cc.director.runScene( new cc.TransitionTurnOffTiles( 1, new PlayScene(), false ) );

            },
            this
        );

        startItem.attr({
            x : size.width / 2,
            y : size.height/ 2,
            anchorX : 0.5,
            anchorY : 0.5
        });

        var menu = new cc.Menu( startItem );
        menu.x = 0;
        menu.y = 0;
        this.addChild( menu, 1 );

        return true;
    }
});

var StartScene = cc.Scene.extend({
    onEnter : function(){
        this._super();
        var layer = new StartLayer();
        this.addChild( layer );

    }
});