const addEvents = () => {
    $(".make-admin").click(function (e) {
        e.preventDefault();
        $("#confirmAdminModal").attr('data-userid', $(this).data('userid'));
    });
    $(".drop-admin").click(function (e) {
        e.preventDefault();
        // console.log('pressed')
        $("#dropAdminModal").attr('data-userid', $(this).data('userid'));
    });
    $(".delete-test").click(function (e) {
        e.preventDefault();
        $("#deleteTestModal").attr('data-testid', $(this).parent().data('testid'));
    });
    $(".edit-test").click(function (e) {
        e.preventDefault();
        $("#editTestModal").attr('data-testid', $(this).parent().data('testid'));
        const cell = $(this).closest('tr').find('td');
        let editTestForm = document.forms['editTestForm'];

        editTestForm['editTestName'].value = cell[0].innerHTML;
        editTestForm['editSi'].value = cell[1].innerHTML;
        editTestForm['editConventional'].value = cell[2].innerHTML;
    });
}

const request = (url, method, data = {}) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: JSON.stringify(data),
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

const redrawTable = (tableSelector,data) => {
    let dt = $(tableSelector).dataTable();
    dt.fnClearTable(false);
    dt.fnAddData(data);
    addEvents();
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

        new DataTable('#usersTable', {
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
            // "searching": false,
            // order: [[1, 'asc']]
            // scrollY: 300,
            // paging: false
        });
        addEvents();
        tables['#users'].drawn = true;
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
        new DataTable('#adminsTable', {

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
            // "searching": false,
            // order: [[1, 'asc']]
            // scrollY: 300,
            // paging: false
        });
        addEvents();
        tables['#admins'].drawn = true;
    }
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

const drawTestsTable = async () => {
    if (!tables['#tests'].drawn) {
        let data = await request('/api/v1/tests', 'GET').then(data => {
            return data;
        }).catch(err => {
            console.log(err)
        })

        data.forEach(addTestActions)

        new DataTable('#testsTable', {
            aaData: data,
            columns: [
                { data: 'name' },
                { data: 'si' },
                { data: 'conventional' },
                { data: 'createdAt' },
                { data: 'actions' }],
            columnDefs: [
                { orderable: false, targets: [1, 2, 4] },
                { width: '200px', targets: 4 },
                { width: '200px', targets: 0 },
                { width: '50px', targets: 1 },
            ],
            processing: true,
            lengthChange: false, //show [10] entries
        });
        addEvents();
        tables['#tests'].drawn = true;
    }
}

let tables = {
    "#dashboard": { 'drawn': false, draw: function () { } },
    '#users': { 'drawn': false, 'draw': drawUsersTable },
    '#admins': { 'drawn': false, 'draw': drawAdminsTable },
    '#tests': { 'drawn': false, 'draw': drawTestsTable },
    '#data': { 'drawn': false, 'draw': drawUsersTable },
}
$(document).ready(function () {
    new DataTable('#dataTable', {

        // aaData: data,
        // columns: [
        //     { data: 'title' },
        //     { data: 'firstName' },
        //     { data: 'lastName' },
        //     { data: 'email' },
        //     { data: 'institution' },
        //     { data: 'country' },
        //     { data: 'createdAt' },
        //     { data: 'actions' }],
        columnDefs: [
            { orderable: false, targets: [0, 1, 2, 6, 7] },
            { width: '100px', targets: 7 },
        ],
        processing: true,
        "lengthChange": false,
        // "searching": false,
        // scrollY: 300,
        // paging: false
    });

    $(".section").hide();
    const section = location.hash;
    if (section == '') $("#dashboard").show();
    else {
        $(section).show();
        tables[section].draw()
    }
});


$(".nav-link").click(function (e) {
    // e.preventDefault();
    $(".section").hide();
    const section = $(this).data('section');
    $(section).show();
    $('.nav-link').removeClass('active');
    $(this).addClass('active')
    tables[section].draw();
});

$("#testReload").click(function (e) {
    e.preventDefault();
    const data = [
        {
            title: "Dr", firstName: 'Austin', lastName: 'Afutu',
            email: 'hi@you.com', institution: 'UG', country: 'Ghana',
            createdAt: new Date().toLocaleString(), actions: '<i class="fa fa-user-cog"></i>'
        }
    ]
    //usersTable.ajax.url(data).load();
    let dt = $("#usersTable").dataTable();
    dt.fnClearTable(false);
    dt.fnAddData(data);
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
    // console.log($("#deleteTestModal").attr('data-testid'));

    let response = await request(`/api/v1/tests/${$("#deleteTestModal").attr('data-testid')}`,
        'DELETE', {}).then(deleted => {
            let response2 = request('/api/v1/tests', 'GET').then(data => {
                data.forEach(addTestActions)
                redrawTable("#testsTable",data);
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
        si: newTestForm['si'].value,
        conventional: newTestForm['conventional'].value
    }
    let response = await request('/api/v1/tests/', 'POST', newTest)
        .then(newData => {
            let response2 = request('/api/v1/tests', 'GET').then(data => {
                data.forEach(addTestActions)
                redrawTable("#testsTable",data);
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            if(err.status==302){
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
    let editTestForm = document.forms['editTestForm'];
    const test = {
        name: editTestForm['editTestName'].value,
        si: editTestForm['editSi'].value,
        conventional: editTestForm['editConventional'].value
    }

    let response = await request(`/api/v1/tests/${$("#editTestModal").data('testid')}`,
        'POST', test)
        .then(editedData => {
            let response2 = request('/api/v1/tests', 'GET').then(data => {
                data.forEach(addTestActions)
                redrawTable("#testsTable",data);
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
$(".discard-form").click(function (e) {
    e.preventDefault();
    document.forms[$(this).data('form')].reset();
});



$(".delete-data").click(function (e) {
    e.preventDefault();
    $("#deleteDataModal").attr('data-dataid', $(this).parent().data('dataid'));
});
$("#deleteDataBtn").click(function (e) {
    e.preventDefault();
    // console.log($("#deleteDataModal").attr('data-dataid'));
});
$(".edit-Data").click(function (e) {
    e.preventDefault();
    $("#editDataModal").attr('data-dataid', $(this).parent().data('dataid'));
    let editDataForm = document.forms['editDataForm'];
    // editDataForm['editTestName'].value = 'banana';
    // editDataForm['editSi'].value = 'carrot';
    // editDataForm['editConventional'].value = 'mango';
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
    document.forms[$(this).data('form')].reset();
});

