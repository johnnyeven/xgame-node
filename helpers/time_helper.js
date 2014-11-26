/**
 * 秒数格式化输出
 * @param time 秒数
 * @param format 格式化字符串
 * - %s 秒
 * - %m 分
 * - %h 小时
 * - %d 天数
 */
exports.format = function(time, format) {
    if(time > 0) {
        if(!format) format = '%s';
        var days = 0, hours = 0, minutes = 0, seconds = 0;

        days = parseInt(time / 86400);
        time = time % 86400;
        hours = parseInt(time / 3600);
        time = time % 3600;
        minutes = parseInt(time / 60);
        seconds = time % 60;

        return format.replace('%s', seconds).replace('%m', minutes).replace('%h', hours).replace('%d', days);
    }
};

exports.format_count_down = function(time) {
    var time_format;
    if(time >= 86400) {
        time_format = exports.format(time, '%d 天 %h:%m:%s');
    } else if(time >= 3600) {
        time_format = exports.format(time, '%h:%m:%s');
    } else if(time >= 60) {
        time_format = exports.format(time, '%m 分 %s 秒');
    } else if(time == 0) {
        time_format = '请稍后...';
    } else {
        time_format = exports.format(time, '%s 秒');
    }
    return time_format;
};