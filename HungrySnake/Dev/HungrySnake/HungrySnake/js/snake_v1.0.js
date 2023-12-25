// v1.0 物品由上方掉落
var images = new Array(); //預載圖片
var attack_item = ['images/attack_item_1.png', 'images/attack_item_2.png'];
var light_ball = ['images/food_1.png', 'images/food_2.png', 'images/food_3.png', 'images/food_4.png', 'images/food_5.png'];
var arrowSize = 0; //箭頭邊長
var movingStatus = false; // 是否移動中
var FlagSnakeResize = true; // 是否允許魯蛇改變大小
var FlagAllowEffectSound = true; // 是否播放音效
var FlagShowArrowKeyPad = false; // 是否顯示方向按鍵
var screenWidth = 0;
var yCount = 0; // 螢幕高度可容納多少箭頭
var arrowCount = 0; //目前產生了多少箭頭
var startGameCount = 3; //開始遊戲倒數
var borderLeft = 0;
var borderTop = 0;
var borderRight = 0;
var borderBottom = 0; // 遊戲框位置-下
var snake_dive_height = 60; // 蛇的下沈深度位移
var aliveTime = 0; // 目前遊戲時間
var gameTimer; // 遊戲主計時器
var attactTimer; // 攻擊計時器
var DropItemSpeed = 5000; // 光球掉落速度。
var DropItemMinSpeed = 500; // 光球最快掉落速度。
var DropItemDepth = 100; // 光球掉落加深高度。
var DropItemSpeedUpPerLevel = 500; // 光球掉落速度每級加快時間。
var snakeMovingSpeed = 1000; // 魯蛇透過左右按鍵或方向鍵移動的速度
var gameLevel = 1; // 遊戲等級
var snakeLevel = 1; // 魯蛇尺吋等級
var ItemOfincreateSnakeRequire = 10; // 魯蛇長大所需食物數量
var LevelUpSecond = 10; // 升級速度，直接影響遊戲難度
var MaxAttackLevel = 99; // 最高攻擊等級
var MaxSnakeLevel = 5; // 最高魯蛇等級
var MaxLightBallNum = 5; // 最高光球(小吃)數量上限
var HeightOfSnakePerLevel = (snake_dive_height - 10) / MaxSnakeLevel; // 每升一級上升的高度
var WidthOfSnakePerLevel = 0; // 每升一級上升的高度
var score = 0; //目前分數
var defaultSnakeHeight = 160; // 初級魯蛇高度
var defaultSnakeWidth = 30; // 初級魯蛇寬度
var defaultAttactTime = 2000; // 預設攻擊延遲時間(物件掉落)
var defaultAttactItemNum = 2; // 預設攻擊個數
var status = 0; // 目前狀態：0=準備；1=開始；2=遊戲結束
var gameMode = 0; // 攻擊模式(光球掉落)
var drop_item_width = 30;
var die = new Audio('sound/die.mp3');
var eat = new Audio('sound/eat.mp3');
var bgm = new Audio('sound/bgm.mp3');
var start = new Audio('sound/start.mp3');
var tmp_session_id = '';
$(function () {
	//$(window).scroll(checkOverlay).trigger('scroll');
	//checkOverlay();
	//CreateLightBall();
	//TestStep();
	preload("images/key_left.png", "images/key_right.png", "images/key_left_d.png", "images/key_right_d.png", "images/1.png", "images/2.png", "images/3.png", "images/lvup.png", "images/food_1.png", "images/food_2.png", "images/food_3.png", "images/food_4.png", "images/food_5.png", "images/snake_1.png", "images/snake_2.png", "images/snake_3.png", "images/snake_4.png", "images/snake_5.png", "images/snake_1_die.png", "images/snake_2_die.png", "images/snake_3_die.png", "images/snake_4_die.png", "images/snake_5_die.png", "images/attack_item_1.png", "images/attack_item_2.png", "images/item-disappear.png");
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
	$("#gameStart").click(function () {
		//PlayEffectSound(start);
		//PlayEffectSound(bgm);
		eat.play();
		die.play();
		bgm.play();
		start.play();
		$('.startWindow').hide();
		CountDown();
	});
	//綁定輸入按鈕功能
	$('.gamePad').on('touchstart', function () {
		arrow = $(this).attr('arrow');
		userKeyIn(arrow);
	}).on('touchend', function () {
		arrow = $(this).attr('arrow');
		userKeyUp(arrow);
	});
	//螢幕自適應大小
	$(window).on('resize', function () {
		onReSizePage();
		SetSnakeSize(snakeLevel);
		DragSetup();
	});
	// 讓 body 內的物件無法被選取
	document.body.onselectstart = function () {
		return false;
	}
	onReSizePage();
	InitGame();
});

function InitGame() {
	startGameCount = 3;
	gameLevel = 1;
	snakeLevel = 1;
	status = 0;
	score = 0;
	DropItemSpeed = 5000;
	$(".snake").css('left', borderLeft + (screenWidth / 2));
	$(".snake img").prop('width', defaultSnakeWidth).prop('height', defaultSnakeHeight);
	$(".snake").css({
		'height': defaultSnakeHeight
		, 'width': defaultSnakeWidth
	}).show();
	$("#level").html(gameLevel);
	$("#score").html(score);
	$("#gametime").html(0);
	//die = new Audio('sound/die.wav');
	//eat = new Audio('sound/eat.wav');
	SetSnakeSize(snakeLevel);
	DragSetup();
	$(".drop-item").remove();
	if (FlagShowArrowKeyPad) {
		$(".panel-footer").show();
	}
	else {
		$(".panel-footer").hide()
	};
	$('.startWindow').show();
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
	var p1 = o1.offset()
		, p2 = o2.offset();
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
// 判斷蛇有沒有被光球碰到
function checkOverlay(item, item_type) {
	var snake = $('#snake');
	if ($(item).hasClass('drop-item') && status != 2) {
		if (($(item).position().top >= $("#snake").position().top - $(item).height() - 20) && $(item).position().top < borderBottom) {
			if (isOver(item, snake)) {
				if (item_type == 'attack') {
					console.log(new Date + '--碰到光球了');
					status = 2;
					$(item).clearQueue().stop();
					clearInterval(gameTimer);
					clearTimeout(attactTimer);
					GameOver();
				}
				else {
					AddScore();
					CreateEatEffect($(item).position().top, $(item).position().left);
					$(item).stop().removeClass('drop-item').addClass('drop-item-remove').clearQueue().remove();
				}
			}
		}
	}
	//lightBall.find('div').html(rst);
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
	status = 1;
	$.get('GetSession.aspx', function (data) {
		tmp_session_id = data;
		setCookie('tmp_session_id', data, (1 / 24));
		gameTimer = setInterval(countAlifeTime, 1000);
		SetAttactMode();
	});
}
// 顯示訊息
function showMsg(msg) {
	if (msg > 0 && msg < 4) {
		msg = '<img src="images/' + msg + '.png" style="width:90%;">';
	}
	if (msg == '升級!') {
		msg = '<img src="images/lvup.png" style="width:90%;">';
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
	if (status == 1) {
		console.log("Drop Light ball,Speed:" + DropItemSpeed);
		var showUpPosition_Left = getRandomInt(borderLeft, borderRight - drop_item_width);
		var item_idx = getRandomInt(1, light_ball.length);
		var lightBall = $('<div id="lightBall" class="drop-item"><img src="' + light_ball[item_idx - 1] + '" width="' + drop_item_width + '" height="' + drop_item_width + '" /></div>').css({
			'left': showUpPosition_Left
			, 'top': (-1 * $(lightBall).height()) //borderTop + 'px'
		});
		$(lightBall).appendTo($('.panel-body'));
		//console.log('set item drop from ' + $(lightBall).position().top + ' to ' + (borderBottom + $(lightBall).height()) + 'px');
		$(lightBall).animate({
			top: '+=' + (borderBottom + $(lightBall).height() + DropItemDepth) + 'px'
		}, {
			duration: DropItemSpeed
			, step: function (now, fx) {
				var n = parseInt(now);
				$(this).css("top", n);
				//console.log('now top:' + n);
				if ((n >= $("#snake").position().top - $(this).height() - 20) && n < borderBottom) {
					//console.log('check');
					checkOverlay($(this), 'lightball');
				}
			}
		}).queue(function (next) {
			$(this).remove();
			next();
		});
	}
}
// 產生攻擊掉落物
function CreateAttack() {
	if (status == 1) {
		console.log("Drop attack item, Speed:" + DropItemSpeed);
		var showUpPosition_Left = getRandomInt(borderLeft, borderRight - drop_item_width);
		var item_idx = getRandomInt(1, attack_item.length);
		var drop_item = $('<div id="attack" class="drop-item"><img src="' + attack_item[item_idx - 1] + '" width="' + drop_item_width + '" height="' + drop_item_width + '" /></div>').css({
			'left': showUpPosition_Left
			, 'top': (-1 * $(lightBall).height()) //borderTop + 'px'
		});
		//$(drop_item).appendTo($('.panel-body'));
		$(drop_item).appendTo($('.panel-body'));
		$(drop_item).animate({
			top: '+=' + (borderBottom + $(lightBall).height() + DropItemDepth) + 'px'
		}, {
			duration: DropItemSpeed
			, step: function (now, fx) {
				var n = parseInt(now);
				$(this).css("top", n);
				if ((n >= $("#snake").position().top - $(this).height() - 20) && n < borderBottom) {
					checkOverlay($(this), 'attack');
				}
			}
		}).queue(function (next) {
			$(this).remove();
			next();
		});
	}
}

function CreateEatEffect(top, left) {
	var item = $('<div id="lightBall" class="drop-item"><img src="images/item-disappear.png" width="' + drop_item_width + '" height="' + drop_item_width + '" /></div>').css({
		'left': left
		, 'top': top //borderTop + 'px'
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
		console.log('Level Up:' + gameLevel + ', Attack Item:' + (defaultAttactItemNum + Math.floor(gameLevel / 2)));
		DropItemSpeed = ((DropItemSpeed - DropItemSpeedUpPerLevel) >= DropItemMinSpeed ? (DropItemSpeed - DropItemSpeedUpPerLevel) : DropItemMinSpeed);
		console.log('Drop item Speed Up to:' + DropItemSpeed);
		if ((gameLevel + 1) <= MaxAttackLevel) {
			console.log('Game Level Up')
			gameLevel = gameLevel + 1;
			$("#level").html(gameLevel);
		}
		else {
			$("#level").html("MAX Level");
		}
	}
	$("#gametime").html(aliveTime);
	$("#level").html(gameLevel);
}
// 設定攻擊模式
function SetAttactMode() {
	switch (gameMode) {
	case 1:
		break;
	default:
		// 光球
		var ballNum = getRandomInt(1, MaxLightBallNum);
		var nextAttactTime = defaultAttactTime - (gameLevel * 10);
		for (var i = 0; i < ballNum; i++) {
			var delayAttackTime = getRandomInt(0, nextAttactTime);
			var startAttact = setTimeout(CreateLightBall, delayAttackTime);
		}
		// 攻擊 
		var attackNum = getRandomInt(0, Math.floor(gameLevel / 2));
		nextAttactTime = defaultAttactTime - (gameLevel * 10);
		for (var i = 0; i < (defaultAttactItemNum + attackNum); i++) {
			var delayAttackTime = getRandomInt(0, nextAttactTime);
			var startAttact = setTimeout(CreateAttack, delayAttackTime);
		}
		attactTimer = setTimeout(SetAttactMode, nextAttactTime);
		break;
	}
}
// 吃到光球，增加分數
function AddScore() {
	//PlayEffectSound(eat);
	eat.currentTime = 0;
	eat.play();
	score++;
	console.log('Add Score(' + score + ')');
	$("#score").html(score);
	if (score % ItemOfincreateSnakeRequire == 0 && snakeLevel < MaxSnakeLevel) {
		snakeLevel++;
		SetSnakeSize(snakeLevel);
		showMsg('升級!');
	}
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
			});
		}
	}
}
// 設定蛇蛇大小
function SetSnakeSize(level) {
	if (FlagSnakeResize) {
		level = (level > MaxSnakeLevel ? MaxSnakeLevel : level);
		var nextHeight = defaultSnakeHeight + ((level - 1) * HeightOfSnakePerLevel);
		var nextWidth = defaultSnakeWidth + ((level - 1) * WidthOfSnakePerLevel)
		$('.snake img').prop('src', "images/snake_" + level + ".png").prop('width', nextWidth).prop('height', nextHeight);
		$(".snake").css({
			'height': $('.snake img').height()
			, 'width': $('.snake img').width()
		}).css({
			'top': (borderBottom - $("#snake").height() - ((level - 1) * HeightOfSnakePerLevel) + snake_dive_height) + 'px'
		});
		//console.log(borderBottom + "," + (borderBottom - $("#snake").height() - ((level - 1) * HeightOfSnakePerLevel) + snake_dive_height));
		DragSetup();
	}
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
	$('.startWindow').width(screenWidth - 44);
	arrowSize = Math.floor(screenWidth / 4) - 20;
	$('.showMsg').css('font-size', arrowSize * 2 + 'px');
	$('.panel-footer').height(arrowSize + 20);
	$('.arrow').css('width', arrowSize).css('height', arrowSize);
	$('.gamePad').css('width', arrowSize + 10).css('height', arrowSize + 10);
	height = $(window).height();
	headerHeight = $('.panel-heading').height();
	footerHeight = $('.panel-footer').height();
	if (FlagShowArrowKeyPad) {
		bodyHeight = height - headerHeight - footerHeight;
	}
	else {
		bodyHeight = height - headerHeight - 22;
	}
	$('.panel-body').height(bodyHeight);
	borderTop = 0; // $('.panel-body').position().top;
	borderLeft = 20; // $('.panel-body').position().left + 20;
	borderRight = borderLeft + screenWidth - 44;
	borderBottom = borderTop + bodyHeight;
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
	$('.snake img').prop('src', "images/snake_" + (snakeLevel > MaxSnakeLevel ? MaxSnakeLevel : snakeLevel) + "_die.png");
	var myObject = new Object();
	myObject.score = score;
	myObject.gametime = aliveTime;
	myObject.id = tmp_session_id;
	myObject.name = '';
	console.log(myObject);
	$.ajax({
		method: "POST"
		, processData: false
		, contentType: "application/json; charset=utf-8"
		, url: "api/Game"
		, data: JSON.stringify(myObject)
		, dataType: "json"
		, success: function (data) {
			console.log(data);
			if (data.flag == 'OK') {
				var msg = '你吃了 ' + score + '個小吃，持久度 ' + aliveTime + ' 秒 \r\n';
				msg += '【評語】：' + GetComment(score);
				alert(msg);
				console.log('share.html?guid=' + data.data);
				document.location.href = 'share.html?guid=' + data.data;
			}
		}
		, error: function (e) {
			console.log(e);
		}
	});
}
// 結果評語
function GetComment(Myscore) {
	var scoreLevel = 0;
	scoreLevel = Math.floor(Myscore / 10);
	if (scoreLevel == 0) {
		return "夜市是很危險的，你還是回家當魯蛇吧。";
	}
	else if (scoreLevel > 0 && scoreLevel <= 3) {
		return "區區魯蛇也敢這麼囂張，你還未夠班!!";
	}
	else if (scoreLevel > 3 && scoreLevel <= 6) {
		return "當魯蛇還不夠？想當個肥魯蛇嗎!!";
	}
	else if (scoreLevel > 6 && scoreLevel <= 9) {
		return "天啊!!我開始覺得你有點強惹";
	}
	else if (scoreLevel > 9 && scoreLevel <= 12) {
		return "娘子~快跟我出來看上帝";
	}
	else if (scoreLevel > 12) {
		return "你已經成為溫拿了!!";
	}
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
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}