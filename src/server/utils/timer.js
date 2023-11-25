
class Timer {

    static startTimer() {
        if (!Timer.instance) {
            Timer.instance = new Timer();
        }
        this.start = new Date().getTime()
        return Timer.instance;
    }

    static endTimer() {
        this.end = new Date().getTime();
        return this.end - this.start;
    }
}

module.exports = Timer;