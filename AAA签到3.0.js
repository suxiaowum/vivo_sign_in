/**
 * @description: AAA签到3.0
 * @author: nvme
 * @date: 2023-08-10
 */

const CONFIG = {
    // App 包名
    PACKAGES: {
        BLACK_BOX: 'com.max.xiaoheihe',
        CF_SNS: 'com.tencent.qt.sns',
        VIVO_SPACE: 'com.vivo.space',
        VIVO_CLUB: 'com.vivo.club',
        POWER: 'com.sgcc.wsgw.cn',
    },

    // sleep时间
    DELAY: {
        _ONE: 1000,
        _TWO: 2000,
        _THREE: 3000,
        _FOUR: 4000,
    },

    // 应用列表
    APP_LIST: [
        '应用商店', '游戏中心', '浏览器', 'vivo视频',
        '钱包', '主题', '音乐', '小游戏', '快应用', '智慧生活',
    ],

    // 砸金蛋 - 轮播图描述
    CAROUSEL_DESC: '第1张轮播图片，可跳转',

    // 社区 - 阅读文章数
    COMMUNITY_ARTICLE_COUNT: 5,

    // 评论文本
    COMMENT_TEXT: '签到',

    CART: {
        CART_ID: 'top_title_shop_cart',
        CART_NO_TEXT: '暂无商品',
        TABBER_DESC: '选购',
    },
    READ: {
        LIST_ID: 'rv'
    },

    TABBER: {
        CART_DESC: '购物车',
        READ_DESC: '社区',
        VIP_DESC: '会员',
        MY_DESC: '我的',
    },
    MY: {
        INTEGRAL_ID: 'll_jifen',
        INTEGRAL_SHOP_TEXT: '积分商城',
        GET_INTEGRAL_TEXT: '赚积分',
        EXPAND_CLASSNAME: 'android.widget.Button',
    },
    EGG: {
        EGG_DESC: '第1张轮播图片，可跳转'
    },
    LIST_NAME: ['应用商店', '游戏中心', '浏览器', "vivo视频", '钱包', '主题', '音乐', '小游戏', '快应用', '智慧生活']



};

/** 
 * ==================== 权限检查 ====================
 */

function getPermission() {
    importClass(android.provider.Settings);

    if (!Settings.canDrawOverlays(context)) {
        toast("请开启悬浮窗权限");
        app.startActivity({
            action: "android.settings.action.MANAGE_OVERLAY_PERMISSION",
            data: "package:" + context.getPackageName()
        });
        while (!Settings.canDrawOverlays(context)) {
            sleep(1000);
        }
    }

    if (auto.service == null) {
        toast("请开启无障碍服务");
        sleep(1000);
        auto.waitFor();
    }
    console.show()
    console.log("权限检查完成");

}

/** ==================== 启动App ==================== */
function startApp(packageName, sleepTime) {
    sleepTime = (sleepTime == null) ? CONFIG.DELAY._FOUR : sleepTime;
    console.log("启动App：" + packageName);
    app.launch(packageName);

    // 倒计时显示
    let remaining = Math.ceil(sleepTime / 1000);
    console.log("等待 " + remaining + " 秒...");
    while (remaining > 0) {
        sleep(1000);
        remaining--;
        if (remaining > 0) {
            console.log("剩余 " + remaining + " 秒...");
        }
    }
}

/** ==================== 返回首页 ==================== */
function backToHome() {
    var isHome = desc(CONFIG.TABBER.READ_DESC).exists()
    if (!isHome) {
        back()
        sleep(200)
        backToHome()
    }
}

/** ==================== 领积分 ==================== */
function getPoints() {
    var arr = text("领取积分").find();
    if (arr.length > 0) {
        text("领取积分").findOne().click();
        sleep(1000);
        getPoints();
    }
}
/** ==================== 砸金蛋 ==================== */

function clickEgg() {
    let node = textMatches(/剩余\d+次抽奖机会/).findOne(2000);
    if (!node) return;
    let num = parseInt(node.text().match(/\d+/)[0]);
    if (num <= 0) { back(); return; }

    let eggs = className("android.widget.TextView").find();
    let clicked = false;
    for (let i = 0; i < eggs.length; i++) {
        let e = eggs[i];
        if (e.clickable() && e.indexInParent() == 1) {
            e.click();
            sleep(2000);
            let know = text("我知道了").findOne(2000);
            if (know) { know.click(); sleep(2000); }
            clicked = true;
            break;
        }
    }
    if (clicked) clickEgg();
}

/** ==================== list签到 ==================== */

function getTextIntegral(textArr) {
    let arr = textArr
    for (let i = 0; i < arr.length; i++) {
        let isOk = text(arr[i]).findOne().click();
        sleep(3000);
        switch (arr[i]) {
            case '游戏中心':
                back();
                sleep(1000);
                back();
                console.log(arr[i] + isOk);
                break;
            case '音乐':
                back();
                console.log(arr[i] + isOk);
                break;
            case '智慧生活':
                back();
                sleep(1000);
                back();
                console.log(arr[i] + isOk);
                break;
            case '小游戏':
                if (id("btn_sign_in").exists()) {
                    id("btn_sign_in").findOne().click();
                    sleep(1000);
                }
                app.launch('com.vivo.space');
                console.log(arr[i] + isOk);
                break;
            default:
                app.launch('com.vivo.space');
                console.log(arr[i] + isOk);
                break;
        }
    }

}
/** ==================== 特殊日期检查 ==================== */

function checkSpecialDate() {
    const today = new Date();
    const day = today.getDate();
    const specialDays = [8, 15, 21, 28];

    if (specialDays.includes(day)) {
        console.log('[特殊日期] 今天是' + day + '号，建议抽奖');
        toast(
            '今天是' + day + '号，记得抽奖！'
        );

    }
}



/** ==================== main函数↓ ==================== */





/** ==================== 清空购物车 ==================== */
function clearCart() {
    // backToHome()
    id(CONFIG.CART.CART_ID).findOne().click();
    sleep(CONFIG.DELAY._TWO);

    if (text(CONFIG.CART.CART_NO_TEXT).exists()) {
        back();
    } else {
        text("编辑").findOne().click();
        text("全选").findOne().click();
        text("删除").findOne().click();
        sleep(1000);
        text("删除").findOnce(1).click();
        sleep(1000);
        back();
    }
    console.log('清空购物车true');
}

/** ==================== 添加购物车 ==================== */

function addCart() {
    // backToHome()
    desc(CONFIG.TABBER.CART_DESC).findOne().click();
    const randomNum = Math.floor(Math.random() * 4);
    sleep(CONFIG.DELAY._ONE);

    const rect = id("shop_phone_icon").findOnce(randomNum).bounds();
    click(rect.centerX(), rect.centerY());
    sleep(CONFIG.DELAY._TWO);

    const addCartBtn = text("加入购物车").findOne(2000);
    if (addCartBtn) addCartBtn.click();
    sleep(CONFIG.DELAY._ONE);
    const confirmBtn = text("确定").findOne(2000);
    if (confirmBtn) confirmBtn.click();
    sleep(CONFIG.DELAY._ONE);
    back();
    sleep(CONFIG.DELAY._ONE);
    back();

    console.log('加入购物车true');
}
/** ==================== 社区阅读 ==================== */

function communityRead() {
    // backToHome()
    desc(CONFIG.TABBER.READ_DESC).findOne().click();
    sleep(CONFIG.DELAY._TWO);
    const communityItems = id(CONFIG.READ.LIST_ID).findOne().children();
    for (let i = 0; i < 3; i++) {
        communityItems[i].click();
        sleep(CONFIG.DELAY._TWO);
        back();
        console.log('阅读第' + (i + 1) + '篇文章');
        sleep(CONFIG.DELAY._ONE);

    }
    console.log('阅读true');

}
/** ==================== 会员页 ==================== */

function vipPage() {
    // backToHome()
    desc(CONFIG.TABBER.VIP_DESC).findOne().click();
    sleep(CONFIG.DELAY._TWO);
    back();
    console.log('会员true');
}

/** ==================== 领积分 ==================== */

function getIntegral() {
    // backToHome()
    desc(CONFIG.TABBER.MY_DESC).findOne().click();
    sleep(CONFIG.DELAY._ONE);
    id(CONFIG.MY.INTEGRAL_ID).findOne().click();
    sleep(CONFIG.DELAY._TWO);
    var btnarr = className(CONFIG.MY.EXPAND_CLASSNAME).find();
    for (var i = 0; i < btnarr.length; i++) {
        if (btnarr[i].text() == "" && btnarr[i].indexInParent() == 2) {
            btnarr[i].click();
        }
    }
    sleep(500);
    getPoints();

}

/** ==================== 砸金蛋 ==================== */
function clickEggMain() {
    desc(CONFIG.EGG.EGG_DESC).findOne().click();
    sleep(CONFIG.DELAY._THREE);
    clickEgg();

}

/** ==================== list ==================== */

function list() {
    text(CONFIG.MY.INTEGRAL_SHOP_TEXT).findOne().click();
    sleep(CONFIG.DELAY._TWO);
    text(CONFIG.MY.GET_INTEGRAL_TEXT).findOne().click();
    sleep(CONFIG.DELAY._ONE);
    let all_text_arr = CONFIG.LIST_NAME;

    let get_text_arr = []

    for (let i = 0; i < all_text_arr.length; i++) {
        let p = text(all_text_arr[i]).findOne().parent();
        let arr = p.children();
        console.log(arr.length, all_text_arr[i]);
        if (arr.length == 4) {
            get_text_arr.push(all_text_arr[i]);
        }
    }
    console.log(get_text_arr);
    getTextIntegral(get_text_arr);

}

/** ==================== vivo 社区 ==================== */
function communityVivo() {
    app.launch("com.vivo.club");
    sleep(CONFIG.DELAY._FOUR);
    var arr = id("textPicVideoTotalView").find();
    while (arr.length <= 4) {
        console.log("文章数量不足，2s后重新获取");
        sleep(2000);
    }
    for (let i = 0; i < 5; i++) {
        sleep(CONFIG.DELAY._TWO);
        var el = arr[i];
        arr[i].click();
        sleep(CONFIG.DELAY._TWO);

        id("btn_praise").findOne().click();

        if (i == 4) {
            id("tv_reply").findOne().click();
            sleep(CONFIG.DELAY._TWO);
            id("edt_reply").findOne().setText("签到");
            id("btn_send_reply").findOne().click();
            sleep(CONFIG.DELAY._TWO);
            console.log('社区评论true');
            back();
        }
        back();
    }

    console.log('社区阅读true');
    id("mainBottTabVCoinView").findOne().click();
    sleep(CONFIG.DELAY._TWO);


    if (id("everySignDaySignBtn").exists()) {
        id("everySignDaySignBtn").findOne().click();
        sleep(CONFIG.DELAY._TWO);

    }

    var btn = desc("点击抽奖本次免费").exists();
    if (btn) {
        desc("点击抽奖本次免费").findOne().click();
    }

    console.log("签到完成");
    console.log('社区true');
}


/** ==================== 国网 ==================== */
function getPower() {
    app.launch("com.sgcc.wsgw.cn");
    sleep(CONFIG.DELAY._THREE);

    let btn = desc('签到').findOne();
    if (btn) {
        let bounds = btn.bounds();
        let x = bounds.centerX();
        let y = bounds.centerY();
        click(x, y);
    }

    checkSpecialDate();
}

/** ==================== 小黑盒 ==================== */

function getWx() {
    app.launch("com.tencent.mm")
    text("文件传输助手").findOne().parent().parent().parent().parent().parent().parent().click()
    id('bkg').findOne().click()

}
/** ==================== 主函数 ==================== */


function main() {

    //1.获取权限
    getPermission()

    //2.小黑盒
    startApp(CONFIG.PACKAGES.BLACK_BOX)

    //3.掌上CF
    startApp(CONFIG.PACKAGES.CF_SNS)

    //4.vivo官网
    startApp(CONFIG.PACKAGES.VIVO_SPACE, CONFIG.DELAY._THREE)
    backToHome()
    //5.清空购物车
    clearCart()

    //6.加入购物车
    addCart()

    //7.社区阅读
    communityRead()

    //8.会员页
    vipPage()

    //9.领积分
    signIn()

    //10.砸金蛋
    clickEggMain()

    //11.list
    list()

    //12.vivo社区
    communityVivo()

    //13.国网
    getPower()

    //14.微信
    getWx()


    console.hide()
}
main()