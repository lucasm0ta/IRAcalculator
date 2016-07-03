# IRAcalculator

This is a calculator to make it simple to figure academic pontuation(IRA) for UnB students. It was made in Javascript and Jquery to make improvements in the interface. The color palette used was generated in https://coolors.co/ and the css was handmade.

It can be accessed in the following link: https://lucasm0ta.github.io/IRAcalculator/

##The IRA
The IRA is calculated using a 'simple' formula provided in the [Freshmen Manual of UnB](http://www.unb.br/administracao/decanatos/deg/downloads/index/guia_calouro_1_2015.pdf) by the formula:

IRA = (1 - (0.6 * DTb + 0.4 * DTp) / DC) * (SUM)((Pi * CRi * Pei) / (CRi * Pei))

where:
- DTb = Number of mandatory papers removed.
- DTp = Number of optional papers removed.
- DC = Number of coursed papers (including removed ones).
- Pi = Grade wheight.
- Pei = Semester which you coursed that paper(if it's after the 6th, consider it equals 6).
- CRi = Number of credits of the paper.

Pi = (SS=5, MS=4, MM=3, MI=2, II=1, SR=0)

Obs.: The SUM iterates through each paper.

This formula details doesn't specify some cases. For example:
- If you didn't coused a semester, does **Pei** keep counting?
- If you removed a paper with a valid justification(TJ), does **DC** counts that paper ?
- If you remove a paper whic is non mandatory nor optional, what happend ?

For some cases I found the answer by experience, but others keep unanswered.

##The Idea
I was very curious to find out what would be my next IRA and the formula doesn't cover all occurrences, and the only automated way was using a spreadsheet another student made. But it didn't covered the cases that happend in my academic record. SO I made one myself.


It can be accessed in the following link:
https://lucasm0ta.github.io/IRAcalculator/
