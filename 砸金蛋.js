//砸金蛋
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


desc("第1张轮播图片，可跳转").findOne(3000).click()
sleep(3000)
clickEgg()
function clickEgg() {
    var node = textMatches(/剩余\d+次抽奖机会/).findOne(2000)
    var num = parseInt(node.text().match(/\d+/)[0])

    // 如果num大于0，则执行点击操作
    if (num > 0) {
        // 查找所有TextView类型的元素
        var egg = className("android.widget.TextView").find()
        var eggNode = null  // 初始化eggNode为null
        var eggNum = 0  // 初始化eggNum为0

        // 遍历查找到的所有TextView元素
        for (var l = 0; l < egg.length; l++) {
            console.log('for2', l)  // 打印内层循环的当前索引
            var e = egg[l]  // 获取当前元素
            // 检查元素是否可点击且在父元素中的索引为1
            if (e.clickable() && e.indexInParent() == 1) {
                eggNum = l  // 记录符合条件的元素索引
                e.click()  // 点击元素
                sleep(2000)  // 暂停2秒
                console.log('e.click()')  // 打印点击信息
                // 检查是否存在"我知道了"的文本
                if (text("我知道了").exists()) {
                    console.log('我知道了')  // 打印提示信息
                    text("我知道了").findOne().click()  // 点击"我知道了"按钮
                    sleep(2000)  // 暂停2秒
                }
                break  // 跳出内层循环
            }
        }


        clickEgg()  // 递归调用clickEgg函数，继续检测剩余抽奖次数
        back()  // 返回上一级
    } else {
        back()  // 如果num不大于0，直接返回上一级
    }
}