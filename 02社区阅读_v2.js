// 02 社区阅读：在 vivo空间 社区浏览 3 篇文章
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

// ==================== 社区阅读 3 篇 ====================
desc('社区').findOne().click();
sleep(1500);

const communityItems = id("rv").findOne().children();
for (let i = 0; i < 3; i++) {
    communityItems[i].click();
    sleep(2000);
    back();
    sleep(1000);
}
console.log('阅读true');

exit();
