// 05 赚积分任务：积分商城 -> 赚积分 -> 浏览 10 个应用
// 独立可执行：自带权限检查并启动到 vivo空间 我的/积分页
// 注意：该流程假定已在积分页，先进入"积分商城"->"赚积分"。

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

// 我的 -> 积分页
desc('我的').findOne().click();
sleep(1000);
id("ll_jifen").findOne().click();
sleep(2000);

// 积分商城 -> 赚积分
text('积分商城').findOne().click();
sleep(1500);

text("赚积分").findOne().click();
sleep(1000);

// ==================== 浏览赚积分应用 ====================
const tasks = ['应用商店', '游戏中心', '浏览器', "vivo视频", '钱包', '主题', '音乐', '小游戏', '快应用', '智慧生活'];
for (let i = 0; i < tasks.length; i++) {
    const isOk = text(tasks[i]).findOne().click();
    sleep(5000);

    switch (tasks[i]) {
        case '游戏中心':
            back();
            sleep(1000);
            back();
            console.log(tasks[i] + isOk);
            break;
        case '音乐':
            back();
            console.log(tasks[i] + isOk);
            break;
        case '智慧生活':
            back();
            sleep(1000);
            back();
            console.log(tasks[i] + isOk);
            break;
        case '小游戏':
            if (id("btn_sign_in").exists()) {
                id("btn_sign_in").findOne().click();
                sleep(1000);
            }
            app.launch('com.vivo.space');
            console.log(tasks[i] + isOk);
            break;
        default:
            app.launch('com.vivo.space');
            console.log(tasks[i] + isOk);
            break;
    }
}

console.log('赚积分任务true');
exit();
