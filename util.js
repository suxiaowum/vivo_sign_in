export default {

    backTime(sleepTime) {
        let remaining = Math.ceil(sleepTime / 1000);
        console.log("等待 " + remaining + " 秒...");
        while (remaining > 0) {
            sleep(1000);
            remaining--;
            if (remaining > 0) {
                console.log("剩余 " + remaining + " 秒...");
            }
        }
    }
}