var tran = 0; //number of locked papers e.g TR|TJ

//Definig globals
var DATA = new Data();  
var NEW_PAPER = '<tr class="paper"><td><input class="credits" type="number" maxlength="2" min="1" max="10" value="2"></td><td><input class="grade" type="text" maxlength="2" value="MM"></td><td><div class="del_p">X</div></td></tr>';

//Startup.
$(document).ready( function () {
    start();
});

//Adds paper to DATA.
function addSemester() {
    var Pei = $('.sem_wrap').length + 1;
    DATA.semesters.push(new Semester(Pei));
    DATA.calcIRA();
    return $('#add_semester').parent().before('<div class="sem_wrap"><table class="semester"><thead><tr><td class="nth_sem" colspan="2">' + ($('.semester').length+1) + 'º Semestre</td><td class="del_s">X</td></tr><tr class="sem_data"><td>Creditos</td><td>Menção</td></tr><tbody><tr class="add_row"><td colspan="3"><div>+</div></td></tr></tbody></table></div>');
}

//Adds paper in the semester.
function addPaper(sem, credits, grade) {
    var semIdx = sem.index();
    DATA.semesters[semIdx].addPaper(credits, grade);
    DATA.semesters[semIdx].calcContrib();
    DATA.calcIRA();
    var pos = sem.find(".add_row");
    return $(NEW_PAPER).insertBefore(pos);
}

//Startup function.
function start() {
    //checks in cookies
    var ck = loadCookies();
    if (ck !== false) {
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

//Setup the label of the semester
function updateSemesterLabel()
{
    $('.nth_sem').each( function( index, value ) {
        $(value).html((index+1) +"º Semestre");
    });
}

//Get the key from the map MENCAO. See in data.js
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

//Get the value from the map MENCAO. See in data.js
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

//Setup cookie with the info.
function setCookie(cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = "";
    document.cookie = "IRAcalc" + "=" + cvalue + "; " + expires;
}

//Retrieve data from the cookie.
function loadCookies() {
    var name = "IRAcalc=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length,c.length);
        }
    }
    return false;
}

//Change slider value to the input.
function changeSliderVal(value) {
    DATA.trOpt = DATA.tran - value;
    DATA.trObg = value;
    $('#t_ob').html(DATA.trObg);
    $('#t_opt').html(DATA.trOpt);
    DATA.calcIRA();
}

//Remove all data from cookies.
function removeItem(sKey, sPath, sDomain) {
    document.cookie = encodeURIComponent(sKey) + 
                  "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + 
                  (sDomain ? "; domain=" + sDomain : "") + 
                  (sPath ? "; path=" + sPath : "");
}

