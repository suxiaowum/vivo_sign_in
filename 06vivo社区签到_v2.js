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
