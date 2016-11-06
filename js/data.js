/*
This file holds the structure of the data and manages it. This program can take two paths:
    * The data came from the cookies.
    * There was no data on the cookies.

For the first, the structured Data used dor it is Data_(), for the other is Data().
They have mainly the same structures, but when a function has _ on it, is to deal 
with the data that came from the cookies.

*/


/*
Hash of the value each paper can have
*/
var MENCAO = {
    "CC" : -3, //Received points e.g. got this paper from test/other plae
    "TR" : -2, // Locked course without justifying
    "TJ" : -1, // Locked course justifying
    "SR" : 0, 
    "II" : 1,
    "MI" : 2,
    "MM" : 3,
    "MS" : 4,
    "SS" : 5
}

//Instance of paper.
function Paper(credits, grade) {
    this.credits = credits;
    this.grade = grade;
}

//Instance of semester from cookie.
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
        this.tr = 0;
        var self = this;
        this.papers.forEach( function (item, index) {
            if(item.grade >=  0) {
                self.upPart +=  item.grade * item.credits * self.Pei;
                self.downPart +=  item.credits * self.Pei;
                self.papersSum++;
            } else if (item.grade === -1) {
                self.papersSum++;
            }else if (item.grade === -2) {
                self .tr++;
                self.papersSum++;
            }
        });
        console.log("Calc Contr2: " + this.upPart + "~" + this.downPart);
    }
    this.removePaper = function(index) {
        papers.splice(index,1);
    }
    //
    this.calcContrib();
}

//Instance of semester.
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
            if(item.grade >=  0) {
                self.upPart +=  item.grade * item.credits * self.Pei;
                self.downPart +=  item.credits * self.Pei;
                self.papersSum++;
            } else if (item.grade === -1) {
                self.papersSum++;
            }else if (item.grade === -2) {
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

//Instance of data from the cookies.
function Data_(data) {
    this.semesters = [];
    this.papersSum = data.papersSum;
    this.trOpt = data.trOpt;
    this.trObg = data.trObg;
    this.tran = data.tran;
    this.IRA = data.IRA ;
    var self = this;
    
    //setup slider
    document.getElementById("slider").max = this.tran;
    $('#t_tr').html(this.tran);
    $('#t_ob').html(this.trObg);
    $('#t_opt').html(this.trOpt);
    var elem = document.getElementById("slider");
    elem.value = this.tran - this.trOpt;
    
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
        this.tran = 0;
        var self = this;
        this.semesters.forEach( function (sem) {
            sumUp += sem.upPart;
            sumDown += sem.downPart;
            self.papersSum += sem.papersSum;
            self.tran += sem.tr;
        });
        this.IRA = (1 - (0.6 * this.trObg + 0.4 * this.trOpt) / this.papersSum) * (sumUp / sumDown);
        console.log("Obg: " + this.trObg + "Opt: " + this.trOpt + "Obg: ");
        setCookie(JSON.stringify(DATA), 360);
        $('#IRA').text(this.IRA.toFixed(4));
        document.getElementById("slider").max = this.tran;
        $('#t_tr').html(this.tran);
        this.trObg = parseInt($('#slider').val());
        $('#t_ob').html(this.trObg);
        this.trOpt = this.tran - this.trObg;
        $('#t_opt').html(this.trOpt);
    }
    this.removeSemester = function(index) {
        semesters.splice(index,1);
    }
}

//Instance o Data.
function Data() {
    this.semesters = [];
    this.papersSum = 0;
    this.trOpt = 0;
    this.trObg = 0;
    this.tran = 0;
    this.IRA = 0;
    //METHODS
    this.calcIRA = function() {
        var sumUp = 0;
        var sumDown = 0;
        this.papersSum = 0;
        var self = this;
        this.semesters.forEach( function (sem) {
            sumUp += sem.upPart;
            sumDown += sem.downPart;
            self.papersSum += sem.papersSum;
            self.tran += sem.tr;
        });
        this.IRA = (1 - (0.6 * this.trObg + 0.4 * this.trOpt) / this.papersSum) * (sumUp / sumDown);
        setCookie(JSON.stringify(DATA), 360);
        $('#IRA').text(this.IRA.toFixed(4));
        document.getElementById("slider").max = this.tran;
        $('#t_tr').html(this.tran);
        this.trObg = parseInt($('#slider').val());
        $('#t_ob').html(this.trObg);
        this.trOpt = this.tran - this.trObg;
        $('#t_opt').html(this.trOpt);
    }
    this.removeSemester = function(index) {
        semesters.splice(index,1);
    }
}