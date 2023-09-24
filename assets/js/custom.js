const BIRTH_YEAR = 1991;
const START_WORKING_YEAR = 2013;

const currentYear = new Date().getFullYear();

$(document).ready(function () {
    $(".data-birthYear").text(BIRTH_YEAR);
    $(".data-age").text(currentYear - BIRTH_YEAR);
    $("#data-experienceYears").attr("data-purecounter-end", currentYear - START_WORKING_YEAR);
    $(".data-currentYear").text(currentYear);

    // Initiate Pure Counter js
    PureCounter();
});