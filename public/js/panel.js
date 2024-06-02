let table = null;

const request = (url, method, data = {}) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: (method=="POST")?JSON.stringify(data):data,
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

const createSlug = (inputStr) => {
    // Remove special characters and replace spaces with dashes
    const slug = inputStr
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .trim() // Trim leading and trailing spaces
        .toLowerCase() // Convert to lowercase
        .replace(/\s+/g, '-'); // Replace spaces with dashes

    return slug;
}

const addEvents = () => {
    $(".make-admin").click(function (e) {
        e.preventDefault();
        $("#confirmAdminModal").attr('data-userid', $(this).attr('data-userid'));
    });
    $(".drop-admin").click(function (e) {
        e.preventDefault();
        // console.log('pressed')
        $("#dropAdminModal").attr('data-userid', $(this).attr('data-userid'));
    });
    $(".delete-test").click(function (e) {
        e.preventDefault();
        $("#deleteTestModal").attr('data-testid', $(this).parent().attr('data-testid'));
    });
    $(".edit-test").click(function (e) {
        e.preventDefault();
        $("#editTestModal").attr('data-testid', $(this).parent().attr('data-testid'));
        const cell = $(this).closest('tr').find('td');
        let editTestForm = document.forms['editTestForm'];

        editTestForm['editTestName'].value = cell[0].innerHTML;
        editTestForm['editTestType'].value = cell[1].innerHTML;
        editTestForm['editSi'].value = cell[2].innerHTML;
        editTestForm['editConventional'].value = cell[3].innerHTML;
    });
    $(".delete-data").click(function (e) {
        e.preventDefault();
        $("#deleteDataModal").attr('data-id', $(this).parent().attr('data-id'));
    });
    $(".edit-data").click(function (e) {
        e.preventDefault();
        $("#editDataModal").attr('data-id', $(this).parent().attr('data-id'));
        const cell = $(this).closest('tr').find('td');
        let editDataForm = document.forms['editDataForm'];

        editDataForm['editTestName'].value = cell[0].innerHTML;
        editDataForm['editTestType'].value = cell[1].innerHTML;
        editDataForm['editSi'].value = cell[2].innerHTML;
        editDataForm['editConventional'].value = cell[3].innerHTML;
    });
}

const redrawTable = (tableSelector, data) => {
    let dt = $(tableSelector).dataTable();
    dt.fnClearTable(false);
    if (data.length == 0) {
        dt.fnClearTable();
        return;
    }
    dt.fnAddData(data);
    table.page.len(-1).draw();
    addEvents();
    table.page.len(10).draw();
}


const drawUsersTable = async () => {
    if (!tables['#users'].drawn) {
        let data = await request('/api/v1/users', 'GET').then(data => {
            return data;
        }).catch(err => {
            console.log(err)
        })

        data.forEach((user) => {
            user['createdAt'] = new Date(user['createdAt']).toDateString();
            user['actions'] = `<div class="text-center"><button class="btn btn-outline-info py-0 rip-shadow make-admin" 
        data-userid="${user._id}" data-toggle="modal" data-target="#confirmAdminModal"><i class="fa fa-user-cog"></i> <small>Make Admin</small></button></div>`
        })

        table = new DataTable('#usersTable', {
            aaData: data,
            columns: [
                { data: 'title' },
                { data: 'firstName' },
                { data: 'lastName' },
                { data: 'email' },
                { data: 'institution' },
                { data: 'country' },
                { data: 'createdAt' },
                { data: 'actions' }],
            columnDefs: [
                { orderable: false, targets: [3, 7] },
                { width: '150px', targets: 7 },
            ],
            processing: true,
            lengthChange: false, //show [10] entries
            "pageLength": -1,
            // "lengthMenu": [ 10, 25, 50, 75, 100 ]
            // "searching": false,
            // order: [[1, 'asc']]
            // scrollY: 300,
            // paging: false
        });
        addEvents();
        tables['#users'].drawn = true;
        table.page.len(10).draw();

        // pagelength set to -1 allows for all rows to be visible in the rendered html.
        // this is required as rows that are not visible will not be affected by addEvents()
        // when the page length is limited. The resulting problem is, the action buttons
        // beyond the first pagelength rows will not have events added by the addEvent().
    }
}
const drawAdminsTable = async () => {
    if (!tables['#admins'].drawn) {
        let response = await request('/api/v1/admins', 'GET').then(data => {
            return data;
        }).catch(err => {
            console.log(err)
        })
        response.forEach((user) => {
            user['actions'] = `<div class="text-center">
            <button class="btn btn-outline-danger py-0 rip-shadow drop-admin"
                data-userid="${user._id}" data-toggle="modal"
                data-target="#dropAdminModal">
                <i class="fa fa-user-slash"></i> <small>Drop Admin</small>
            </button>
        </div>`
        })
        
        table = new DataTable('#adminsTable', {

            aaData: response,
            columns: [
                { data: 'title' },
                { data: 'firstName' },
                { data: 'lastName' },
                { data: 'email' },
                { data: 'institution' },
                { data: 'country' },
                { data: 'actions' }],
            columnDefs: [
                { orderable: false, targets: [3, 6] },
                { width: '150px', targets: 6 },
            ],
            processing: true,
            lengthChange: false, //show [10] entries
            pageLength: -1,
            // "searching": false,
            // order: [[1, 'asc']]
            // scrollY: 300,
            // paging: false
        });
        addEvents();
        tables['#admins'].drawn = true;
        table.page.len(10).draw();
    }
}
const drawTestsTable = async () => {
    if (!tables['#tests'].drawn) {
        let data = await request('/api/v1/tests', 'GET').then(data => {
            return data;
        }).catch(err => {
            console.log(err)
        })

        data.forEach(addTestActions)

        table = new DataTable('#testsTable', {
            aaData: data,
            columns: [
                { data: 'name' },
                { data: 'type' },
                { data: 'si' },
                { data: 'conventional' },
                { data: 'createdAt' },
                { data: 'actions' }],
            columnDefs: [
                { orderable: false, targets: [2, 3, 5] },
                { width: '200px', targets: 5 },
                { width: '200px', targets: 0 },
                { width: '50px', targets: 1 },
            ],
            processing: true,
            lengthChange: true, //show [10] entries
            // paging: false
            pageLength: -1,
        });
        addEvents();
        tables['#tests'].drawn = true;
        table.page.len(10).draw();
    }
}
const drawPreviewTable = async (JSONdata,unit) => {
    let displayData = [];
    let dataLength = JSONdata.length;
    if (dataLength <= 10) displayData = JSONdata;
    else {
        let randomSet = [];
        while (randomSet.length < 10) {
            let randIndex = Math.floor(Math.random() * dataLength);
            if (randomSet.indexOf(randIndex) == -1) {
                randomSet.push(randIndex);
                newObject = JSON.parse(JSON.stringify(JSONdata[randIndex]))
                newObject['unit']=unit;
                displayData.push(newObject)
            }
        }
    }

    if (tables['#upload'].drawn) {
        redrawTable("#upload", displayData);
        return;
    }

    // console.log(displayData);
    table = new DataTable('#previewTable', {
        aaData: displayData,
        columns: [
            { data: 'reference' },
            { data: 'ageGroup' },
            { data: 'lrl' },
            { data: 'url' },
            { data: 'mean' },
            { data: 'sd' },
            { data: 'cv' },
            { data: 'sampleSize' },
            { data: 'gender' },
            { data: 'unit' },
            { data: 'analyser' },
            { data: 'country' },
            { data: 'link' }],
        columnDefs: [
            { orderable: false, targets: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11] },
            // { width: '150px', targets: 7 },
        ],
        processing: true,
        lengthChange: false, //show [10] entries
        // "pageLength": 50,
        // "lengthMenu": [ 10, 25, 50, 75, 100 ]
        "searching": false,
        // order: [[1, 'asc']]
        // scrollY: 300,
        paging: false
    });
    tables['#upload'].drawn = true;
}
const drawDataTable = async (data) => {
    data.forEach(addDataActions)
    if (tables['#data'].drawn) {
        redrawTable("#dataTable", data);
        return;
    }

    table = new DataTable('#dataTable', {
        aaData: data,
        columns: [
            { data: 'reference' },
            { data: 'ageGroup' },
            { data: 'lrl' },
            { data: 'url' },
            { data: 'mean' },
            { data: 'sd' },
            { data: 'cv' },
            { data: 'sampleSize' },
            { data: 'gender' },
            // { data: 'unit' },
            { data: 'analyser' },
            { data: 'country' },
            { data: 'link' },
            { data: 'actions' }],
        columnDefs: [
            { orderable: false, targets: [0, 1, 2, 3, 4, 5, 6, 7, 9, 11,12] },
            { width: '200px', targets: [12] },
            { width: '150px', targets: [9] },
        ],
        processing: true,
        // lengthChange: false, //show [10] entries
        "pageLength": -1,
        // "lengthMenu": [ 10, 25, 50, 75, 100 ]
        // "searching": false,
        // order: [[1, 'asc']]
        scrollX: 300
    });
    tables['#data'].drawn = true;
    addEvents();
    table.page.len(10).draw();
}

let tables = {
    "#dashboard": { 'drawn': false, draw: function () { } },
    '#users': { 'drawn': false, 'draw': drawUsersTable },
    '#admins': { 'drawn': false, 'draw': drawAdminsTable },
    '#tests': { 'drawn': false, 'draw': drawTestsTable },
    '#data': { 'drawn': false, 'draw': function () {} },
    '#upload': { 'drawn': false, 'draw': function () { } }
}
const addTestActions = (test) => {
    test['createdAt'] = new Date(test['createdAt']).toDateString();
    test['actions'] = `<div class="text-center" data-testid="${test._id}">
    <button class="btn btn-outline-info py-0 rip-shadow edit-test"
        data-toggle="modal" data-target="#editTestModal">
        <i class="fa fa-pencil-alt"></i> <small>Edit</small>
    </button> &nbsp;
    <button class="btn btn-outline-danger py-0 rip-shadow delete-test"
        data-toggle="modal" data-target="#deleteTestModal">
        <i class="fa fa-trash"></i> <small>Delete</small>
    </button>
</div>`
}
const addDataActions = (data) => {
    // test['createdAt'] = new Date(test['createdAt']).toDateString();
    data['actions'] = `<div class="text-center" data-id="${data._id}">
    <!-- <button class="btn btn-outline-info py-0 rip-shadow edit-data"
        data-toggle="modal" data-target="#editDataModal">
        <i class="fa fa-pencil-alt"></i> <small>Edit</small>
    </button> &nbsp; -->
    <button class="btn btn-outline-danger py-0 rip-shadow delete-data"
        data-toggle="modal" data-target="#deleteDataModal">
        <i class="fa fa-trash"></i> <small>Delete</small>
    </button>
</div>`
}

$(document).ready(function () {
    const page = $("#main").data('page');
    tables[page].draw()
});


$("#confirmAdminBtn").click(async function (e) {
    e.preventDefault();
    // console.log($("#confirmAdminModal").attr('data-userid'));
    let response = await request(`/api/v1/makeAdmin/${$("#confirmAdminModal").attr('data-userid')}`,
        'POST', {}).then(data => {
            // location.replace('/panel#users')
            location.reload();
        }).catch(err => {
            console.log(err);
            return;
        });
});
$("#dropAdminBtn").click(async function (e) {
    e.preventDefault();
    let response = await request(`/api/v1/dropAdmin/${$("#dropAdminModal").attr('data-userid')}`,
        'POST', {}).then(data => {
            // location.replace('/panel#admins')
            location.reload();
        }).catch(err => {
            console.log(err);
            return;
        });
    /*
    response.forEach((user) => {
                user['actions'] = `<div class="text-center">
                <button class="btn btn-outline-danger py-0 rip-shadow drop-admin"
                    data-userid="${user._id}" data-toggle="modal"
                    data-target="#dropAdminModal">
                    <i class="fa fa-user-slash"></i> <small>Drop Admin</small>
                </button>
            </div>`
            })
            console.log(response);
            redrawTable("#adminsTable",response);
    */
});



$("#deleteTestBtn").click(async function (e) {
    e.preventDefault();
    // console.log($("#deleteTestModal").attr('data-testslug'));

    let response = await request(`/api/v1/tests/${$("#deleteTestModal").attr('data-testid')}`,
        'DELETE', {}).then(deleted => {
            let response2 = request('/api/v1/tests', 'GET').then(data => {
                data.forEach(addTestActions)
                alert("Test Deleted!!");
                redrawTable("#testsTable", data);
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
            return;
        });
});
$("#addTestForm").submit(async function (e) {
    e.preventDefault();
    let newTestForm = document.forms['addTestForm'];
    const newTest = {
        name: newTestForm['testName'].value,
        type: newTestForm['testType'].value,
        slug: createSlug(newTestForm['testName'].value),
        si: newTestForm['si'].value,
        conventional: newTestForm['conventional'].value
    }
    let response = await request('/api/v1/tests/', 'POST', newTest)
        .then(newData => {
            let response2 = request('/api/v1/tests', 'GET').then(data => {
                data.forEach(addTestActions)
                redrawTable("#testsTable", data);
                alert("Test Added!!");
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            if (err.status == 302) {
                alert(err.responseJSON.message)
            }
            console.log(err);
            return;
        });
    newTestForm.reset()
    $('#addTestModal').modal('hide');
    return false;
});
$("#editTestForm").submit(async function (e) {
    e.preventDefault();
    const testid = $("#editTestModal").attr('data-testid');
    let editTestForm = document.forms['editTestForm'];
    const test = {
        name: editTestForm['editTestName'].value,
        type: editTestForm['editTestType'].value,
        slug: createSlug(editTestForm['editTestName'].value),
        si: editTestForm['editSi'].value,
        conventional: editTestForm['editConventional'].value
    }

    let response = await request(`/api/v1/tests/${testid}`,
        'POST', test)
        .then(editedData => {
            let response2 = request('/api/v1/tests', 'GET').then(data => {
                data.forEach(addTestActions)
                redrawTable("#testsTable", data);
                alert("Test Updated!!");
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
            return;
        });

    editTestForm.reset()
    $('#editTestModal').modal('hide');
    return false;
});



$("#deleteDataBtn").click(async function (e) {
    e.preventDefault();
    // console.log($("#deleteTestModal").attr('data-testslug'));
    let response = await request(`/api/v1/data/${$('#uploadTestType').val()}/${$("#deleteDataModal").attr('data-id')}`,
        'DELETE', {}).then(async (deleted) => {
            alert("Data deleted!!");
            let response = await request(`/api/v1/data/${$('#uploadTestType').val()}/${$("#uploadTestName").val()}`, 'GET', {"ageGroup":$("#uploadAgeGroup").val()})
                .then(data => {
                    if(!tables["#data"].drawn)$("#preview").removeClass('d-none');
                    drawDataTable(data);
                }).catch(err => {
                    console.log(err)
                })
        }).catch(err => {
            console.log(err);
            return;
        });
});
$("#addDataForm").submit(function (e) {
    e.preventDefault();
    let newDataForm = document.forms['addDataForm'];
    const newData = {
        name: newDataForm['testName'].value,
        siUnit: newDataForm['si'].value,
        conventional: newDataForm['conventional'].value
    }
    // console.log(newData)
    newDataForm.reset()
    $('#addDataModal').modal('hide');
    return false;
});
$("#editDataForm").submit(function (e) {
    e.preventDefault();
    let editDataForm = document.forms['editDataForm'];
    const test = {
        name: editDataForm['editTestName'].value,
        siUnit: editDataForm['editSi'].value,
        conventional: editDataForm['editConventional'].value
    }
    // console.log(test)
    editTestForm.reset()
    $('#editDataModal').modal('hide');
    return false;
});

$(".discard-form").click(function (e) {
    e.preventDefault();
    document.forms[$(this).attr('data-form')].reset();
});