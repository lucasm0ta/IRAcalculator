var MENCAO = {
    "CC" : -3,
    "TR" : -2,
    "TJ" : -1,
    "SR" : 0,
    "II" : 1,
    "MI" : 2,
    "MM" : 3,
    "MS" : 4,
    "SS" : 5
}
function Paper(credits, grade) {
    this.credits = credits;
    this.grade = grade;
}
function Semester_(sem) {
    this.numOfPapers = sem.numOfPapers;
    this.papers = [];
    this.upPart = sem.upPart;
    this.downPart = sem.downPart;
    this.papersSum = sem.papersSum;
    this.tr = sem.tr;
    this.Pei = sem.Pei; //semester weight
    var self = this;
    sem.papers.forEach( function (paper) {
        self.papers.push(new Paper(paper.credits, paper.grade));
    });
    
    //METHODS
    this.addPaper = function (credits, grade) {
        this.papers.push(new Paper(credits, grade));
        this.numOfPapers++;
    }
    this.calcContrib = function() {
        this.papersSum = 0;
        this.upPart = 0;
        this.downPart = 0;
        var self = this;
        this.papers.forEach( function (item, index) {
            self.upPart += item.grade * item.credits * self.Pei;
            self.downPart += item.credits * self.Pei;
            self.papersSum++;
        });
        console.log("Calc Contr2: " +this.upPart +"~"+this.downPart);
    }
    this.removePaper = function(index) {
        papers.splice(index,1);
    }
    //
    this.calcContrib();
}
function Semester(Pei) {
    this.numOfPapers = 0;
    this.papers = [];
    this.upPart = 0;
    this.downPart = 0;
    this.papersSum = 0;
    this.tr = 0;
    this.Pei = Pei; //semester weight
    //METHODS
    this.addPaper = function (credits, grade) {
        this.papers.push(new Paper(credits, grade));
        this.numOfPapers++;
    }
    this.calcContrib = function() {
        this.papersSum = 0;
        this.upPart = 0;
        this.downPart = 0;
        var self = this;
        this.papers.forEach( function (item, index) {
            if(item.grade >= 0) {
                self.upPart += item.grade * item.credits * self.Pei;
                self.downPart += item.credits * self.Pei;
                self.papersSum++;
            } else if (item.grade == -1) {
                self.papersSum++;
            }else if (item.grade == -2) {
                self .tr++;
                self.papersSum++;
            }
        });
        console.log("Calc Contr: " +this.upPart +"~"+this.downPart);
    }
    this.removePaper = function(index) {
        papers.splice(index,1);
    }
}
function Data_(data) {
    this.semesters = [];
    this.papersSum = data.papersSum;
    this.trOpt = data.trOpt ;
    this.trObg = data.trObg ;
    this.IRA = data.IRA ;
    var self = this;
    
    data.semesters.forEach(function (sem, index) {
        var Pei = sem.Pei;
        self.semesters.push(new Semester_(sem));
        $('#add_semester').parent().before('<div class="sem_wrap"><table class="semester"><thead><tr><td class="nth_sem" colspan="2">' + ($('.semester').length+1) + 'º Semestre</td><td class="del_s">X</td></tr><tr class="sem_data"><td>Creditos</td><td>Menção</td></tr><tbody><tr class="add_row"><td colspan="3"><div>+</div></td></tr></tbody></table></div>');
        sem.papers.forEach(function (paper){
            $(".sem_wrap:eq("+index+")").find(".add_row").before('<tr class="paper"><td><input class="credits" type="number" maxlength="2" min="1" max="10" value="'+paper.credits+'"></td><td><input class="grade" type="text" maxlength="2" value="'+getKey(paper.grade)+'"></td><td><div class="del_p">X</div></td></tr>');
        });
    });
    
    //METHODS
    this.calcIRA = function() {
        var sumUp = 0;
        var sumDown = 0;
        this.papersSum = 0;
        var self = this;
        this.semesters.forEach( function (paper) {
            sumUp += paper.upPart;
            sumDown += paper.downPart;
            self.papersSum += paper.papersSum;
        });
        this.IRA = (1 - (0.6 * this.trObg + 0.4 * this.trOpt) / this.papersSum) * (sumUp / sumDown);
        setCookie(JSON.stringify(DATA), 360);
        $('#IRA').text(this.IRA.toFixed(4));
    }
    this.removeSemester = function(index) {
        semesters.splice(index,1);
    }
}
function Data() {
    this.semesters = [];
    this.papersSum = 0;
    this.trOpt = 0;
    this.trObg = 0;
    this.IRA = 0;
    //METHODS
    this.calcIRA = function() {
        var sumUp = 0;
        var sumDown = 0;
        this.papersSum = 0;
        var self = this;
        this.semesters.forEach( function (paper) {
            sumUp += paper.upPart;
            sumDown += paper.downPart;
            self.papersSum += paper.papersSum;
        });
        this.IRA = (1 - (0.6 * this.trObg + 0.4 * this.trOpt) / this.papersSum) * (sumUp / sumDown);
        setCookie(JSON.stringify(DATA), 360);
        $('#IRA').text(this.IRA.toFixed(4));
    }
    this.removeSemester = function(index) {
        semesters.splice(index,1);
    }
}
var DATA = new Data();  

var tran = 0; //numero de materias trancadas
var NEW_PAPER = '<tr class="paper"><td><input class="credits" type="number" maxlength="2" min="1" max="10" value="2"></td><td><input class="grade" type="text" maxlength="2" value="MM"></td><td><div class="del_p">X</div></td></tr>';

$(document).ready( function () {
    start();
});
//var loop = setInterval(calculate, 100);
function addSemester() {
    var Pei = $('.sem_wrap').length + 1;
    DATA.semesters.push(new Semester(Pei));
    DATA.calcIRA();
    return $('#add_semester').parent().before('<div class="sem_wrap"><table class="semester"><thead><tr><td class="nth_sem" colspan="2">' + ($('.semester').length+1) + 'º Semestre</td><td class="del_s">X</td></tr><tr class="sem_data"><td>Creditos</td><td>Menção</td></tr><tbody><tr class="add_row"><td colspan="3"><div>+</div></td></tr></tbody></table></div>');
}

function addPaper(sem, credits, grade) {
    var semIdx = sem.index();
    DATA.semesters[semIdx].addPaper(credits, grade);
    DATA.semesters[semIdx].calcContrib();
    DATA.calcIRA();
    var pos = sem.find(".add_row");
    return $(NEW_PAPER).insertBefore(pos);
}

function start() {
    //checks in cookies
    var ck = loadCookies();
    if (ck != false) {
        DATA = new Data_(JSON.parse(ck));
        DATA.calcIRA();
    }
    //Comes in the HTML
    
    //add paper
    $(document).on('click', '.add_row', function () {
        addPaper($(this).parent().parent().parent(), 2, 3);
        console.log("Added paper");
    });
    
    //add semester
    $('#add_semester').click( function () {
        addSemester();
        console.log("Added semester");
    });
    
    //delete paper
    $(document).on('click', '.del_p', function () {
        var semIdx = $(this).parent().parent().parent().parent().parent().index();
        var papIdx = $(this).parent().parent().index();
        DATA.semesters[semIdx].papers.splice(papIdx,1);
        DATA.semesters[semIdx].numOfPapers--;
        DATA.semesters[semIdx].calcContrib();
        DATA.calcIRA();
        $(this).parent().parent().remove();
        console.log("Deleted paper");
    });
    
    //delete semester
    $(document).on('click', '.del_s', function () {
        //pegar qua elemento é esse e recalcular
        var semIdx = $(this).parent().parent().parent().parent().index();
        DATA.semesters.splice(semIdx, 1);
        DATA.calcIRA();
        $(this).parent().parent().parent().parent().remove();
        console.log("Deleted semester");
    });
    
    //check if credits change to recalculate
    $(document).on('change keyup paste', '.credits', function(e) {
        var semIndex = $(this).parent().parent().parent().parent().parent().index();
        var paperIndex = $(this).parent().parent().index();
        var credits = parseInt(($(this).val()).trim());
        console.log("Change Cr: "+semIndex +"~"+paperIndex);
        if (isNaN(credits)) {
            console.log("RED" + aux.length );
            $(this).css("background-color","#dd4f59");
        } else {
            $(this).css("background-color","#4c293c");
            DATA.semesters[semIndex].papers[paperIndex].credits = credits;
            DATA.semesters[semIndex].calcContrib();
            DATA.calcIRA();
        }
    });
    //check if grade change to recalculate
    $(document).on('change keyup paste', '.grade', function(e) {
        var semIndex = $(this).parent().parent().parent().parent().parent().index();
        var paperIndex = $(this).parent().parent().index();
        var grade = getValue($(this).val());
        if (grade !== false) {
            $(this).css("background-color","#4c293c");
            DATA.semesters[semIndex].papers[paperIndex].grade = grade;
            DATA.semesters[semIndex].calcContrib();
            DATA.calcIRA();
        } else {
            console.log("RED");
            $(this).css("background-color","#dd4f59");
        }
        console.log("Changed Grade");
    });
    
    //remove all semesters
    $('#del_all').click( function () {
        removeItem("IRAcalc");
        DATA = new Data();
        $(".sem_wrap").remove();
    });
}

function calculate() {
    var DC = 0; //Numero de disciplinas matriculado(inclundo trancadas)
    var DTb = 0; //Obrigatorias Trancadas
    var DTp = 0; //Optativas Trancadas
    tran = 0;
    var IRA = 0;
    var sumUp = 0;
    var sumDown = 0;
    // IRA = (1-(0.6*DTb + 0.4*DTp)/DC) * SUM(Pi*CRi*Pei)/SUM(CRi*Pei)

    var credits = $(".credits");
    //caso de numero de creditos inválidos
    credits.each( function (index, value){
        var aux = "";
        aux = $(value).val();
        if (isNaN(aux) && aux) {
            $(value).css("background-color","#dd4f59");
        } else {
            $(value).css("background-color","#4c293c");
        }
    });
    
    var grade = $(".grade");
    //caso de numero de creditos inválidos.
    grade.each( function (index, value){
        var aux = "";
        aux = $(value).val();
        if ((getKey ($(value).val()) === false) && aux) {
            // console.log(aux +"|");
            $(value).css("background-color","#dd4f59");
        } else {
            $(value).css("background-color","#4c293c");
        }
    });

    var reductor = 0; //reduz indice se semestre tem valor 0
    //Itera cada semetre e recalcula tudo.
    
    $( ".semester" ).each( function( index, value ) {
        var Pi; //Peso da menção
        var Pei = index+1-reductor <= 6 ? index+1-reductor : 6; //Peso da disciplina
        var CRi; //Credito de uma determinada disciplina
        var credits = $(value).find('.credits');
        var grades = $(value).find('.grade');
        var valid = 0;
        if(reductor == 1) {
            // reductor++;
        }
        // console.log("Reductor: " + reductor + " Idx: " + Pei);
        $(credits).each( function(index) {
            var auxPi = getKey($(grades[index]).val());
            var auxCRi = parseInt($(credits[index]).val());
            // console.log(auxPi+"~"+auxCRi);

            if (auxPi !== false) {
                Pi = auxPi;
                CRi = auxCRi;
                if ( CRi > 0 && Pi >-3){
                    DC++;
                    if (Pi >= 0) {
                        // console.log(CRi + " " + Pi + " " + Pei);
                        sumUp += Pi * CRi * Pei;
                        sumDown += CRi * Pei;
                    } else if (Pi == -2){
                        tran++;
                    } else if(Pi === -3) {
                        DC--;
                    }
                    valid++;
                } else if (Pi === -3){
                    valid = 0;
                    // console.log("Deu Ruim "+ CRi +" "+ Pi );
                }
            }
        });
    });
    
    //change slider values
    document.getElementById("slider").max = tran;
    $('#t_tr').html(tran);
    DTb = $('#slider').val();
    $('#t_ob').html(DTb);
    DTp = tran - DTb;
    $('#t_opt').html(DTp);

    
    // console.log(DTb + " " + DC + " " + sumUp + " " + sumDown);
    if (sumDown > 0) {
        IRA = (1 - (0.6 * DTb + 0.4 * DTp)/DC) * (sumUp / sumDown);
    }
    if(!isNaN(IRA)) {
        $('#IRA').text(IRA.toFixed(4));
    }
    updateSemesterLabel();
    // console.log("Trancamentos: " + tran);

}

function updateSemesterLabel()
{
    // console.log(IRA);
    $('.nth_sem').each( function( index, value ) {
        $(value).html((index+1) +"º Semestre");
    });
}

function getKey(key){
    var flag=false;
    var val;
    for (KEY in MENCAO){
         if (MENCAO[KEY] === key){
             flag=true;
             val=KEY;
             break;
         }
    }
    if(flag){
         return val;
    }
    else{
         return false;
    }
}

function getValue(value){
    var flag=false;
    var keyVal;
    for (key in MENCAO){
         if (key === value.toUpperCase()){
             flag=true;
             keyVal=MENCAO[key];
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

function setCookie(cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = "";
    document.cookie = "IRAcalc" + "=" + cvalue + "; " + expires;
}
function loadCookies() {
    var name = "IRAcalc=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return false;
}
function removeItem(sKey, sPath, sDomain) {
    document.cookie = encodeURIComponent(sKey) + 
                  "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + 
                  (sDomain ? "; domain=" + sDomain : "") + 
                  (sPath ? "; path=" + sPath : "");
}

