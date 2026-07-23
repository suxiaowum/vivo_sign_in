/**
 * 国家电网签到脚本
 */


app.launch("com.sgcc.wsgw.cn");
sleep(3000);

let btn = desc('签到').findOne();
if (btn) {
    let bounds = btn.bounds();
    let x = bounds.centerX();
    let y = bounds.centerY();
    click(x, y);
}

checkSpecialDate();

// ======================== 悬浮窗强提醒 ========================

// ======================== 特殊日期检查 ========================
function checkSpecialDate() {
    const today = new Date();
    const day = today.getDate();
    const specialDays = [8, 15, 21, 28];

    if (specialDays.includes(day)) {
        console.log('[特殊日期] 今天是' + day + '号，建议抽奖');
        toast(
            '今天是' + day + '号，记得抽奖！'
        );
       
    }
}
