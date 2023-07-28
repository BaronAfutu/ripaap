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

let tests = [];

$(document).ready(async function () {
    await request('/api/v1/tests', 'GET').then(data => {
        tests = data;
        options = data.map((option,index)=>{
            return `<option value="${option._id}">${index+1}. ${option.name}</option>`
        })
        $("#testName").html(`<option value=""disabled selected> </option>
        ${options.join('')}`);
    }).catch(err => {
        console.log(err)
    })

    $('.select2-base').select2();
});

$('#testName').on('select2:select', function (e) {
    for(test of tests){
        if(test._id==$("#testName").val()){
            $("#siUnitLabel").html(test.si);
            $("#conventionalLabel").html(test.conventional);
            break;
        }
    }
  });

$("#testForm").submit(function (e) {
    e.preventDefault();
    $("#placeholder").hide();
    $("#resultTables").show();
    new DataTable('#maleRI', {
        columnDefs: [
            { orderable: false, targets: [1, 2, 6] }
        ],
        "lengthChange": false,
        "searching": false,
        // order: [[1, 'asc']]
        // scrollY: 300,
        // paging: false
    });
    new DataTable('#femaleRI', {
        columnDefs: [
            { orderable: false, targets: [1, 2, 6] }
        ],
        "lengthChange": false,
        "searching": false
        // order: [[1, 'asc']]
        // scrollY: 300,
        // paging: false
    });
    return false;
});