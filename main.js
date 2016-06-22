var mencao = {
    "TR" : -2,
    "TJ" : -1,
    "SR" : 0,
    "II" : 1,
    "MI" : 2,
    "MM" : 3,
    "MS" : 4,
    "SS" : 5
}
var row = '<tr class="paper"><td><input class="credits" type="number" maxlength="2" min="1" value="2"></td><td><input class="grade" type="text" maxlength="2" value="MM"></td><td><div class="del_sem">X</div></td></tr>';
$(document).ready( function () {
    start();
});
var x = setInterval(calculate, 100);
function start() {
    //div contenteditable
    $(document).on('click', '.add_row', function () {
        $(this).before(row);
    });
    $('#add_semester').click( function () {
        console.log("ue");
        $(this).before('<table class="semester"><thead><tr><td colspan="3">' + ($('.semester').length+1) + 'º Semestre</td></tr><tr><td>Creditos</td><td>Menção</td></tr><tbody>' + row + '<tr class="add_row"><td colspan="3"><div>+</div></td></tr></tbody></table>');
    });
    $('.table-remove').click(function () {
        $(this).parents('tr').detach();
    });
    // var x = setInterval(calculate(), 1000);
    /*$('#IRA').click( function () {
        calculate();
    });*/
}
function calculate() {
    var DC = 0; //Numero de disciplinas matriculado(inclundo trancadas)
    var DTb = 0; //Obrigatorias Trancadas
    var DTp = 0; //Optativas Trancadas
    var tran = 0;
    var IRA = 0;
    var sumUp = 0;
    var sumDown = 0;
    // IRA = (1-(0.6*DTb + 0.4*DTp)/DC) * SUM(Pi*CRi*Pei)/SUM(CRi*Pei)

    var aux = $(".credits");
    aux.each( function (index, value){
        var aux = "";
        aux = $(value).val();
        if (isNaN(aux) && aux) {
            $(value).css("background-color","red");
        } else {
            $(value).css("background-color","#ccc");
        }
    });
    aux = $(".grade");
    aux.each( function (index, value){
        var aux = "";
        aux = $(value).val();
        console.log(aux + "^");
        if ((getKey ($(value).val()) === false) && aux) {
            console.log(aux +"|");
            $(value).css("background-color","red");
        } else {
            $(value).css("background-color","#ccc");
        }
    });


    $( ".semester" ).each( function( index, value ) {
        var Pi; //Peso da menção
        var Pei = index+1 <= 6 ? index+1 : 6; //Peso da disciplina
        var CRi; //Credito de uma determinada disciplina
        var credits = $(value).find('.credits');
        var grades = $(value).find('.grade');
        $(credits).each( function(index) {
            Pi = getKey($(grades[index]).val());
            CRi = parseInt($(credits[index]).val());
            if ( CRi && Pi ){
                DC++;
                if (Pi >= 0) {
                    console.log(CRi + " " + Pi + " " + Pei);
                    sumUp += Pi * CRi * Pei;
                    sumDown += CRi * Pei;
                } else if (Pi === -2){
                    tran++;
                    DTp = tran; //só para testar
                    //TODO Fazer um slider entre obrigatorias trancadas e optativas
                }
            } else {
                console.log("Deu Ruim");
            }
        });
    });
     console.log(DTb + " " + DC + " " + sumUp + " " + sumDown);
    IRA = (1 - (0.6 * DTb + 0.4 * DTp)/DC) * (sumUp / sumDown);
    if(!isNaN(IRA)) {
        $('#IRA').text(IRA.toFixed(4));
    }
    console.log(IRA);
}
function getKey(value){
    var flag=false;
    var keyVal;
    for (key in mencao){
         if (key === value.toUpperCase()){
             flag=true;
             keyVal=mencao[key];
             break;
         }
    }
    if(flag){
         return keyVal;
    }
    else{
         return false;
    }
}