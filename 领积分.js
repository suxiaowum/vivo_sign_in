//领积分
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
app.launch('com.vivo.space')
console.log('如果超过5s没有动作，关闭vivo官网和脚本后台后再重新运行脚本')
console.log('按音量上键停止脚本');
sleep(3000)
desc('我的').findOne().click()
sleep(1000)
id("ll_jifen").click()
sleep(2000)





var btnarr = className("android.widget.Button").find()
for (var i = 0; i < btnarr.length; i++) {
    if (btnarr[i].text() == "" && btnarr[i].indexInParent() == 2) {
        btnarr[i].click()
    }
}
sleep(1000)
getPoints()

function getPoints() {
    var arr = text("领取积分").find()
    if (arr.length > 0) {
        text("领取积分").findOne().click()
        sleep(1000)
        getPoints()
    }
}