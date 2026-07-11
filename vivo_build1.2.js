
// 1. 检查并申请悬浮窗权限（阻塞等待）
importClass(android.provider.Settings);
if (!Settings.canDrawOverlays(context)) {
    toast("请开启悬浮窗权限");
    app.startActivity({
        action: "android.settings.action.MANAGE_OVERLAY_PERMISSION",
        data: "package:" + context.getPackageName()
    });
    // 循环等待，直到用户手动开启
    while (!Settings.canDrawOverlays(context)) {
        sleep(1000);
    }
}
// 2. 检查并申请无障碍服务（阻塞等待）
if (auto.service == null) {
    toast("请开启无障碍服务");
    sleep(1000)
    auto.waitFor();
}

// 3. 开始执行脚本
console.show()
app.launch('com.vivo.space')
console.log('如果超过5s没有动作，关闭vivo官网和脚本后台后再重新运行脚本')
console.log('按音量上键停止脚本');
sleep(3000)
desc('社区').findOne().click()
sleep(1500)
var arr = id("rv").findOne().children()
for (let i = 0; i < 3; i++) {
    var el = arr[i];
    el.click()
    sleep(2000)
    back()
    sleep(1000)
}
console.log('阅读true');
desc('会员').findOne().click()
sleep(1500)
console.log('会员true');
desc('我的').findOne().click()
sleep(1000)
id("ll_jifen").click()
sleep(2000)
text('积分商城').findOne().click()
sleep(1500)
text("赚积分").findOne().click()
sleep(1000)
var arr = ['应用商店', '游戏中心', '浏览器', "vivo视频", '钱包', '主题', '音乐', '小游戏', '快应用', '智慧生活']
for (var i = 0; i < arr.length; i++) {
    var isOk = text(arr[i]).findOne().click()
    sleep(3000)
    switch (arr[i]) {
        case '游戏中心':
            back()
            sleep(1000)
            back()
            console.log(arr[i] + isOk);
            break;
        case '音乐':
            back()
            console.log(arr[i] + isOk);
            break;
        case '智慧生活':
            back()
            sleep(1000)
            back()
            console.log(arr[i] + isOk);
            break;
        case '小游戏':
            if (id("btn_sign_in").exists()) {

                id("btn_sign_in").findOne().click()

                sleep(1000)
            }
            app.launch('com.vivo.space')
            console.log(arr[i] + isOk);
            break;
        default:
            app.launch('com.vivo.space')
            console.log(arr[i] + isOk);
            break;
    }

}
app.launch("com.vivo.club");
sleep(3000)
var arr = id("textPicVideoTotalView").find()
for (let i = 0; i < 3; i++) {
    sleep(2000)
    var el = arr[i];
    arr[i].click()
    sleep(1500)
    if (i == 2) {
        id("tv_reply").findOne().click()
        sleep(2000)
        id("edt_reply").findOne().setText("签到")
        id("btn_send_reply").findOne().click()
        sleep(1500)
        console.log('社区评论true');
        back()
    }
    back()
}
console.log('社区阅读true');
id("mainBottTabVCoinView").findOne().click()
sleep(1500)
id("everySignDaySignBtn").findOne().click()
sleep(1500)
desc("点击抽奖本次免费").findOne().click()
console.log(社区true);
app.launch("com.max.xiaoheihe")
sleep(3000)
console.log("小黑盒true")

app.launch("com.tencent.qt.sns")
console.log("cfTrue")
console.log("签到完成");
exit()
//范围点击
function elementFun(left, top, right, bottom) {
    var element = bounds(left, top, right, bottom).findOne();
    if (element) {
        element.click();  // 如果控件本身可点击
        // 如果不可点击，用下面的坐标点击
        // click(element.bounds().centerX(), element.bounds().centerY());
    } else {
        console.log("未找到该区域的控件");
    }
}
