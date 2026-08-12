// 03 领积分：会员/我的/积分页领取所有可领积分
// 独立可执行：自带权限检查并启动到 vivo空间 主页

// ==================== 权限检查 ====================
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

// ==================== 启动脚本 ====================
console.show();
console.log('如果超过5s没有动作，关闭vivo官网和脚本后台后再重新运行脚本');
console.log('按音量上键停止脚本');

app.launch('com.vivo.space');
sleep(3000);

// ==================== 领积分（递归）====================
function getPoints() {
    const arr = text("领取积分").find();
    if (arr.length == 0) {
        return;
    }
    const btn = text("领取积分").findOne();
    if (!btn) {
        return;
    }
    btn.click();
    sleep(1000);
    getPoints();
}

// 会员页
desc('会员').findOne().click();
sleep(1500);
console.log('会员true');

// 我的 -> 积分页
desc('我的').findOne().click();
sleep(1000);
id("ll_jifen").findOne().click();
sleep(2000);

// 领积分按钮（text 为空且为父布局第 3 个子控件）
const btnArr = className("android.widget.Button").find();
for (let i = 0; i < btnArr.length; i++) {
    if (btnArr[i].text() == "" && btnArr[i].indexInParent() == 2) {
        btnArr[i].click();
    }
}
sleep(500);
getPoints();

console.log('领积分true');
exit();
