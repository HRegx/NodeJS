// 'use strict';

// const fs = require('fs');

// let student = { 
//     name: 'Mike',
//     age: 23, 
//     gender: 'Male',
//     department: 'English',
//     car: 'Honda' 
// };
 
// let data = JSON.stringify(student);
// fs.writeFileSync('student-2.json', data);

'use strict';

const fs = require('fs');

fs.readFile('student-2.json', (err, data) => {
    if (err) throw err;
    let student = JSON.parse(data);
    console.log(student);
});

console.log('This is after the read call');