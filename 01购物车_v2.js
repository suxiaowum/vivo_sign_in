// 01 购物车：清空购物车 + 随机加入一件商品
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

// ==================== 清空购物车 ====================
id("top_title_shop_cart").findOne().click();
sleep(1000);

if (text("暂无商品").exists()) {
    back();
} else {
    text("编辑").findOne().click();
    text("全选").findOne().click();
    text("删除").findOne().click();
    sleep(1000);
    text("删除").findOnce(1).click();
    sleep(1000);
    back();
}
console.log('清空购物车true');

// ==================== 加入购物车 ====================
desc('选购').click();
const randomNum = Math.floor(Math.random() * 4);
sleep(1000);

const rect = id("shop_phone_icon").findOnce(randomNum).bounds();
click(rect.centerX(), rect.centerY());
sleep(2000);

const addCartBtn = text("加入购物车").findOne(2000);
if (addCartBtn) addCartBtn.click();
const confirmBtn = text("确定").findOne(2000);
if (confirmBtn) confirmBtn.click();
back();
back();

console.log('加入购物车true');
exit();
