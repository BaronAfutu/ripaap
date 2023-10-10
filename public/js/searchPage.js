const request = (url, method, data = {}) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: data,
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + $('#token').val()); },
            success: function (response) {
                resolve(response)
            },
            error: function (error) {
                reject(error);
            }
        });
    })
}
const redrawTable = (tableSelector, data) => {
    let dt = $(tableSelector).dataTable();
    dt.fnClearTable(false);
    if(data.length==0){
        dt.fnClearTable();
        return;
    }
    dt.fnAddData(data);
    // addEvents();
}
let tests = [];
let tablesDrawn = false;

$(document).ready(async function () {
    await request('/api/v1/tests', 'GET').then(data => {
        tests = data;
        options = data.map((option, index) => {
            return `<option value="${option.slug}">${index + 1}. ${option.name}</option>`
        })
        $("#testName").html(`<option value=""disabled selected> </option>
        ${options.join('')}`);
    }).catch(err => {
        console.log(err)
    })

    $('.select2-base').select2();
});

$('#testName').on('select2:select', function (e) {
    for (let test of tests) {
        if (test.slug == $("#testName").val()) {
            $("#siUnitLabel").html(`${test.si} (SI Unit)`);
            $("#conventionalLabel").html(`${test.conventional || ""} (Conventional)`);
            break;
        }
    }
});

$("#testForm").submit(async function (e) {
    e.preventDefault();


    let response = await request(`/api/v1/data/${$("#testName").val()}`, 'GET', {
        ageGroup: $("#ageGroup").val(),
        gender: 0,
        country: $("#country").val()
    }).then(data => {
        data.forEach(record=>{
            // FIX LINK HERE
            if(!record['sampleSize'])record['sampleSize'] = 'N/A';
            record['link'] = `<a target="_blank" href="${record['link']}">
            ${record['reference']}
            </a>`
        })
        const maleData = data.filter(record=>{
            return record.gender==1;
        })
        const femaleData = data.filter(record=>{
            return record.gender==2;
        })
        for (let test of tests) {
            if (test.slug == $("#testName").val()) {
                $("#displayTestName").html(test.name)
                break;
            }
        }


        if (!tablesDrawn) {
            $("#placeholder").hide();
            $("#resultTables").show();
            new DataTable('#maleRI', {
                aaData: maleData,
                columns: [
                    { data: 'ageGroup' },
                    { data: 'lrl' },
                    { data: 'url' },
                    { data: 'analyser' },
                    { data: 'sampleSize' },
                    { data: 'country' },
                    // { data: 'country' },
                    { data: 'link' },
                ],
                // columnDefs: [
                //     { orderable: false, targets: [3, 7] },
                //     { width: '150px', targets: 7 },
                // ],
                processing: true,
                lengthChange: true
            });
            new DataTable('#femaleRI', {
                aaData: femaleData,
                columns: [
                    { data: 'ageGroup' },
                    { data: 'lrl' },
                    { data: 'url' },
                    { data: 'analyser' },
                    { data: 'sampleSize' },
                    { data: 'country' },
                    // { data: 'country' },
                    { data: 'link' },
                ],
                // columnDefs: [
                //     { orderable: false, targets: [3, 7] },
                //     { width: '150px', targets: 7 },
                // ],
                processing: true,
                lengthChange: true
            });
            tablesDrawn = true;
            return;
        }
        redrawTable('#maleRI',maleData)
        redrawTable('#femaleRI',femaleData)
    }).catch(err => {
        console.log(err)
    })







    // new DataTable('#maleRI', {
    //     columnDefs: [
    //         { orderable: false, targets: [1, 2, 6] }
    //     ],
    //     "lengthChange": false,
    //     "searching": false,
    //     // order: [[1, 'asc']]
    //     // scrollY: 300,
    //     // paging: false
    // });

    return false;
});