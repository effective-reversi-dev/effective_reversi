export const minutesWithZero = (minutes) => {
    if(minutes.toString().length === 1) {
        minutes = '0' + minutes;
    }
    return minutes;
};
