const BIRTH_YEAR = 1991;
const START_WORKING_YEAR = 2013;
const END_DATE = "2081/01/01";

const currentYear = new Date().getFullYear();

$(document).ready(function () {
    $(".data-birthYear").text(BIRTH_YEAR);
    $(".data-age").text(currentYear - BIRTH_YEAR);
    $("#data-experienceYears").attr("data-purecounter-end", currentYear - START_WORKING_YEAR);
    $("#date-remainDays").attr("data-purecounter-end", dateDiffInDays(new Date(), new Date(END_DATE)));

    // Initiate Pure Counter js
    PureCounter();
});

// Calculate the number of days between 2 dates
function dateDiffInDays(date1, date2) {
    // round to the nearest whole number
    return Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
}
