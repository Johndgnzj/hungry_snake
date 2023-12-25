var images = new Array(); //預載圖片
var attack_item = ['images/attack_item_1.gif', 'images/attack_item_2.gif'];
var light_ball = ['images/food_1.png', 'images/food_2.png', 'images/food_3.png', 'images/food_4.png', 'images/food_5.png'];
var result_bg = ['images/new_record.png', 'images/new_global_record_bg.png']
var DropitemSize = 0; //掉落物邊長
var movingStatus = false; // 是否移動中
var FlagSnakeResize = true; // 是否允許魯蛇改變大小
var FlagAllowEffectSound = true; // 是否播放音效
var FlagShowArrowKeyPad = false; // 是否顯示方向按鍵
var screenWidth = 0;
var bodyHeight = 0;
var infiniteBGHeight = 0;
var yCount = 12; // 螢幕高度單位數
var xCount = 7; // 螢幕寬度單位數
var startGameCount = 3; //開始遊戲倒數
var borderLeft = 0;
var borderTop = 0;
var borderRight = 0;
var borderBottom = 0; // 遊戲框位置-下
var snake_dive_height = 140; // 蛇的下沈深度位移
var aliveTime = 0; // 目前遊戲時間
var gameTimer; // 遊戲主計時器
var attactTimer; // 攻擊計時器
var DropItemSpeed = 6000; // 光球掉落速度。
var DropItemMinSpeed = 3000; // 光球最快掉落速度。
var DropItemDepth = 100; // 光球掉落加深高度。
var DropItemSpeedUpPerLevel = 1000; // 光球掉落速度每級加快時間。
var BackGroundForwardSpeed = 30000;
var MovingGroundSinkRate = 1000; // 每單位下沈毫秒，越低越快
var MovingGroundSinkUnit = 60; // 每下沈單位,越低越慢
var CurrentSinkGround; // 當前下沈的地板
var snakeMovingSpeed = 750; // 魯蛇透過左右按鍵或方向鍵移動的速度
var GameLevel = 1; // 遊戲難度
var SnakeLevel = 1; // 魯蛇尺吋等級
var ItemOfincreateSnakeRequire = 30; // 魯蛇長大所需食物數量
var LevelUpSecond = 30; // 升級速度，直接影響遊戲難度
var MaxAttackLevel = 99; // 最高攻擊等級
var MaxSnakeLevel = 5; // 最高魯蛇等級
var MaxLightBallNum = 10; // 最高光球(小吃)數量上限
var MaxGameLevel = 10; // 最高遊戲難度
var HeightOfSnakePerLevel = (snake_dive_height - 10) / MaxSnakeLevel; // 每升一級上升的高度
var WidthOfSnakePerLevel = 0; // 每升一級增加的寬度
var score = 0; //目前分數
var defaultSnakeHeight = 160; // 初級魯蛇高度
var defaultSnakeWidth = 30; // 初級魯蛇寬度
var defaultAttactTime = 2000; // 預設攻擊延遲時間(物件掉落)
var defaultAttactItemNum = 2; // 預設攻擊個數
var defaultLightBallNumber = 8; // 預設小吃個數
var status = 0; // 目前狀態：0=準備；1=開始；2=遊戲結束
var gameMode = 1; // 攻擊模式(0=光球掉落; 1=地面下沈)
var die = new Audio('sound/die.mp3');
var eat = new Audio('sound/eat.mp3');
var bgm = new Audio('sound/bgm.mp3');
var start = new Audio('sound/start.mp3');
var tmp_session_id = '';
var pagesize = 20;
var more_global = true;
var offset_global = 0;
$(function () {
	//$(window).scroll(checkOverlay).trigger('scroll');
	//checkOverlay();
	//CreateLightBall();
	//TestStep();
	window.fbAsyncInit = function () {
		FB.init({
			appId: '1630743700553639'
			, cookie: true, // enable cookies to allow the server to access the session
			xfbml: true, // parse social plugins on this page
			version: 'v2.8' // use graph api version 2.8
		});
		FB.getLoginStatus(function (response) {
			changeStatus(response)
		});
	};
	$.preload("images/infinity_bg.jpg", "images/result-bg.jpg", "images/index_bg.jpg", "images/go.png", "images/1.png", "images/2.png", "images/3.png", "images/lvup.png", "images/gameover.png", "images/food_1.png", "images/food_2.png", "images/food_3.png", "images/food_4.png", "images/food_5.png", "images/snake_1.png", "images/snake_2.png", "images/snake_3.png", "images/snake_4.png", "images/snake_5.png", "images/snake_1_die.png", "images/snake_2_die.png", "images/snake_3_die.png", "images/snake_4_die.png", "images/snake_5_die.png", "images/attack_item_1.png", "images/attack_item_2.png", "images/item-disappear.png", "images/start.png", "images/invite_friend.png", "images/download.png", "images/facebook_login.png", "images/fb_share.png");
	$(document).on('keydown', function (e) {
		//console.log(e.key);
		switch (e.key) {
			case 'ArrowLeft':
			case 'Left':
				MoveSnake(-1);
				break;
			case 'ArrowRight':
			case 'Right':
				MoveSnake(1);
		}
	});
	$(document).on('keyup', function (e) {
		//console.log(e.key);
		switch (e.key) {
			case 'ArrowLeft':
			case 'Left':
			case 'ArrowRight':
			case 'Right':
				MoveSnake(0);
		}
	});
	bgm.onended = function () {
		bgm.currentTime = 0;
		bgm.play();
	}
	$(".startGame").click(function () {
		die.play();
		bgm.play();
		eat.play();
		start.play();
		$('.introWindows').fadeOut(500);
		CountDown();
	});
	//螢幕自適應大小
	$(window).on('resize', function () {
		onReSizePage();
		SetSnakeSize(SnakeLevel);
		DragSetup();
	});
	// 讓 body 內的物件無法被選取
	document.body.onselectstart = function () {
		return false;
	}
	onReSizePage();
	InitGame();
	UpdateScore(false);
	//var guid = GetQueryStringParams('guid') ;
	//if (guid == '' || guid == undefined) {
	//	die.play();
	//	bgm.play();
	//	start.play();
	//	CountDown();
	//}
	//autostart_clock = setTimeout(AutoStartGame,2000);
});
// 啟動
var AutoStartGame = function () {
	eat.play();
	//eat.pause();
	die.play();
	//die.pause();
	bgm.play();
	//bgm.pause();
	start.play();
	$('.startWindow').hide();
	CountDown();
}
// 初始化遊戲參數
function InitGame() {
	startGameCount = 3;
	GameLevel = 1;
	SnakeLevel = 1;
	status = 0;
	score = 0;
	aliveTime = 0;
	DropItemSpeed = 6000;
	$(".snake").css('left', borderLeft + (screenWidth / 2));
	$(".snake img").prop('width', DropitemSize);
	$(".snake").css({
		'height': $(".snake img").height()
		, 'width': DropitemSize
	}).show();
	$("#score").html(score);
	$("#aliveTime").html(aliveTime);
	$("#level").html(GameLevel);
	$(".prevSink").css({
		'height': bodyHeight
		, 'width': screenWidth
		, 'top': 0
		, 'left': 0
	});
	var nextSink = GetSinkPanel();
	$(".panel-ground").append($(nextSink).css({
		'top': -bodyHeight
		, 'left': 0
	}));
	SettingBackground();
	SetSnakeSize(SnakeLevel);
	DragSetup();
	//GetBackgroundPanel();
	ShowResult(GetQueryStringParams('guid'), getCookie('tmp_session_id'));
}
// 計算背景調整後的高度時間太久以至於沒有即時設定好背景的補救
function SettingBackground() {
	if (infiniteBGHeight == 0) {
		console.log('infiniteBGHeight' + infiniteBGHeight);
		infiniteBGHeight = $("#beginBackGround img").height();
		var doReset = setTimeout(SettingBackground, 200);
	} else {

		$("#beginBackGround").css({
			'top': (-infiniteBGHeight + bodyHeight) + 'px'
			, 'left': 0
			, 'height': infiniteBGHeight
		})
	}
}
//預載圖片
function preload() {
	for (i = 0; i < preload.arguments.length; i++) {
		images[i] = new Image()
		images[i].src = preload.arguments[i]
	}
}
// 判斷物件是否重疊
function isOver(o1, o2) {
	o1 = $(o1);
	o2 = $(o2);
	var p1 = o1.position()
		, p2 = o2.position();
	p1.top += $(o1).parent().position().top;
	p1.right = p1.left + o1.width();
	p1.bottom = p1.top + o1.height();
	p2.right = p2.left + o2.width();
	p2.bottom = p2.top + o2.height();
	//判断4个顶点是否在另外一个对象的区域内
	var rst =
		//o2作为参考对象
		((p1.left >= p2.left && p1.left <= p2.right && p1.top >= p2.top && p1.top <= p2.bottom)) || //左上角
		((p1.right >= p2.left && p1.right <= p2.right && p1.top >= p2.top && p1.top <= p2.bottom)) || //右上角
		((p1.left >= p2.left && p1.left <= p2.right && p1.bottom >= p2.top && p1.bottom <= p2.bottom)) || //左下角
		((p1.right >= p2.left && p1.right <= p2.right && p1.bottom >= p2.top && p1.bottom <= p2.bottom)) || //右下角
		//o1作为参考对象
		((p2.left >= p1.left && p2.left <= p1.right && p2.top >= p1.top && p2.top <= p1.bottom)) || //左上角
		((p2.right >= p1.left && p2.right <= p1.right && p2.top >= p1.top && p2.top <= p1.bottom)) || //右上角
		((p2.left >= p1.left && p2.left <= p1.right && p2.bottom >= p1.top && p2.bottom <= p1.bottom)) || //左下角
		((p2.right >= p1.left && p2.right <= p1.right && p2.bottom >= p1.top && p2.bottom <= p1.bottom)) //右下角
	;
	//上面的判断失败，则为十字架关系，内部一部分包含在另外一个对象中，但是顶点相互不在对方内部
	if (!rst) rst =
		//o2作为参考
		(p1.left < p2.left && p1.right > p2.right && p1.top > p2.top && p1.bottom < p2.bottom) || //o1水平横穿o2
		(p1.left > p2.left && p1.right < p2.right && p1.top < p2.top && p1.bottom > p2.bottom) || //o1垂直横穿o2
		//o1作为参考
		(p2.left < p1.left && p2.right > p1.right && p2.top > p1.top && p2.bottom < p1.bottom) || //o2水平横穿o1
		(p2.left > p1.left && p2.right < p1.right && p2.top < p1.top && p2.bottom > p1.bottom) //o2垂直横穿o1
	;
	return rst;
}
// 抓畫面上所有的drop-item丟到isOver比較是否重疊，
function checkOverlay() {
	var snake = $('#snake');
	if (status != 2) {
		$('.movingSink').children('.drop-item').each(function () {
			var o1 = $(this);
			var p1 = o1.position();
			p1.top += $(this).parent().position().top;
			if ((p1.top >= ($("#snake").position().top - DropitemSize - 20)) && p1.top < bodyHeight) {
				if (isOver($(this), snake)) {
					if ($(this).prop('id') == 'attack') {
						console.log(new Date + ' -- Game Over --');
						status = 2;
						$(this).clearQueue().stop();
						clearInterval(gameTimer);
						clearTimeout(attactTimer);
						$('div').each(function () {
							$(this).clearQueue().stop();
						});
						GameOver();
					}
					else {
						AddScore();
						CreateEatEffect(p1.top, p1.left);
						$(this).stop().removeClass('drop-item').addClass('drop-item-remove').clearQueue().remove();
					}
				}
			}
		});
	}
}
// 倒數開始
function CountDown() {
	if (startGameCount > 0) {
		showMsg(startGameCount);
		startGameCount--;
		setTimeout(function () {
			CountDown()
		}, 1000);
		return;
	}
	showMsg('go');
	status = 1;
	$.get('GetSession.aspx', function (data) {
		tmp_session_id = data;
		setCookie('tmp_session_id', data, 1);
		gameTimer = setInterval(countAlifeTime, 1000);
		//SetAttactMode();
		StartMovingGround();
		StartMovingBackGround();
	});
}
// 顯示訊息
function showMsg(msg) {
	if (msg > 0 && msg < 4) {
		msg = '<img src="images/' + msg + '.png" style="width:33%;">';
	}
	else if (msg == '升級!') {
		msg = '<img src="images/lvup.png" style="width:50%;">';
	}
	else if (msg == 'go') {
		msg = '<img src="images/go.png" style="width:33%;">';
	}
	else if (msg == 'gameover') {
		msg = '<img src="images/gameover.png" style="width:33%;">';
	}
	//$('#showMsg').html(msg).addClass('bounceIn animated').show().queue(function (next) {
	//    $(this).removeClass('bounceIn animated webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
	//    next();
	//}).hide();
	$('#showMsg').html(msg).show().addClass('bounceIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
		$(this).removeClass('bounceIn animated webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend').hide();
	});
}
// 產生小吃
function CreateLightBall() {
	//console.log("Drop Light ball,Speed:" + DropItemSpeed);
	var showUpPosition_Left = getRandomInt(borderLeft, borderRight - DropitemSize);
	var item_idx = getRandomInt(1, light_ball.length);
	var lightBall = $('<div id="lightBall" class="drop-item"><img src="' + light_ball[item_idx - 1] + '" width="' + DropitemSize + '" height="' + DropitemSize + ' style="top:-' + (DropitemSize * 0.2) + ';left:-' + (DropitemSize * 0.2) + ';position:absolute;" /></div>').css({
		'height': DropitemSize - 4
		, 'width': DropitemSize - 4
	});
	return lightBall;
}
// 產生攻擊掉落物
function CreateAttack() {
	//console.log("Drop attack item, Speed:" + DropItemSpeed);
	var showUpPosition_Left = getRandomInt(borderLeft, borderRight - DropitemSize);
	var item_idx = getRandomInt(1, attack_item.length);
	var drop_item = $('<div id="attack" class="drop-item"><img src="' + attack_item[item_idx - 1] + '" width="' + DropitemSize + '" height="' + DropitemSize + ' style="top:-' + (DropitemSize * 0.2) + ';left:-' + (DropitemSize * 0.2) + ';position:absolute;" /></div>').css({
		'height': DropitemSize - 4
		, 'width': DropitemSize - 4
	});
	return drop_item;
}
// 產生吃到的特效
function CreateEatEffect(top, left) {
	var item = $('<div id="lightBall" class="drop-item"><img src="images/item-disappear.png" width="' + DropitemSize + '" height="' + DropitemSize + '" /></div>').css({
		'left': left
		, 'top': top
	});
	$(item).appendTo($('.panel-body'));
	$(item).fadeOut('slow', function () {
		$(item).remove();
	});
}
// 取得亂數
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
// 累加秒數，判斷升級
function countAlifeTime() {
	aliveTime += 1;
	if (aliveTime % LevelUpSecond == 0) {
		// Level Up
		//console.log('Speed Up:' + GameLevel + ', Attack Item:' + (defaultAttactItemNum + Math.floor(GameLevel / 2)));
		//DropItemSpeed = ((DropItemSpeed - DropItemSpeedUpPerLevel) >= DropItemMinSpeed ? (DropItemSpeed - DropItemSpeedUpPerLevel) : DropItemMinSpeed);
		//console.log('Drop item Speed Up to:' + DropItemSpeed);
	}
	$("#aliveTime").html(aliveTime);
	//$("#level").html(GameLevel);
}
// 設定攻擊模式 [掉落模式使用]
function SetAttactMode() {
	switch (gameMode) {
		case 1:
			break;
		default:
			// 光球
			var ballNum = getRandomInt(1, MaxLightBallNum);
			var nextAttactTime = defaultAttactTime - (GameLevel * 10);
			for (var i = 0; i < ballNum; i++) {
				var delayAttackTime = getRandomInt(0, nextAttactTime);
				var startAttact = setTimeout(CreateLightBall, delayAttackTime);
			}
			// 攻擊 
			var attackNum = getRandomInt(0, Math.floor(GameLevel / 2));
			nextAttactTime = defaultAttactTime - (GameLevel * 10);
			for (var i = 0; i < (defaultAttactItemNum + attackNum) ; i++) {
				var delayAttackTime = getRandomInt(0, nextAttactTime);
				var startAttact = setTimeout(CreateAttack, delayAttackTime);
			}
			attactTimer = setTimeout(SetAttactMode, nextAttactTime);
			break;
	}
}
// 移動掉落物的地板
function StartMovingGround() {
	if ($('.prevSink')) {
		$('.prevSink').animate({
			top: '+=' + bodyHeight + 'px'
		}, {
			duration: DropItemSpeed
			, step: function (now, fx) {
				var n = parseInt(now);
				$(this).css("top", n);
				if (!$(this).hasClass('movingSink')) $(this).addClass('movingSink');
				if (n >= (bodyHeight / 2) && $(".nextSink").length <= 1) {
					var nextSink = GetSinkPanel();
					$(".panel-ground").append($(nextSink).css({
						'top': -bodyHeight
						, 'left': 0
					}));
				}
			}
			, easing: 'linear'
		}).queue(function (next) {
			$(this).remove();
			next();
		});
	}
	$('.nextSink').animate({
		top: '+=' + bodyHeight + 'px'
	}, {
		duration: DropItemSpeed, step: function (now, fx) {
			var n = parseInt(now);
			if (!$(this).hasClass('movingSink')) $(this).addClass('movingSink');
			$(this).css("top", n);
			checkOverlay();
		}
		, easing: 'linear'
	}).queue(function (next) {
		$(this).removeClass('nextSink').addClass('prevSink');
		StartMovingGround();
		next();
	});
}
// 移動背景 -3是為了不知原因的間距修正
function StartMovingBackGround() {
	if ($('.prevBackGround').length > 0) {
		console.log('開始移動 Prev');
		$('.prevBackGround').animate({
			top: '+=' + bodyHeight + 'px'
		}, {
			duration: DropItemSpeed
			, step: function (now, fx) {
				var n = parseInt(now);
				$(this).css("top", n);
			}
			, easing: 'linear'
		}).queue(function (next) {
			console.log('移除 Prev');
			$(this).remove();
			next();
		});
	}
	if ($('.nextBackGround').length > 0) {
		console.log('開始移動 Next');
		$('.nextBackGround').css('bottom', $('.prevBackGround').position().top);
		$('.nextBackGround').animate({
			top: '+=' + (infiniteBGHeight - 3) + 'px'
		}, {
			duration: (infiniteBGHeight - 3) * (DropItemSpeed / bodyHeight)
			, step: function (now, fx) {
				var n = parseInt(now);
				$(this).css("top", n);
			}
			, easing: 'linear'
		}).queue(function (next) {
			console.log('把 Next 換成 Prev');
			if ($('.nextBackGround').length <= 1) {
				console.log('產生下一個 Next 背景');
				var nextBackground = GetBackgroundPanel();
				$(".panel-ground").append($(nextBackground).css({
					'top': (-infiniteBGHeight + 3) + 'px'
					, 'left': 0
				}));
			}
			$(this).removeClass('nextBackGround').addClass('prevBackGround');
			StartMovingBackGround();
			next();
		});
	}
	if ($('.beginBackGround').length > 0) {
		console.log('開始移動 Begin');
		$('.beginBackGround').animate({
			top: '+=' + (infiniteBGHeight - bodyHeight - 3) + 'px'
		}, {
			duration: (infiniteBGHeight - bodyHeight - 3) * (DropItemSpeed / bodyHeight)
			, step: function (now, fx) {
				var n = parseInt(now);
				$(this).css("top", n);
				if ($('.nextBackGround').length < 1) {
					var nextBackground = GetBackgroundPanel();
					$(".panel-ground").append($(nextBackground).css({
						'top': (-infiniteBGHeight + 3) + 'px'
						, 'left': 0
					}));
				}

			}
			, easing: 'linear'
		}).queue(function (next) {
			console.log('Remove Begin background');
			$(this).removeClass('beginBackGround').addClass('prevBackGround');
			StartMovingBackGround();
			next();
		});
	}

}
//取得背景
function GetBackgroundPanel() {
	var newSinkPanel = $("<div class='panel-background center nextBackGround'><img src='images/infinity_bg.jpg' width='100%'/></div>");
	$(newSinkPanel).css({ 'height': infiniteBGHeight, 'top': -infiniteBGHeight + 3, 'left': 0 });
	return newSinkPanel;
}
// 取得有物品的透明地板
function GetSinkPanel() {
	var newSinkPanel = $("<div id='nextSink' class='panel-sink center nextSink'></div>").css({
		'height': bodyHeight
		, 'width': screenWidth
	});
	var ballNum = getRandomInt(defaultLightBallNumber, GameLevel);
	for (var i = 0; i < MaxLightBallNum; i++) {
		var nextTop = getRandomInt(0, bodyHeight - DropitemSize);
		var nextLeft = getRandomInt(0, screenWidth - DropitemSize);
		var newItem = CreateLightBall();
		$(newItem).appendTo($(newSinkPanel)).css({
			'top': nextTop
			, 'left': nextLeft
		});
	}
	// 攻擊 
	var attackNum = getRandomInt(0, GameLevel);
	for (var i = 1; i < (defaultAttactItemNum + attackNum) ; i++) {
		var nextTop = getRandomInt(0, bodyHeight - DropitemSize);
		var nextLeft = getRandomInt(0, screenWidth - DropitemSize);
		var newItem = CreateAttack();
		$(newItem).appendTo($(newSinkPanel)).css({
			'top': nextTop
			, 'left': nextLeft
		});
	}
	// 必中玩家
	var newItem = CreateAttack();
	$(newItem).appendTo($(newSinkPanel)).css({
		'top': getRandomInt(0, bodyHeight - DropitemSize)
		, 'left': (GameLevel >= (MaxGameLevel / 2) ? $("#snake").position().left : getRandomInt(0, screenWidth - DropitemSize))
	});
	return newSinkPanel;
}
// 吃到光球，增加分數
function AddScore() {
	eat.currentTime = 0;
	eat.play();
	score++;
	//console.log('Add Score(' + score + ')');
	$("#score").html(score);
	if (score % ItemOfincreateSnakeRequire == 0 && GameLevel < MaxGameLevel) {
		GameLevel++;
		SnakeLevel = 1 + Math.floor((GameLevel - 1) / 2);
		SetSnakeSize(SnakeLevel);
		SetFallingSky(GameLevel);
		showMsg('升級!');
	}
	$("#level").html(GameLevel);
}
// 移動蛇蛇
function MoveSnake(direction) {
	if (direction == 0) {
		movingStatus = false;
		console.log('Stop snake movment');
		$('#snake').clearQueue().stop();
	}
	else if (!movingStatus) {
		var postion = $('#snake').position();
		if (direction > 0) {
			// move right
			movingStatus = true;
			var distance = borderRight - postion.left - $('#snake').width();
			console.log('Moving snake from ' + postion.left + ' to ' + borderRight);
			$('#snake').animate({
				left: '+=' + distance
			}, {
				duration: snakeMovingSpeed
				, step: function (now, fx) {
					var n = parseInt(now);
					$(this).css("left", n);
				}
				, easing: 'linear'
			});
		}
		else if (direction < 0) {
			movingStatus = true;
			var distance = postion.left - borderLeft;
			console.log('Moving snake from ' + postion.left + ' to ' + borderLeft);
			$('#snake').animate({
				left: '-=' + distance
			}, {
				duration: snakeMovingSpeed
				, step: function (now, fx) {
					var n = parseInt(now);
					$(this).css("left", n);
				}
				, easing: 'linear'
			});
		}
	}
}
// 設定蛇蛇大小
function SetSnakeSize(level) {
	console.log('Snake Level Up to ' + level);
	if (FlagSnakeResize) {
		level = (level > MaxSnakeLevel ? MaxSnakeLevel : level);
		$('.snake img').prop('src', "images/snake_" + level + ".png").prop('width', DropitemSize * 0.8);
		$(".snake").height($(".snake img").height() * 0.95).width(DropitemSize * 0.72);
		$(".snake").css('top', (bodyHeight - $(".snake img").height() + snake_dive_height) + 'px');
		//				for (var i = $(".header-level img").length; i < level; i++) {
		//					$(".header-level").append($('<img src="images/level.png">'));
		//					$('.header-level img').css({ 'height': headerHeight*0.75 , 'width': headerHeight*0.75 , 'margin-top': 5 , 'margin-right': 10 });
		//				}
		DragSetup();
	}
}
function SetFallingSky(level) {
	var next_height =  -$(".fallingsky img").height() + DropitemSize * (level - 1);
	if (next_height >= 0) {next_height = 0;}
	$(".fallingsky").css('top', next_height + 'px');
}
// 設定物件可拖移
function DragSetup() {
	$("#snake").draggable({
		drag: function (event, ui) {
			ui.position.top = (borderBottom - $("#snake").height() + snake_dive_height) + 'px';
			//console.log($("#snake").height());
			if (ui.position.left < borderLeft) {
				ui.position.left = borderLeft + 'px';
			}
			else if (ui.position.left > (borderRight - $("#snake").width())) {
				ui.position.left = (borderRight - $("#snake").width()) + 'px';
			}
		}
	});
}
// 重設視窗大小
function onReSizePage() {
	screenWidth = $('.box').width();
	height = Math.max(window.screen.height, $(window).height());
	//DropitemSize = Math.floor((screenWidth * 0.9) / xCount);
	//DropitemSize = GetGameUnitPixel(($('.box').width() * 0.9), ($(window).height() * 0.95));
	DropitemSize = GetGameUnitPixel(($('.box').width()), ($(window).height()));
	screenWidth = DropitemSize * xCount;
	bodyHeight = DropitemSize * yCount;
	defaultSnakeWidth = DropitemSize * 0.75;
	defaultSnakeHeight = DropitemSize * 5;
	snake_dive_height = DropitemSize * 3;
	$('.box').width(screenWidth);
	//$('.panel-header').height(height * 0.05);
	infiniteBGHeight = $("#beginBackGround img").height();
	headerHeight = height * 0.05;
	borderTop = 0; // $('.panel-body').position().top;
	borderLeft = 0; // $('.panel-body').position().left + 20;
	borderRight = borderLeft + screenWidth;
	borderBottom = borderTop + bodyHeight;
	DropItemSpeed = Math.floor(bodyHeight / MovingGroundSinkUnit) * MovingGroundSinkRate;
	//$('.startWindow').width(screenWidth - DropitemSize);
	var btn_start_w = screenWidth / 2.1;
	//var btn_start_h = screenWidth / 2.5;
    $('.startGame').css({ 'width': $(".intro_page").width() });
	$('.startGame img').css({ 'width': btn_start_w });
	//$('.startGame').css('top', (bodyHeight*0.9 - $('.startGame img').height()) + 'px');
	$('#shareWindow_img').prop('src', result_bg[0]).width(screenWidth - DropitemSize);//.height(bodyHeight*0.75);
	$('.showMsg').css({ 'font-size': DropitemSize + 'px', 'top': (bodyHeight * 0.4) + 'px' });
	$('.header-score img').css({ 'height': headerHeight, 'width': headerHeight, 'margin-top': -10 });
	$('.header-level img').css({ 'height': headerHeight, 'width': headerHeight, 'margin-top': -10 });
	//$('.header-score').css({ 'left': '0px' });
	$('.panel-header').css('font-size', DropitemSize * 0.8 + 'px').show();
	$('.panel-body .shareWindow').height(bodyHeight);
	$('.panel-ground').height(bodyHeight);
}
function InitialShareWindow() {
	if ($('#shareWindow_img').height() == 0) {
		console.log('wait for shareWindow_img height');
		var doReset = setTimeout(InitialShareWindow, 200);
	} else {
		// 結果分享畫面設定
		$('.shareWindow-background').css('top', bodyHeight * 0.1)
		$(".shareWindow-content").css('top', (-$('#shareWindow_img').height() * 0.72 + $('.shareWindow-background').position().top) + 'px').height($('#shareWindow_img').height() * 0.72);
		var shareWindowWidth = screenWidth - DropitemSize;
		var shareWindowbtnAreaHeight = $(".shareWindow-content").height() * 0.60;
		var shareWindowTxtAreaHeight = $(".shareWindow-content").height() * 0.40;
		$("#result_gg").css({ 'font-size': (shareWindowTxtAreaHeight * 0.20) + 'px', 'line-height': (shareWindowTxtAreaHeight * 0.20 - 1) + 'px', 'color': '#733f0f' });
		$("#result_rank").css({ 'font-size': (shareWindowTxtAreaHeight * 0.10) + 'px', 'color': '#733f0f' });
		$("#result_comment").css({ 'font-size': (shareWindowTxtAreaHeight * 0.20) + 'px', 'color': '#ed5b21', 'width': shareWindowWidth * 0.6 });
		var rate_1 = $('.btn-restart img').width() / $('.btn-restart img').height();
		var rate_2 = $('.btn-share img').width() / $('.btn-share img').height();
		var rate_2_zoom_rate = 0.40
		$('.btn-restart img').css({ 'width': (shareWindowWidth * 0.50), 'height': (shareWindowWidth * 0.50) / rate_1 });
		$('.btn-invite img').css({ 'width': (shareWindowWidth * rate_2_zoom_rate), 'height': (shareWindowWidth * rate_2_zoom_rate) / rate_2 });
		$('.btn-share img').css({ 'width': (shareWindowWidth * rate_2_zoom_rate), 'height': (shareWindowWidth * rate_2_zoom_rate) / rate_2 });
		$('.btn-download img').css({ 'width': (shareWindowWidth * rate_2_zoom_rate), 'height': (shareWindowWidth * rate_2_zoom_rate) / rate_2 });
		$('.btn-rank img').css({ 'width': (shareWindowWidth * rate_2_zoom_rate), 'height': (shareWindowWidth * rate_2_zoom_rate) / rate_2 });
		$('.btn-fblogin img').css({ 'width': (shareWindowWidth * rate_2_zoom_rate), 'height': (shareWindowWidth * rate_2_zoom_rate) / rate_2 });

	}
}
// 計算遊戲區域大小
function GetGameUnitPixel(_width, _height) {
	var xFirst = Math.floor(_width / xCount);
	if ((xFirst * yCount) <= _height) {
		return xFirst;
	} else {
		var yFirst = Math.floor(_height / yCount);
		return yFirst;
	}
}
//播放音效
function PlayEffectSound(sound) {
	if (FlagAllowEffectSound) {
		sound.pause();
		sound.currentTime = 0;
		sound.play();
	}
}
// 按下按鍵
function userKeyIn(key) {
	$('.key-' + key).addClass('push');
	if (key == 'left') MoveSnake(-1);
	if (key == 'right') MoveSnake(1);
}
// 放開按鍵
function userKeyUp(key) {
	$('.key-' + key).removeClass('push');
	MoveSnake(0);
}
// 遊戲結束
function GameOver() {
	bgm.pause();
	bgm.currentTime = 0;
	die.currentTime = 0;
	die.play();
	$('.snake img').prop('src', "images/snake_" + (SnakeLevel > MaxSnakeLevel ? MaxSnakeLevel : SnakeLevel) + "_die.png");
	var myObject = new Object();
	myObject.score = score;
	myObject.gametime = aliveTime;
	myObject.id = tmp_session_id;
	myObject.name = '';
	console.log(myObject);
	showMsg('gameover');
	$.ajax({
		method: "POST"
		, processData: false
		, contentType: "application/json; charset=utf-8"
		, url: "api/Game"
		, data: JSON.stringify(myObject)
		, dataType: "json"
		, success: function (data) {
			console.log(data);
			document.location.href = 'hungrysnake.html?guid=' + data.data;
		}
		, error: function (e) {
			console.log(e);
		}
	});
}
// 更新成績給特定fbuid
function UpdateScore(share) {
	var id = getCookie('fbuid');
	var fbname = getCookie('fbname');
	var guid = GetQueryStringParams('guid');
	if (id != '' && fbname != '' && guid != '' && guid != undefined) {
		var myObject = new Object();
		myObject.id = id;
		myObject.name = fbname;
		var _url = "api/Game/" + GetQueryStringParams('guid') + '/' + getCookie('tmp_session_id');
		$.ajax({
			method: "PUT"
			, processData: false
			, contentType: "application/json; charset=utf-8"
			, url: _url
			, data: JSON.stringify(myObject)
			, dataType: "json"
			, success: function (data) {
				if (share) {
					fb_share();
				}
				console.log(data);
			}
			, error: function (e) {
				console.log(e);
			}
		});
	}

}
// 直接取得結果資料
function ShowResult(guid, tmp_session_id) {
	if ((guid != "" && guid != undefined) && tmp_session_id != "") {
		$.getJSON("api/Game", {
			'id': guid
				, 'tmp_session_id': tmp_session_id
		}, function (data) {
			if (data.data.ranks.length == 1) {
				SetResultPanel(data);
			}
		});
	}
}
// 顯示結果
function SetResultPanel(data) {
	var Max_Snake_Record = getCookie('snake_score');
	$("#result_gg").html(data.data.ranks[0].score + " 公尺");
	$("#score").html(data.data.ranks[0].score);
	$("#aliveTime").html(data.data.ranks[0].gametime);
	$("#result_rank").html("排行 " + data.rank + " 名");
	$("#result_comment").html(GetComment(data.data.ranks[0].score));
	if (Max_Snake_Record == "" || Max_Snake_Record < data.data.ranks[0].score) {
		$('#shareWindow_img').prop('src', result_bg[1]);
		setCookie('snake_score', data.data.ranks[0].score, 1);
	} else {
		$('#shareWindow_img').prop('src', result_bg[0]);
	}
	$("#level").html(1 + Math.min(Math.floor(data.data.ranks[0].score / ItemOfincreateSnakeRequire), MaxGameLevel));
	InitialShareWindow();
	$(window).scroll(function () {
		if ($(window).scrollTop() + $(window).height() == $(document).height()) {
			console.log('scroll touch done');
			if (more_global) GetRankList('global');
		}
	});
	GetRankList('global');
	$('.shareWindow').show();
	$(".introWindows").hide();
}
// 產生資料行
function CreateRowData(target, data) {
	data.forEach(function (item) {
		var rowItem = '<div class="row"><div class="col-sm-1 col-xs-1"><img src="http://graph.facebook.com/' + item.id + '/picture" height="' + screenWidth / 17 + '"></div>'
		+ '<div class="col-sm-3 col-xs-4">' + item.name + '</div>'
		+ '<div class="col-sm-3 col-xs-2">' + item.score + ' 公尺</div>';
		switch (item.beat) {
			case 0:
				rowItem += '<div class="col-sm-5 col-xs-4">被所有人擊敗了</div></div>';
				break;
			case -1:
				rowItem += '<div class="col-sm-5 col-xs-4">MVP:所向無敵</div></div>';
				break;
			default:
				rowItem += '<div class="col-sm-5 col-xs-4">擊敗' + item.beat + '位玩家</div></div>';
				break;
		}
		console.log(rowItem);
		$(target).append(rowItem);
	});
}
GetRankList = function (type, id) {
	var response = [];
	if (type == "global") {
		if (more_global) {
			more_global = false;
			$.getJSON("api/Rank", {
				'offset': offset_global
				, 'pagesize': pagesize
			}, function (data) {
				more_global = (data.ranks.length == pagesize);
				CreateRowData($("#global"), data.ranks);
			});
		}
	}
}
// 結果評語
function GetComment(Myscore) {

	if (Myscore >= 0 && Myscore < 50) return "頭髮都比你粗長!";
	if (Myscore >= 50 && Myscore < 100) return "細小君94 ni";
	if (Myscore >= 100 && Myscore < 150) return "我只承認你是毛毛蟲";
	if (Myscore >= 150 && Myscore < 200) return "勉強看出是條蛇";
	if (Myscore >= 200 && Myscore < 250) return "可以跟姚明對尬了!";
	if (Myscore >= 250 && Myscore < 300) return "長這麼快會骨質疏鬆歐";
	if (Myscore >= 300 && Myscore < 350) return "航空母艦蛇4ni";
	if (Myscore >= 350 && Myscore < 400) return "你真的沒有打生長激素嗎?";
	if (Myscore >= 400 && Myscore < 450) return "粗長君94 ni";
	if (Myscore >= 450 && Myscore < 500) return "你再長下去101要哭了";
	if (Myscore >= 500 && Myscore < 600) return "101都沒你屌!";
	if (Myscore >= 600 && Myscore < 700) return "拜蛇王能保佑我長高嗎?";
	if (Myscore >= 700 && Myscore < 800) return "大蛇王94 ni";
	if (Myscore >= 800 && Myscore < 900) return "杜拜塔開始緊張了";
	if (Myscore >= 900 && Myscore < 1000) return "杜拜塔都甘拜下風啦!";
	if (Myscore >= 1000 && Myscore < 1100) return "一公里長的蛇有看過嗎?";
	if (Myscore >= 1100 && Myscore < 1200) return "蛇神請受我一拜!";
	if (Myscore >= 1200 && Myscore < 1300) return "大蛇神94 ni";
	if (Myscore >= 1300 && Myscore < 1400) return "龍都比你小隻";
	if (Myscore >= 1400 && Myscore < 1500) return "神已經不足以形容了";
	if (Myscore >= 1500) return "邁入超蛇神的境界";
}
function fb_login() {
	FB.login(function (response) {
		changeStatus(response);
		if (response.authResponse) {
			FB.api('/me', function (response) {
				console.log('Successful login for: ' + response.name);
				setCookie("fbuid", response.id, (1 / 24));
				setCookie("fbname", response.name, (1 / 24));
				UpdateScore(true);
			});
		} else {
			alert('您必需先登入Facebook後才可分享!');
		}
	}, {
		scope: 'user_photos,user_friends,email'
	});
}
function fb_share() {
	var fbuid = getCookie('fbuid');
	var guid = GetQueryStringParams('guid');
	var fbname = getCookie('fbname');

	if (fbuid != '' && fbname != '' && guid != '' && guid != undefined) {
		$.getJSON("api/Share/" + guid + "/" + fbuid
		, function (data) {
			if (data.data != '') {
				var share_url = "https://www.facebook.com/dialog/feed?app_id=1630743700553639"
				+ "&display=page"
				+ "&name=" + "貪吃的魯蛇－魯蛇逛夜市"
				+ "&link=" + GetLocationUrl() + "index.html?guid=" + guid
				+ "&picture=" + GetLocationUrl() + "share/" + guid + ".jpg"
				+ "&caption=" + "魯蛇" + fbname + "在逛夜市時吃出 " + data.data.ranks[0].score + " 公尺的好身材，獲得『" + GetComment(data.data.ranks[0].score) + "』的稱號，想知道你有多長？快來與好友比長短吧！"
				+ "&redirect_uri=" + GetLocationUrl() + "hungrysnake.html?guid=" + guid;
				document.location.href = share_url;
			}
		});
	} else {
		FB.getLoginStatus(function (response) {
			changeStatus(response)
		});
	}
}
function changeStatus(response) {
	if (response.status === 'connected') {
		var fbuid = getCookie('fbuid');
		var fbname = getCookie('fbname')
		if (fbuid == '' || fbname == '') {
			getMe()
		}
		$(".btn-fblogin").hide();
		$(".btn-share").show();
	} else {
		$(".btn-fblogin").show();
		$(".btn-share").hide();
	}
}

function getMe() {
	FB.api('/me', function (response) {
		console.log('Successful login for: ' + response.name);
		setCookie("fbuid", response.id, (1 / 24));
		setCookie("fbname", response.name, (1 / 24));
	});
}
function GetLocationUrl() {
	var ret = window.location.protocol + "//" + window.location.host + "/";
	return ret;
}
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return decodeURIComponent(c.substring(name.length, c.length));
		}
	}
	return "";
}
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
}
function GetQueryStringParams(sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}