/**
 * Created by luohao on 2016/2/16 0016.
 */

var SushiSprite = cc.Sprite.extend({
    disappearAction : null,
    onTouchCallback : null,
    setTouchCallback : function(cb){
        this.onTouchCallback = cb;
    },
    onEnter : function(){
        //cc.log('onEnter');
        this._super();

        this.addTouchEventListener();

        this.disappearAction = this.createDisapearAction();
        this.disappearAction.retain();//增加一次引用
    },

    onExit : function(){
        //cc.log('onExit');
        this.disappearAction.release();//解除引用
        this._super();
    },

    addTouchEventListener : function(){
        var scope = this;
        this.touchListener = cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
            swallowTouches : true,
            onTouchBegan : function( touch, event ){
                var pos = touch.getLocation();
                var target = event.getCurrentTarget();
                if( cc.rectContainsPoint( target.getBoundingBox(), pos ) ){

                    target.removeEventListener();
                    target.stopAllActions();

                    var ac = target.disappearAction;

                    var seqAc = new cc.Sequence( ac, new cc.CallFunc(function () {
                        target.removeFromParent();
                    }, target ) );

                    target.runAction( seqAc );

                    //在SushiSprite被点中后，`removeTouchEventListenser()`移除注册的touch事件避免被再次点击。`stopAllActions()`停止SUshiSprite正在播放的动作。`cc.Sequence`是按序列播放动作。`cc.CallFunc`是Cocos2d-JS中提供的动画播放结束的处理回调。上面的代码通过cc.Sequence创建了Sushi消失的动作序列，并在动作结束后从层上移除SushiSprite.

                    //分数
                    !! scope.onTouchCallback ? scope.onTouchCallback() : false;

                    return true;
                }
                return false;
            }

        });

        cc.eventManager.addListener( this.touchListener, this );
    },

    createDisapearAction : function(){
        var frames = [];
        for( var i = 0; i < 11; i ++ ){
            var str = 'sushi_1n_' + i + '.png';
            var frame = cc.spriteFrameCache.getSpriteFrame( str );
            frames.push( frame );
        }

        var animation = new cc.Animation( frames, 0.02 );
        var action = new cc.Animate( animation );

        return action;
    }

});

var PlayLayer = cc.Layer.extend({
    bgSprite : null,
    sushiSprites : null,
    scoreLabel : null,
    timeoutLabel : null,
    timeout : 60,
    score : 0,

    ctor : function(){
        this._super();
        this.sushiSprites = [];

        var size = cc.winSize;

        this.bgSprite = new cc.Sprite( res.background_png );
        this.bgSprite.attr({
            x : size.width / 2,
            y : size.height / 2
        });

        this.addChild( this.bgSprite, 0 );

        this.schedule( this.update, 1, 16*1024, 1 );

        //加载帧图片到缓存
        try{
            cc.spriteFrameCache.addSpriteFrames( res.sushi_plist );
        }catch ( e ){
            console.log( e );
        }

        //score label
        this.scoreLabel = new cc.LabelTTF( 'score:0', 'Arial', 30 );
        this.scoreLabel.attr({
            x : size.width / 2 + 100,
            y : size.height - 20
        });
        this.addChild( this.scoreLabel, 5 );

        //timeout label
        this.timeoutLabel = new cc.LabelTTF( '' + this.timeout, 'Arial', 30 );
        this.timeoutLabel.attr({
            x : 20,
            y : size.height - 20
        });
        this.addChild( this.timeoutLabel, 5 );

        //定时
        this.schedule( this.timer, 1, this.timeout, 1 );

        return true;
    },

    update : function(){
        this.removeSushi();
        this.addSushi();
    },

    addSushi : function(){

        var scope = this;
        var sushi = new SushiSprite( res.sushi_1n_png );
        sushi.setTouchCallback(function(){
            scope.addScore();
        });
        var size = cc.winSize;

        var x = sushi.width / 2 + size.width / 2 * cc.random0To1();
        sushi.attr({
            x : x,
            y : size.height - 30
        });

        var dropAction = cc.MoveTo.create( 4, cc.p( sushi.x, -300 ) );
        sushi.runAction( dropAction );

        this.sushiSprites.push( sushi );
        this.addChild( sushi, 5 );
    },

    removeSushi : function(){
        for( var i = 0; i < this.sushiSprites.length; i ++ ){
            if( 0 >= this.sushiSprites[i].y ){
                this.sushiSprites[ i].removeFromParent();
                this.sushiSprites[ i ] = undefined;
                this.sushiSprites.splice( i, 1 );
                i = i -1;
            }
        }
    },

    addScore : function(){
        this.score += 1;
        this.scoreLabel.setString('score:' + this.score);
    },

    timer : function(){

        if( this.timeout == 0 ){

            var gameover = new cc.LayerColor( cc.color( 255, 255, 255, 100 ) );
            var size = cc.winSize;
            var titleLabel = new cc.LabelTTF( 'Game Over', 'Aral', 38 );
            titleLabel.attr({
                x : size.width / 2,
                y : size.height / 2
            });
            gameover.addChild( titleLabel, 5);

            var tryAgainItem = new cc.MenuItemFont(
                'Try Again',
                function(){
                    var transition = new cc.TransitionFade( 1, new PlayScene(), cc.color( 255, 255, 255, 255 ) );
                    cc.director.runScene( transition );
                },
                this
            );

            tryAgainItem.attr({
                x : size.width / 2,
                y : size.height / 2 - 60,
                anchorX : 0.5,
                anchorY : 0.5
            });

            var menu = new cc.Menu( tryAgainItem );
            menu.x = 0;
            menu.y = 0;
            gameover.addChild( menu, 1 );
            this.getParent().addChild( gameover );

            this.unschedule( this.update );
            this.unschedule( this.timer );

            return;
        }

        this.timeout --;
        this.timeoutLabel.setString( '' + this.timeout );

    }
});

var PlayScene = cc.Scene.extend({
    onEnter : function(){
        this._super();
        var layer = new PlayLayer();
        this.addChild( layer );
    }
});