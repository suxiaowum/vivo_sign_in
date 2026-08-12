// 06 vivo社区签到：阅读5篇+评论+每日签到+免费抽奖
// 独立可执行：自带权限检查并启动到 vivo社区 (com.vivo.club)

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


communityVivo()

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
        id("btn_praise").waitFor();
        sleep(2000);
        if (id("btn_praise").findOne().desc().indexOf("已点赞") == -1) {
            id("btn_praise").findOne().click();
            sleep(2000);
        } else {
            id("btn_praise").findOne().click();
            sleep(2000);
            id("btn_praise").findOne().click();
        }

        if (i == 4) {
            id("tv_reply").findOne().click();
            sleep(2000);
            id("edt_reply").findOne().setText("签到");
            id("btn_send_reply").findOne().click();
            sleep(2000);
            console.log('社区评论true');
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
