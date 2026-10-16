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
        WECHAT: 'com.tencent.mm',
        QUARK: 'com.quark.browser',
        IQOO: 'com.iqoo.bbs'
    },
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
        CART_DESC: '选购',
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
        EGG_DESC: '第2张轮播图片，可跳转'  //活动结束后改为‘第1张轮播图片，可跳转’
    },
    LIST_NAME: ['应用商店', '游戏中心', '浏览器', "vivo视频", '钱包', '主题', '音乐', '小游戏', '快应用', '智慧生活'],

    WX: {
        ONE_X: 986,
        ONE_Y: 765,
        TWO_X: 700,
        TWO_Y: 2000,
    }


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
    sleepTime = (sleepTime == null) ? 4000 : sleepTime;
    console.log("启动App：" + packageName);
    app.launch(packageName);

    // 倒计时显示
    backTime(sleepTime);
}
function backTime(sleepTime) {
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
        backTime(5000);
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
            case '钱包':

                // back()
                // sleep(1000)
                // desc("省钱").findOne().click()
                sleep(1000)
                // if (text("签到").exists()) {
                //     text("签到").findOne().click()
                //     sleep(1000)
                // }
                app.launch('com.vivo.space');
                console.log(arr[i] + isOk)
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
    sleep(2000);

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
    sleep(1000);

    // const rect = id("shop_phone_icon").findOnce(randomNum).bounds();
    let arr = id("product_price").find();
    let rect = null;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].text() !== "0.01" && arr[i].text() !== "9.9" && arr[i].text() !== "0.1") {
            rect = arr[i].parent();
            break;
        }
    }
    rect.click();

    sleep(2000);

    const addCartBtn = text("加入购物车").findOne(2000);
    if (addCartBtn) addCartBtn.click();
    sleep(1000);
    const confirmBtn = desc("确定").findOne(2000);
    if (confirmBtn) confirmBtn.click();
    sleep(1000);
    back();
    sleep(1000);
    back();

    console.log('加入购物车true');
}
/** ==================== 社区阅读 ==================== */

function communityRead() {
    // backToHome()
    desc(CONFIG.TABBER.READ_DESC).findOne().click();
    sleep(2000);
    const communityItems = id(CONFIG.READ.LIST_ID).findOne().children();
    let commNum = 0;
    for (let i = 0; i < communityItems.length; i++) {

        if (communityItems[i].desc() == null) {
            log('跳过')
            continue;
        } else {
            communityItems[i].click();
            backTime(3000);
            back();
            commNum++;
            console.log('阅读第' + commNum + '篇');
            sleep(1000);
            if (commNum == 3) {
                break;
            }
        }
    }
    console.log('阅读true');

}
/** ==================== 会员页 ==================== */

function vipPage() {
    // backToHome()
    desc(CONFIG.TABBER.VIP_DESC).findOne().click();
    sleep(2000);
    back();
    console.log('会员true');
}

/** ==================== 领积分 ==================== */

function getIntegral() {
    // backToHome()
    desc(CONFIG.TABBER.MY_DESC).findOne().click();
    sleep(1000);
    id(CONFIG.MY.INTEGRAL_ID).findOne().click();
    sleep(2000);
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
    sleep(3000);
    clickEgg();

}

/** ==================== list ==================== */

function list() {
    text(CONFIG.MY.INTEGRAL_SHOP_TEXT).findOne().click();
    sleep(2000);
    text(CONFIG.MY.GET_INTEGRAL_TEXT).findOne().click();
    sleep(1000);
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
    // console.log(get_text_arr);
    getTextIntegral(get_text_arr);

}

/** ==================== vivo 社区 ==================== */
function communityVivo() {

    console.log('社区')
    app.launch("com.vivo.club");
    sleep(4000);
    let tabTrue = desc("未选中标签栏广场").exists();
    if (tabTrue) {
        desc("未选中标签栏广场").findOne().click();
    }
    sleep(2000);
    let arr = id("thread_status_userInfo_view").find()
    sleep(1000);
    for (let i = 0; i < arr.length; i++) {
        arr[i].parent().parent().parent().click();
        // 等待点赞按钮出现，兼容普通帖(btn_praise)与视频帖(thread_video_ZanView)
        let praiseId = null;
        let deadline = Date.now() + 8000; // 最多等 8 秒
        while (Date.now() < deadline) {
            if (id("btn_praise").exists()) { praiseId = "btn_praise"; break; }
            if (id("thread_video_ZanView").exists()) { praiseId = "thread_video_ZanView"; break; }
            sleep(500);
        }
        if (!praiseId) {
            console.log('未找到点赞按钮，跳过第' + (i + 1) + '篇');
            back();
            id("thumb_Pic_iv").waitFor();
            continue;
        }
        sleep(2000);
        if (praiseId == "thread_video_ZanView") {
            // 视频帖：不判断点赞状态，直接点一次
            id(praiseId).findOne().click();
            sleep(2000);
        } else {
            // 普通帖：按 desc 判断是否已赞，保证结束态为已赞
            if (id(praiseId).findOne().desc().indexOf("已点赞") == -1) {
                id(praiseId).findOne().click();
                sleep(2000);
            } else {
                id(praiseId).findOne().click();
                sleep(2000);
                id(praiseId).findOne().click();
            }
        }

        if (i == 4) {
            // 打开评论输入框（输入框都要先点击才出现）：
            //   普通帖 tv_reply / 视频帖 thread_video_sendMsg_View
            if (id("tv_reply").exists()) {
                id("tv_reply").findOne().click();
            } else if (id("thread_video_sendMsg_View").exists()) {
                id("thread_video_sendMsg_View").findOne().click();
            } else {
                console.log('未找到评论入口，跳过评论');
            }
            sleep(2000);
            // 输入框：普通帖/视频帖均为 edt_reply
            let replyDeadline = Date.now() + 8000;
            while (Date.now() < replyDeadline && !id("edt_reply").exists()) {
                sleep(500);
            }
            if (id("edt_reply").exists()) {
                id("edt_reply").findOne().setText("签到");
                // 发送：普通帖/视频帖均为 btn_send_reply
                id("btn_send_reply").findOne().click();
                sleep(2000);
                console.log('社区评论true');
            } else {
                console.log('未找到评论输入框，跳过评论');
            }
        }
        back()
        id("thumb_Pic_iv").waitFor();
        console.log('社区阅读第' + (i + 1) + '篇文章');
        sleep(2000);
        if (i == 5) {
            break;
        }

    }



    console.log('社区阅读true');



    // 签到
    id("mainBottTabVCoinView").findOne().click();
    sleep(2000);


    if (id("everySignDaySignBtn").exists()) {
        id("everySignDaySignBtn").findOne().click();
        sleep(2000);

    }
    // 抽奖
    var btn = desc("点击抽奖本次免费").exists();
    if (btn) {
        desc("点击抽奖本次免费").findOne().click();
        sleep(2000);
    }

    console.log("签到完成");
    console.log('社区true');
}


/** ==================== 国网 ==================== */
function getPower() {
    app.launch("com.sgcc.wsgw.cn");
    backTime(5000);
    let closeBtn = desc("关闭").findOne(5000);

    if (closeBtn) {
        let bounds = desc("关闭").findOne().bounds()
        let centerX = bounds.centerX();
        let centerY = bounds.centerY();
        click(centerX, centerY);
    }
    desc('签到').waitFor();
    let btn = desc('签到').findOne();
    if (btn) {
        let bounds = btn.bounds();
        let x = bounds.centerX();
        let y = bounds.centerY();
        click(x, y);
        backTime(5000);
    }

    checkSpecialDate();
}

/** ==================== 微信 ==================== */

function getWx() {
    app.launch(CONFIG.PACKAGES.WECHAT);
    backTime(3000)
    click(CONFIG.WX.ONE_X, CONFIG.WX.ONE_Y) //文件传输助手坐标
    backTime(3000)
    click(CONFIG.WX.TWO_X, CONFIG.WX.TWO_Y)  //小程序坐标
    backTime(3000)

}



/** ==================== 夸克 ==================== */

function quark() {

    app.launch(CONFIG.PACKAGES.QUARK);
    backTime(3000)
    desc('菜单').findOne().click()
    backTime(2000)
    click(990, 460)
    backTime(2000)
    text('立即领').findOne().click()
    backTime(2000)
    click(660, 2130)
    backTime(2000)


}

/** ==================== iqoo社区 ==================== */

function iqoo() {

    app.launch(CONFIG.PACKAGES.IQOO);
    backTime(4000);
    let arr = id('ifbv').find();
    for (let i = 0; i < arr.length; i++) {
        arr[i].parent().click()
        console.log('iqoo阅读第' + (i + 1) + '篇文章');
        backTime(2000);
        id("btn_praise").findOne().click();
        backTime(2000);
        id("btn_share").findOne().click();
        backTime(1000);
        id("ll_copy").findOne().click();
        backTime(1000);
        if (i == 0) {
            id("tv_reply").findOne().click();
            id("edt_reply").findOne().setText("每日一评")
            backTime(1000);
            text("发送").findOne().click();
            backTime(2000);
        }
        back()
        backTime(2000);
        if (i == 4) {
            break;
        }
    }
    console.log('iqoo阅读true');
    id("btn_integral").findOne().click();
    backTime(2000);
    console.log('iqoo签到true');
    id("tv_sign_in").findOne().click();
    backTime(2000);
    desc("点击抽奖本次免费").findOne().click();
    console.log('iqoo抽奖true');

}


/** ==================== 主函数 ==================== */


function main() {

    getPermission() //1.获取权限

    startApp(CONFIG.PACKAGES.BLACK_BOX) //2.小黑盒

    startApp(CONFIG.PACKAGES.CF_SNS) //3.掌上CF

    startApp(CONFIG.PACKAGES.VIVO_SPACE, 3000) //4.vivo官网

    backToHome()  //vivo社区返回首页

    clearCart() //5.清空购物车

    addCart() //6.加入购物车

    communityRead() //7.社区阅读

    vipPage() //8.会员页

    getIntegral() //9.领积分

    clickEggMain() //10.砸金蛋

    list() //11.list

    communityVivo() //12.vivo社区

    getPower() //13.国网

    //getWx() //14.微信

    // quark() //15.夸克

    iqoo() //16.iqoo社区
    console.hide()
}
main()
