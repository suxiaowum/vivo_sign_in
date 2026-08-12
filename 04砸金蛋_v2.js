// 04 砸金蛋：通过轮播图入口进入砸金蛋活动并递归砸完
// 独立可执行：自带权限检查并启动到 vivo空间 我的/积分页

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

// ==================== 砸金蛋（递归）====================
function clickEgg() {
    const node = textMatches(/剩余\d+次抽奖机会/).findOne(2000);
    // null 保护：找不到剩余次数文本时直接返回，避免 NPE
    if (!node) {
        back();
        return;
    }

    const num = parseInt(node.text().match(/\d+/)[0]);
    if (num <= 0) {
        back();
        return;
    }

    const egg = className("android.widget.TextView").find();
    for (let l = 0; l < egg.length; l++) {
        const e = egg[l];
        if (e.clickable() && e.indexInParent() == 1) {
            e.click();
            sleep(2000);

            if (text("我知道了").exists()) {
                text("我知道了").findOne().click();
                sleep(2000);
            }
            break;
        }
    }
    clickEgg();
}

// 我的 -> 积分页
desc('我的').findOne().click();
sleep(1000);
id("ll_jifen").findOne().click();
sleep(2000);

// 轮播图入口 -> 砸金蛋
desc("第1张轮播图片，可跳转").findOne(3000).click();
sleep(3000);
clickEgg();

console.log('砸金蛋true');
exit();
