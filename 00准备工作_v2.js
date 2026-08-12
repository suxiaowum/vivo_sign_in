// 00 准备工作：权限检查 + 启动前置 App（小黑盒 / CF / vivo空间）
// 独立可执行：完成环境准备并停留在 vivo空间 主页

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

// 小黑盒
app.launch("com.max.xiaoheihe");
sleep(3000);
console.log("小黑盒true");

// CF 社区
app.launch("com.tencent.qt.sns");
console.log("cfTrue");
sleep(3000);

// vivo空间（最终停留在这里）
app.launch('com.vivo.space');
sleep(3000);
console.log("vivo空间启动完成");

exit();
