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

$(document).ready( function () {
    start();
});

function start() {
    //div contenteditable
    $(document).on('click', '.add_row', function () {
        $(this).before('<tr><td><div contenteditable class="credits"> </div></td><td><div contenteditable class="grade"></div></td></tr>');
    });
    $('#add_semester').click( function () {
        console.log("ue");
        $(this).before('<table class="semester"><thead><tr><td colspan="2">' + ($('.semester').length+1) + 'º Semestre</td></tr><tr><td>Creditos</td><td>Menção</td></tr><tbody><tr><td><div contenteditable class="credits"></div></td><td><div contenteditable class="grade"></div></td></tr><tr class="add_row"><td colspan="2"><div>+</div></td></tr></tbody></table>');
    });
    $('#IRA').click( function () {
        calculate();
    });
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
        console.log($(value).html() + "~");
        if (isNaN($(value).html())) {
            $(value).css("background-color","red");
            console.log("NOOO");
        } else {
            $(value).css("background-color","#ccc");
        }
    });
    aux = $(".grade");
    aux.each( function (index, value){
        console.log($(value).html() + "~");
        if (!getKey ($(value).html())) {
            $(value).css("background-color","red");
            console.log("NOOO");
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
            Pi = getKey($(grades[index]).text());
            CRi = parseInt($(credits[index]).text());
            if ( CRi && Pi ){
                DC++;
                if (Pi >= 0) {
                    console.log(CRi + " " + Pi + " " + Pei);
                    sumUp += Pi * CRi * Pei;
                    sumDown += CRi * Pei;
                } else if (Pi == -2){
                    tran++;
                    DTp = tran; //só para testar
                    //TODO Fazer um slider entre obrigatorias trancadas e optativas
                }

                $(grades[index]).css("background-color","#ccc");
                $(credits[index]).css("background-color","#ccc");
            } else {
                $(grades[index]).css("background-color","red");
                $(credits[index]).css("background-color","red");
                console.log("Deu Ruim");
            }
        });
    });
     console.log(DTb + " " + DC + " " + sumUp + " " + sumDown);
    IRA = (1 - (0.6 * DTb + 0.4 * DTp)/DC) * (sumUp / sumDown);
    $('#IRA').text(IRA.toFixed(4));
    console.log(IRA);


}
function getKey(value){
    var flag=false;
    var keyVal;
    for (key in mencao){
         if (key == value.toUpperCase()){
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
