/**
 * vivo 官网自动签到脚本 - 模块化版本
 *
 * 模块划分：
 *   1. 权限检查     - 悬浮窗 & 无障碍服务
 *   2. 前置App启动   - 小黑盒、CF社区
 *   3. vivo空间     - 购物车操作、社区浏览、砸金蛋、积分浏览
 *   4. vivo社区     - 阅读、点赞、评论、每日签到（独立App）
 *   5. 领积分       - 递归领取所有可领积分
 */

// ======================== 配置常量 ========================
const CONFIG = {
    // App 包名
    PACKAGES: {
        BLACK_BOX: 'com.max.xiaoheihe',
        CF_SNS: 'com.tencent.qt.sns',
        VIVO_SPACE: 'com.vivo.space',
        VIVO_CLUB: 'com.vivo.club',
    },

    // 延时配置 (ms)
    DELAY: {
        APP_LAUNCH: 3000,
        SHORT: 1000,
        MEDIUM: 1500,
        LONG: 2000,
        VERY_LONG: 3000,
        EXTRA_LONG: 4000,
    },

    // 积分商城 - 所有需要浏览的应用列表
    ALL_APPS: [
        '应用商店', '游戏中心', '浏览器', 'vivo视频',
        '钱包', '主题', '音乐', '小游戏', '快应用', '智慧生活',
    ],

    // 社区 - 阅读文章数
    COMMUNITY_ARTICLE_COUNT: 5,
    COMMUNITY_PREVIEW_COUNT: 3,

    // 砸金蛋 - 轮播图描述
    CAROUSEL_DESC: '第1张轮播图片，可跳转',

    // 评论文本
    COMMENT_TEXT: '签到',
};

// ======================== 1. 权限检查 ========================
function checkPermissions() {
    importClass(android.provider.Settings);

    // 悬浮窗权限
    if (!Settings.canDrawOverlays(context)) {
        toast('请开启悬浮窗权限');
        app.startActivity({
            action: 'android.settings.action.MANAGE_OVERLAY_PERMISSION',
            data: 'package:' + context.getPackageName(),
        });
        while (!Settings.canDrawOverlays(context)) {
            sleep(CONFIG.DELAY.SHORT);
        }
        toast('悬浮窗权限已开启');
    }

    // 无障碍服务
    if (auto.service == null) {
        toast('请开启无障碍服务');
        sleep(CONFIG.DELAY.SHORT);
        auto.waitFor();
        toast('无障碍服务已开启');
    }

    console.show();
    console.log('=== vivo 签到脚本启动 ===');
    console.log('按音量上键停止脚本');
}

// ======================== 2. 前置 App 启动 ========================
function launchPreApps() {
    // 小黑盒
    try {
        app.launch(CONFIG.PACKAGES.BLACK_BOX);
        sleep(CONFIG.DELAY.APP_LAUNCH);
        console.log('[前置] 小黑盒启动成功');
    } catch (e) {
        console.log('[前置] 小黑盒启动失败: ' + e.message);
    }

    // CF 社区
    try {
        app.launch(CONFIG.PACKAGES.CF_SNS);
        console.log('[前置] CF社区启动成功');
        sleep(CONFIG.DELAY.APP_LAUNCH);
    } catch (e) {
        console.log('[前置] CF社区启动失败: ' + e.message);
    }
}

// ======================== 3. 返回 vivo 空间主页 ========================
function goToVivoSpaceHome() {
    // 先启动 vivo 空间（如果不在其中）
    if (!currentPackage() === CONFIG.PACKAGES.VIVO_SPACE) {
        app.launch(CONFIG.PACKAGES.VIVO_SPACE);
        sleep(CONFIG.DELAY.APP_LAUNCH);
    }
    // 递归 back 到主页
    const isHome = desc('我的').exists();
    if (!isHome) {
        back();
        sleep(500);
        goToVivoSpaceHome();
    }
    sleep(CONFIG.DELAY.SHORT);
}

// ======================== 4. 购物车操作 ========================
function clearCart() {
    console.log('[购物车] 开始清空购物车');
    goToVivoSpaceHome();

    const cartTitle = id('top_title_shop_cart').findOne();
    cartTitle.click();
    sleep(CONFIG.DELAY.SHORT);

    if (text('暂无商品').exists()) {
        console.log('[购物车] 购物车为空');
        back();
        return;
    }

    text('编辑').findOne().click();
    sleep(CONFIG.DELAY.SHORT);
    text('全选').findOne().click();
    sleep(CONFIG.DELAY.SHORT);
    text('删除').findOne().click();
    sleep(CONFIG.DELAY.SHORT);
    // 确认弹窗
    text('删除').findOnce(1).click();
    sleep(CONFIG.DELAY.SHORT);
    back();

    console.log('[购物车] 清空完成');
}

function addToCart() {
    console.log('[购物车] 开始加入购物车');

    // 点击"选购"进入商品页
    desc('选购').click();
    sleep(CONFIG.DELAY.SHORT);

    // 随机选一个手机图标
    const randomIndex = Math.floor(Math.random() * 4);
    const phoneIcon = id('shop_phone_icon').findOnce(randomIndex);
    if (!phoneIcon) {
        console.log('[购物车] 未找到手机图标，跳过');
        return;
    }

    const rect = phoneIcon.bounds();
    console.log('[购物车] 选中商品索引: ' + randomIndex);
    click(rect.centerX(), rect.centerY());
    sleep(CONFIG.DELAY.LONG);

    // 加入购物车
    text('加入购物车').findOne(CONFIG.DELAY.VERY_LONG).click();
    text('确定').findOne(CONFIG.DELAY.VERY_LONG).click();
    back();
    back();

    console.log('[购物车] 加入完成');
}

// ======================== 5. 社区浏览 ========================
function communityBrowse() {
    console.log('[社区] 开始浏览');
    goToVivoSpaceHome();

    desc('社区').findOne().click();
    sleep(CONFIG.DELAY.MEDIUM);

    const rvContainer = id('rv').findOne();
    const children = rvContainer.children();
    const count = Math.min(children.length, CONFIG.COMMUNITY_PREVIEW_COUNT);

    for (let i = 0; i < count; i++) {
        children[i].click();
        sleep(CONFIG.DELAY.LONG);
        back();
        sleep(CONFIG.DELAY.SHORT);
    }

    console.log('[社区] 浏览完成');
}

// ======================== 6. 砸金蛋 ========================
function smashGoldenEgg() {
    console.log('[砸金蛋] 开始');
    goToVivoSpaceHome();

    // 进入积分页面
    desc('我的').findOne().click();
    sleep(CONFIG.DELAY.SHORT);
    id('ll_jifen').click();
    sleep(CONFIG.DELAY.LONG);

    // 点击积分页轮播图进入砸金蛋活动
    const carousel = desc(CONFIG.CAROUSEL_DESC).findOne(CONFIG.DELAY.VERY_LONG);
    if (carousel) {
        carousel.click();
        sleep(CONFIG.DELAY.VERY_LONG);
        clickEggRecursive();
    } else {
        console.log('[砸金蛋] 未找到活动入口');
    }
}

function clickEggRecursive() {
    const node = textMatches(/剩余\d+次抽奖机会/).findOne(CONFIG.DELAY.LONG);
    if (!node) {
        console.log('[砸金蛋] 未找到剩余次数信息');
        back();
        return;
    }

    const match = node.text().match(/\d+/);
    const remaining = match ? parseInt(match[0]) : 0;

    if (remaining > 0) {
        // 查找可点击的金蛋
        const eggs = className('android.widget.TextView').find();
        for (let i = 0; i < eggs.length; i++) {
            const egg = eggs[i];
            if (egg.clickable() && egg.indexInParent() === 1) {
                console.log('[砸金蛋] 第 ' + remaining + ' 次，点击金蛋');
                egg.click();
                sleep(CONFIG.DELAY.LONG);

                // 关闭弹窗
                if (text('我知道了').exists()) {
                    text('我知道了').findOne().click();
                    sleep(CONFIG.DELAY.LONG);
                }
                break;
            }
        }
        // 递归继续砸
        clickEggRecursive();
    } else {
        console.log('[砸金蛋] 次数已用完');
        back();
    }
}

// ======================== 7. 积分商城 - 浏览赚积分 ========================
function browseForPoints() {
    console.log('[积分] 开始浏览赚积分');
    goToVivoSpaceHome();

    // 进入我的 -> 积分
    desc('我的').findOne().click();
    sleep(CONFIG.DELAY.SHORT);

    // id("tv_points_text").findOne().click();

    id('ll_jifen').findOne().click();
    sleep(CONFIG.DELAY.LONG);


    // 进入积分商城
    text('积分商城').findOne().click();
    sleep(CONFIG.DELAY.MEDIUM);
    text('赚积分').findOne().click();
    sleep(CONFIG.DELAY.SHORT);
    // 领积分
    getPoints();
    sleep(CONFIG.DELAY.SHORT);

    // 筛选有"去获取"按钮的应用
    const appsWithGet = [];
    for (let i = 0; i < CONFIG.ALL_APPS.length; i++) {
        const appName = CONFIG.ALL_APPS[i];
        try {
            const parent = text(appName).findOne().parent();
            if (parent && parent.children().length == 4) {
                appsWithGet.push(appName);
            }
        } catch (e) {
            console.log('[积分] 获取 "' + appName + '" 状态失败');
        }
    }

    console.log('[积分] 可浏览应用: ' + appsWithGet.join(', '));
    browseAppsIntegral(appsWithGet);
}

function browseAppsIntegral(appList) {
    for (let i = 0; i < appList.length; i++) {
        const appName = appList[i];
        try {
            console.log('[积分] 浏览: ' + appName);
            text(appName).findOne().click();
            sleep(CONFIG.DELAY.VERY_LONG);

            switch (appName) {
                case '游戏中心':
                    back();
                    sleep(CONFIG.DELAY.SHORT);
                    back();
                    break;
                case '音乐':
                    back();
                    break;
                case '智慧生活':
                    back();
                    sleep(CONFIG.DELAY.SHORT);
                    back();
                    break;
                case '小游戏':
                    if (id('btn_sign_in').exists()) {
                        id('btn_sign_in').findOne().click();
                        sleep(CONFIG.DELAY.SHORT);
                    }
                    app.launch(CONFIG.PACKAGES.VIVO_SPACE);
                    break;
                default:
                    app.launch(CONFIG.PACKAGES.VIVO_SPACE);
                    break;
            }
        } catch (e) {
            console.log('[积分] 浏览 "' + appName + '" 出错: ' + e.message);
        }
    }
    console.log('[积分] 浏览赚积分完成');
}

// ======================== 9. 领积分 ========================


function getPoints() {
    const arr = text('领取积分').find();
    if (arr.length > 0) {
        console.log('[领积分] 找到 ' + arr.length + ' 个可领取项');
        text('领取积分').findOne().click();
        sleep(CONFIG.DELAY.SHORT);
        getPoints(); // 递归领取
    }
}

// ======================== 10. vivo 社区签到 + 每日签到 ========================
function vivoCommunitySign() {
    console.log('[vivo社区] 开始签到');
    app.launch(CONFIG.PACKAGES.VIVO_CLUB);
    sleep(CONFIG.DELAY.EXTRA_LONG);

    // 等待文章加载
    let articles = id('textPicVideoTotalView').find();
    let retryCount = 0;
    while (articles.length <= 4 && retryCount < 10) {
        console.log('[vivo社区] 文章数量不足(' + articles.length + ')，等待中...');
        sleep(2000);
        articles = id('textPicVideoTotalView').find();
        retryCount++;
    }

    // 阅读 + 点赞
    for (let i = 0; i < CONFIG.COMMUNITY_ARTICLE_COUNT; i++) {
        sleep(CONFIG.DELAY.LONG);
        articles[i].click();
        sleep(CONFIG.DELAY.MEDIUM);

        // 点赞
        const likeBtn = id('btn_praise').findOne();
        if (likeBtn) {
            likeBtn.click();
        }

        // 最后一篇评论
        if (i === CONFIG.COMMUNITY_ARTICLE_COUNT - 1) {
            const replyBtn = id('tv_reply').findOne();
            if (replyBtn) {
                replyBtn.click();
                sleep(CONFIG.DELAY.LONG);
                const editBox = id('edt_reply').findOne();
                if (editBox) {
                    editBox.setText(CONFIG.COMMENT_TEXT);
                    sleep(CONFIG.DELAY.SHORT);
                    const sendBtn = id('btn_send_reply').findOne();
                    if (sendBtn) {
                        sendBtn.click();
                        sleep(CONFIG.DELAY.MEDIUM);
                        console.log('[vivo社区] 评论完成');
                    }
                }
            }
        }

        back();
        sleep(CONFIG.DELAY.SHORT);
    }

    console.log('[vivo社区] 阅读+点赞完成');

    // ========== 每日签到（在 com.vivo.club 内） ==========
    console.log('[签到] 开始每日签到');

    // 打开签到面板
    const coinView = id('mainBottTabVCoinView').findOne();
    if (coinView) {
        coinView.click();
        sleep(CONFIG.DELAY.MEDIUM);
    }

    // 签到按钮
    if (id('everySignDaySignBtn').exists()) {
        id('everySignDaySignBtn').findOne().click();
        sleep(CONFIG.DELAY.MEDIUM);
        console.log('[签到] 签到成功');
    } else {
        console.log('[签到] 未找到签到按钮，可能已签过');
    }


    // 免费抽奖
    if (desc('点击抽奖本次免费').exists()) {
        desc('点击抽奖本次免费').findOne().click();
        console.log('[签到] 免费抽奖完成');
    }
}

// ======================== 主流程 ========================
function main() {
    try {
        // 1. 权限检查
        checkPermissions();

        // 2. 启动前置 App
        // launchPreApps();

        // 3. 进入 vivo 空间，执行所有操作
        app.launch(CONFIG.PACKAGES.VIVO_SPACE);
        sleep(CONFIG.DELAY.APP_LAUNCH);

        // // 3.1 购物车操作
        // clearCart();
        // sleep(CONFIG.DELAY.SHORT);
        // addToCart();

        // // 3.2 社区浏览
        // communityBrowse();

        // // 3.3 砸金蛋
        // smashGoldenEgg();

        // 3.4 积分商城浏览
        browseForPoints();

        // 4. vivo 社区签到 + 每日签到（独立App）
        // vivoCommunitySign();

        console.log('=== 签到全部完成 ===');
    } catch (e) {
        console.log('[错误] 脚本异常: ' + e.message);
        console.log(e.stack);
    } finally {
        exit();
    }
}

// 执行主流程
main();
