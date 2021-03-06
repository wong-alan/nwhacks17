const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

/*
let base_url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=3&dept='+'CPSC'
+'&course='+'110'
+'&sessyr='+'2017'
+'&sesscd='+'S';
*/
courses = [{
  dept: "CPSC",
  no: [100, 103, 110, 121, 210, 221 ,213, 310, 320, 313]
}, {
  dept: "MATH",
  no: [100, 101, 102, 103, 104, 105, 200, 221]
}, {
  dept: "ENGL",
  no: [110, 112]
}, {
  dept: "BIOL",
  no: [112, 121]
}, {
  dept: "PHYS",
  no: [100, 101, 102]
}, {
  dept: "CHEM",
  no: [111, 121]
}, {
  dept: "STAT",
  no: [200, 241, 302]
}];

let coursesList = {};

for (i = 0; i < courses.length; i++) {
  for (j = 0; j < courses[i].no.length; j++) {
    let base_url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=3&dept=' + courses[i].dept + '&course=' + courses[i].no[j].toString();
    axios.get(base_url).then((response) => {
      let $ = cheerio.load(response.data);
      let sections_exist = {};
      let sections = [];
      $('tr'/*, "'.section1'"*/).each((i, elm) => {
        if (($(elm).children().eq(1).text().trim() != "") && ($(elm).children().eq(5).text().trim() != "")){
          var section_name = $(elm).children().eq(1).text().trim();
          if (!(section_name in sections_exist)) {
            sections.push({
              name: section_name,
              activity: $(elm).children().eq(2).text().trim(),
              term: $(elm).children().eq(3).text().trim(),
              days: $(elm).children().eq(5).text().trim(),
              start_time: $(elm).children().eq(6).text().trim(),
              end_time: $(elm).children().eq(7).text().trim(),
              status: $(elm).children().eq(0).text().trim()
            });
            sections_exist[section_name] = 1;
          }
        }
      });
      // Remove first element in sections
      sections.shift();
      courseName = ((sections[0].name).split(" ").slice(0, 2).join(" ")).replace(/\s+/g, '');
      info = [courseName, sections];
      console.log(info);
      return (info);
    })
      .then((info) => {
        printCourses(info);
      });
  }
}

function printCourses(courses) {
  coursesList[info[0]] = info[1]
  fs.writeFile('./data/data.json', JSON.stringify(coursesList), 'utf8');
}