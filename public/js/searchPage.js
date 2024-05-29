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
    if (data.length == 0) {
        dt.fnClearTable();
        return;
    }
    dt.fnAddData(data);
    // addEvents();
}

const getAnalysers = async () => {
    // console.log("Getting Analysers");
    await request(`/api/v1/analysers/${$('#testType').val()}/${$("#testName").val()}`, 'GET')
        .then(data => {
            let options = "<option value='' selected disabled>--- Select an Analyser ---</option>";
            let unique = {};
            data.forEach(analyser => {
                const make = analyser.split(' ')[0]
                if (make.toLowerCase() == "no" || make.toLowerCase()=='') 
                    return;
                unique[make] = make;
            })
            for (let analyser in unique) {
                options += `<option value='${analyser}'>${analyser}</option>`
            }
            $("#analysers").html(options);
        }).catch(err => {
            console.log(err)
        })
}

let tests = [];
let tablesDrawn = false;

const presentTests = () => {
    let options = tests.filter((test) => {
        return test.type == $('#testType').val();
    }).map((test, index) => {
        return `<option value="${test._id}">${index + 1}. ${test.name}</option>`
    })
    $("#testName").html(`<option value=""disabled selected> </option>
    ${options.join('')}`);
    $("#onlyAnalyser").removeAttr("disabled");
    $("#testName").removeAttr("disabled");
    if(!document.getElementById("onlyAnalyser").checked){
        //console.log("not checked")
        $("#ageGroup").removeAttr("disabled");
        $("#country").removeAttr("disabled");
        $("#analysers").attr("disabled", "true");
    }
}

$(document).ready(async function () {
    await request('/api/v1/tests', 'GET').then(data => {
        tests = data;
    }).catch(err => {
        console.log(err)
    })

    if ($('#testType').val() == 'chemical' || $('#testType').val() == 'hematology') {
        presentTests();
    }

    $("#onlyAnalyser").change(async function (e) {
        e.preventDefault();
        if (!document.getElementById("onlyAnalyser").checked) {
            $("#ageGroup").removeAttr("disabled");
            $("#country").removeAttr("disabled");
            $("#analysers").attr("disabled", "true");
            return;
        }
        if ($("#testName").val() == null || $("#testName").val() == "") {
            alert('Select Test First!!');
            $("#onlyAnalyser").prop("checked", false);
            return;
        }

        $("#ageGroup").attr("disabled", "true");
        $("#country").attr("disabled", "true");
        $("#analysers").removeAttr("disabled");

        getAnalysers();
    });

    $('.select2-base').select2();
});

$('#testType').on('select2:select', function (e) {
    presentTests();
});

$('#testName').on('select2:select', function (e) {
    for (let test of tests) {
        if (test._id == $("#testName").val()) {
            // $("#siUnitLabel").html(`${test.si} (SI Unit)`);
            // $("#conventionalLabel").html(`${test.conventional || ""} (Conventional)`);
            if (document.getElementById("onlyAnalyser").checked) {
                getAnalysers();
            }
            break;
        }
    }
});

// GETTING THE DATA
$("#testForm").submit(async function (e) {
    e.preventDefault();
    let qry = {};
    if (!document.getElementById("onlyAnalyser").checked) {
        qry = {
            ageGroup: $("#ageGroup").val(),
            gender: 0,
            country: $("#country").val()
        }
    } else {
        qry = {
            analyser: $("#analysers").val()
        }
    }


    let response = await request(`/api/v1/data/${$('#testType').val()}/${$("#testName").val()}`, 'GET', qry)
        .then(data => {
            data.forEach(record => {
                // FIX LINK HERE
                if (!record['sampleSize']) record['sampleSize'] = 'N/A';
                record['link'] = `<a target="_blank" href="${record['link']}">
            ${record['reference']}
            </a>`
            })
            const maleData = data.filter(record => {
                return record.gender == 1;
            })
            const femaleData = data.filter(record => {
                return record.gender == 2;
            })
            for (let test of tests) {
                if (test._id == $("#testName").val()) {
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
            redrawTable('#maleRI', maleData)
            redrawTable('#femaleRI', femaleData)
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