// 專案:正宗勁舞團-手速大挑戰
var images = new Array(); //預載圖片
var screenWidth = 0;
var arrowSize = 0; //箭頭邊長
var yCount = 0; //螢幕高度可容納多少箭頭
var arrowCount = 0; //目前產生了多少箭頭
var activeArrow = 1; //目前待按的箭頭
var speed = 10000; //目前每一拍延遲多少毫秒
var redArrow = 0; //紅色箭頭出現機率(%) 最高30%
var lv = 1; //目前等級
var score = 0; //目前得分
var status = 0; //目前狀態 0:遊戲尚未開始 1:等待按鍵中 2:目前條件已達成 3:已失敗 4:破關
var startGameCount = 3; //開始遊戲倒數
var music = new Audio('/assets/' + song + '.mp3');
var start_music = new Audio('/assets/start.mp3');
var dot = new Audio('/assets/dot.mp3');
var waitQ; //下一次跳格的timeout物件id
var waitL; //下一次升級的timeout物件id
var playId; //server賦予這次play的id

var startTime = 0;
var endTime = 0;

$(function () {
    //預載圖片
    preload(
		"/images/arrow_blue_up.png",
		"/images/arrow_blue_left.png",
		"/images/arrow_blue_right.png",
		"/images/arrow_blue_down.png",
		"/images/arrow_red_up.png",
		"/images/arrow_red_left.png",
		"/images/arrow_red_right.png",
		"/images/arrow_red_down.png",
		"/images/arrow_green_up.png",
		"/images/arrow_green_left.png",
		"/images/arrow_green_right.png",
		"/images/arrow_green_down.png",
		"/images/arrow_purple_up.png",
		"/images/arrow_purple_left.png",
		"/images/arrow_purple_right.png",
		"/images/arrow_purple_down.png",
		"/images/arrow_gray_up.png",
		"/images/arrow_gray_left.png",
		"/images/arrow_gray_right.png",
		"/images/arrow_gray_down.png",
		"/images/1.png",
		"/images/2.png",
		"/images/3.png",
		"/images/lvup.png"
	);

    //螢幕自適應大小
    $(window).on('resize', function () {
        onReSizePage();
    });

    //綁定鍵盤事件
    $(document).on('keydown', function (e) {
        console.log(e.key);
        switch (e.key) {
            case 'ArrowUp':
            case 'Up':
                userKeyIn('up');
                break;
            case 'ArrowDown':
            case 'Down':
                userKeyIn('down');
                break;
            case 'ArrowLeft':
            case 'Left':
                userKeyIn('left');
                break;
            case 'ArrowRight':
            case 'Right':
                userKeyIn('right');
        }
    });

    //綁定輸入按鈕功能
    $('.gamePad').on('touchstart', function () {
        arrow = $(this).attr('arrow');
        userKeyIn(arrow);
    });

    //播完歌就贏了
    music.onended = function () {
        gameWin();
    };

    //音效結束開始倒數
    start_music.onended = function () {
        startGame();
    };

    $('#gameStart').on('click', function () {
        initPlayGround();
        music.play();
        startTime = getT();
        start_music.play();
        clearArrow();
        $('.startWindow').hide();
    });

    onReSizePage();
});

//預載圖片
function preload() {
    for (i = 0; i < preload.arguments.length; i++) {
        images[i] = new Image()
        images[i].src = preload.arguments[i]
    }
}

//適應螢幕大小
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
    bodyHeight = height - headerHeight - footerHeight - 22;

    //計算高幾個箭頭
    yCount = Math.floor((bodyHeight) / (arrowSize + 20));
    if (yCount < 4) yCount = 4;

    //縮小body到符合按鈕的大小
    //	bodyHeight = bodyHeight - bodyHeight % (arrowSize + 20);
    bodyHeight = (arrowSize + 20) * yCount;

    $('.panel-body').height(bodyHeight);
    $('.redLine').css('bottom', arrowSize + 20 + 'px');
    $('.redDot').css('bottom', arrowSize + 10 + 'px');
}

//初始化遊戲區
function initPlayGround() {
    arrowCount = 0;
    activeArrow = 1;
    speed = 10000;
    redArrow = 0;
    lv = 1;
    score = 0;
    status = 0;
    startGameCount = 3;
    $('.arrow').remove();
    showData();
    for (i = 1 ; i <= yCount * 4 ; i++) {
        createArrow();
    }
}

//遊戲開始
function startGame() {
    if (startGameCount > 0) {
        showMsg(startGameCount);
        startGameCount--;
        setTimeout(function () { startGame() }, 1000);
        return;
    }
    status = 1;
    data = { uid: uid, song: song };
    $.get('/api/creatPlay', data, function (data) {
        if (data.success) {
            playId = data.data;
        } else {
            gameFail(data.msg);
        }
    }, 'json');
    nextTone();
    waitL = setTimeout(function () { levelUp(); }, 20000); //15秒後升級
}

//跳下一個節奏
function nextTone() {
    if (status != 1 && status != 2) {
        return;
    }

    //重製計時條
    $('.redDot').stop().css('left', 0).animate({ left: screenWidth - 10 }, speed, 'swing');
    fd = activeArrow + 3;
    waitQ = setTimeout('checkFail(' + fd + ');', speed);
}

//升級
function levelUp() {
    if (status == 3) return;
    //	status = 0;
    lv++;
    if (speed > 2000) speed -= 1000;
    if (redArrow < 30 && lv > 2) redArrow += 10;
    //	$('.redDot').stop().css('left', 0);
    showMsg('升級!');
    showData();
    //	clearTimeout(waitQ);
    //	startGameCount = 3;
    //	start_music.play();

    data = { pid: playId, score: score, lv: lv };
    $.get('/api/checkPlay', data, function (data) {
        if (!data.success) {
            gameFail(data.msg);
        }
    }, 'json');

    waitL = setTimeout(function () { levelUp(); }, 20000); //15秒後升級
}

function checkFail(n) {
    if (status == 1) {
        if (activeArrow <= n) {
            gameFail('漏拍!');
        }
    }
}

//上面新增四個箭頭並且消除最下面一行 
function clearArrow() {
    //亮起箭頭
    for (i = activeArrow; i <= activeArrow + 3; i++) {
        $('#arrow-' + i).addClass('active');
    }
    $('.clear').animate({ opacity: 0 }, 200, 'swing', function () {
        createArrow();
        $(this).remove();
        $('.arrow').css('bottom', arrowSize);
        $('.arrow').animate({ bottom: 0 }, 200);
    });
}

//用戶按鍵
function userKeyIn(key) {
    $('.key-' + key).addClass('push')
    setTimeout("$('.key-" + key + "').removeClass('push');", 200);

    if (status != 1 && status != 2) {
        return;
    }

    if (status == 1) {
        dot.pause();
        dot.currentTime = 0;
        dot.play();

        if (key == $('#arrow-' + activeArrow).attr('arrow')) {
            $('#arrow-' + activeArrow).removeClass('active').addClass('clear bounceIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass('bounceIn animated webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
            });
            activeArrow++;
            score += 1;
            showData();
            if ($('.active').length == 0) {
                clearArrow();
                nextTone();
            }
        } else {
            gameFail('按錯!');
        }
    }//else{
    //	gameFail('搶拍!');
    //}
}

//刷新分數顯示
function showData() {
    $('#lv').html(lv);
    $('#score').html(score);
}

function gameFail(str) {
    clearTimeout(waitL);
    $('#arrow-' + activeArrow).removeClass('active').addClass('wrong');
    endTime = getT();
    status = 3;
    $('.redDot').stop();
    music.pause();
    music.currentTime = 0;

    data = { pid: playId, score: score, lv: lv, status: 3 };
    $.get('/api/endPlay', data, function (data) {
        //if(data.success){
        location.href = '/dance/share';
        //}else{
        //	alert(data.msg);
        //}
    }, 'json');

    //wait = Math.floor((endTime - startTime)/100)/10;
    //$('.startWindow').show();
    //$('#txt').html('<h4>遊戲失敗!' + str + ' 堅持了'+ wait +'秒</h4>');
}

function gameWin() {
    if (status == 1 || status == 2) {
        status = 4;
        data = { pid: playId, score: score, lv: lv, status: 4 };
        $.get('/api/endPlay', data, function (data) {
            location.href = '/dance/share';
        }, 'json');
        //$('.startWindow').show();
        //$('#txt').html('<h4>遊戲破台!' + str + '總共堅持了'+endTime - startTime+'秒</h4>');
    }
}


//產生隨機箭頭
function createArrow() {
    arrowCount++;
    //隨機產生箭頭方向
    switch (Math.floor(Math.random() * 4)) {
        case 0:
            arrow = 'up';
            break;
        case 1:
            arrow = 'down';
            break;
        case 2:
            arrow = 'left';
            break;
        case 3:
            arrow = 'right';
    }
    na = arrow;

    objArrow = $('<div id="arrow-' + arrowCount + '" class="arrow"></div>');
    objArrow.css('width', arrowSize).css('height', arrowSize);
    objArrow.css('bottom', arrowSize + 20);
    objArrow.animate({ bottom: 0 }, 500);
    objArrow.addClass('arrow-' + arrow);

    //紅色箭頭處理
    if (Math.floor(Math.random() * 100) < redArrow) {
        objArrow.addClass('red');
        switch (arrow) {
            case 'up':
                na = 'down';
                break;
            case 'down':
                na = 'up';
                break;
            case 'left':
                na = 'right';
                break;
            case 'right':
                na = 'left';
                break;
        }
    }

    objArrow.attr('arrow', na);
    $('.panel-body').prepend(objArrow);
}

function showMsg(msg) {
    if (msg > 0 && msg < 4) {
        msg = '<img src="/images/' + msg + '.png" style="width:90%;">';
    }

    if (msg == '升級!') {
        msg = '<img src="/images/lvup.png" style="width:90%;">';
    }

    $('#showMsg').html(msg).show().addClass('bounceIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this).removeClass('bounceIn animated webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend').hide();
    });
}

function getT() {
    return new Date().getTime();
}