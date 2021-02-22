function mergeArrData() {
    arrData[1] = arrData[1].match(/(?:[^,"]+|"[^"]*")+/g);
    let firstCourse = arrData[1][SUBJECT] + arrData[1][COURSE], currCourse;
    arrData[1] = arrData[1].join();
    for (let first = 1, curr = 1; first < arrData.length; curr++) {
        if (curr < arrData.length) {
            arrData[curr] = arrData[curr].match(/(?:[^,"]+|"[^"]*")+/g);
            for (let i = 0; i < arrData[curr].length; i++) {
                arrData[curr][i] = arrData[curr][i].replace(/["]+/g, "");
            }
        }
        else {
            arrSortedData.push(arrData.slice(first, curr));
            break;
        }
        if ((currCourse = arrData[curr][SUBJECT] + arrData[curr][COURSE]) != firstCourse) {
            arrSortedData.push(arrData.slice(first, curr));
            first = curr;
            firstCourse = arrData[first][SUBJECT] + arrData[first][COURSE];
        }
    }
}