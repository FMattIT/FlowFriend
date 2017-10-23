/**
 * Created by Admin on 23.10.2017.
 */

function generateDays() {
   //generowanie tr i td i wypelnienie danymi
    //musze tu miec id miesiaca, roku, celu
    //po id miesiaca biore taile z bazy
    var goals;

    var months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    var days_in_month = ['31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
    var years = [];
    years.push(new Date().getFullYear());
    years.push(new Date().getFullYear()+1);
    years.push(new Date().getFullYear()+2);
}