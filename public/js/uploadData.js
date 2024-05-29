(function ($) {
    let JSONdata = [];
    let tests = [];
    let unit = "";

    const validateHeaders = (headers) => {
        const refHeaders = ['reference', 'ageGroup', 'lrl', 'url', 'mean', 'sd', 'cv', 'sampleSize', 'gender', 'unit', 'link', 'analyser'];
        if (refHeaders.length != headers.length) return false;

        for (let header of headers) {
            if (!refHeaders.includes(header.trim())) return false
        }
        return true;
    }

    const presentTests = () => {
        let options = tests.filter((test) => {
            return test.type == $('#uploadTestType').val();
        }).map((test, index) => {
            return `<option value="${test._id}">${index + 1}. ${test.name} (unit: ${test.si})</option>`
        })
        $("#uploadTestName").html(`<option value=""disabled selected> </option>
        ${options.join('')}`);
        $("#uploadTestName").removeAttr("disabled");
    }

    function convertCSVtoJSON(csvData) {
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        const jsonData = [];

        if (!validateHeaders(headers)) return jsonData;

        for (let i = 1; i < lines.length; i++) { // change 3 to lines.length
            if (lines[i] == "" || lines[i] == null) continue;
            const values = lines[i].split(/,(?! )/);
            if (values[0] == "" || values[0] == null) continue;
            const rowObject = {};
            try {
                for (let j = 0; j < headers.length; j++) {
                    let value = values[j].trim();
                    let header = headers[j].trim();

                    if (header == "reference" && value.indexOf('"') > -1) {
                        value = value.substring(1, value.length - 1)
                    }
                    if (!isNaN(parseFloat(value)) && header != "ageGroup") value = parseFloat(value);
                    // if (!isNaN(parseFloat(value)) && !/[A-Za-z]/.test(value)) value = parseFloat(value);
                    if ((header == 'sd' || header == 'cv' || header == 'sampleSize') && value == "") value = null;
                    if (unit == "" && header == 'unit') unit = value;

                    rowObject[header] = value;
                }
                rowObject['test'] = $("#uploadTestName").val();
                rowObject['country'] = rowObject['reference'].split('(').pop().split(')')[0].trim();
                rowObject['pediatric'] = $("#uploadAgeGroup").val() == 'pediatric';
                rowObject['adult'] = $("#uploadAgeGroup").val() == 'adult';
                rowObject['geriatric'] = $("#uploadAgeGroup").val() == 'geriatric';
                delete rowObject['unit']
                // rowObject[]
            } catch (err) {
                console.log(values);
                console.log(err)
            }
            jsonData.push(rowObject);
        }

        return jsonData;
    }

    $(document).ready(async function () {
        const page = $("#main").data('page');

        if (page == "#upload") {
            // Get the file input element
            const fileInput = document.getElementById('uploadFile');

            fileInput.addEventListener('change', (e) => {
                // Get the selected file
                // console.log(fileInput.files.length)
                const file = fileInput.files[0];

                // Create a FileReader object
                const reader = new FileReader();

                // Read the file contents as text
                reader.onload = (event) => {
                    const csvText = event.target.result;

                    // Convert the CSV text to JSON
                    JSONdata = convertCSVtoJSON(csvText);
                    if (JSONdata.length < 1) alert("Error in CSV file. Check headings and remove empty columns or download new template!")

                    // Log the JSON data to the console
                    // console.log(JSONdata);
                };

                // Read the file contents
                reader.readAsText(file);

                $("#checkPreview").removeAttr('disabled');
            });
        }

        await request('/api/v1/tests', 'GET').then(data => {
            tests = data;
        }).catch(err => {
            console.log(err)
        })

        if ($('#uploadTestType').val() == 'chemical' || $('#uploadTestType').val() == 'hematology') {
            presentTests();
        }

        $('#uploadTestType').on('select2:select', function (e) {
            presentTests();
        });

        $('#uploadTestName').on('select2:select', function (e) {
            if (JSONdata.length > 0) {
                for (let data of JSONdata) {
                    data['test'] = $("#uploadTestName").val();
                }
                // console.log(JSONdata)
            }
        })

        $('#uploadAgeGroup').on('select2:select', function (e) {
            if (JSONdata.length > 0) {
                for (let data of JSONdata) {
                    data['pediatric'] = $("#uploadAgeGroup").val() == 'pediatric';
                    data['adult'] = $("#uploadAgeGroup").val() == 'adult';
                    data['geriatric'] = $("#uploadAgeGroup").val() == 'geriatric';
                }
                // console.log(JSONdata)
            }
        })

        $('.select2-base').select2();

        $("#checkPreview").click(function (e) {
            e.preventDefault();
            if (!$("#uploadTestType").val()) {
                alert("Select Test Type!!")
                return;
            }
            if (!$("#uploadTestName").val()) {
                alert("Select Test Name!!")
                return;
            }
            if (!$("#uploadAgeGroup").val()) {
                alert("Select Age Group!!")
                return;
            }
            if (JSONdata.length == 0) {
                alert("Select CSV file!!")
                return;
            }
            $("#preview").show();
            drawPreviewTable(JSONdata,unit);
        });

        $("#uploadBtn").click(async function (e) {
            e.preventDefault();
            let data = await request(`/api/v1/data/${$('#uploadTestType').val()}/${$("#uploadTestName").val()}`, 'POST', { "data": JSONdata })
                .then(data => {
                    // Refresh the page after a delay of 3 seconds
                    setTimeout(function () {
                        alert("Upload Successfull!!")
                        location.reload();
                    }, 1000); // 3000 milliseconds = 3 seconds
                    return data;
                })
                .catch(err => {
                    console.log(err)
                })

        });

        $("#filterBtn").click(async function (e) {
            e.preventDefault();
            if(!$('#uploadTestType').val()){
                alert("Select Test Type!!");
                return;
            }
            if(!$('#uploadTestName').val()){
                alert("Select Test Name!!");
                return;
            }
            if(!$('#uploadAgeGroup').val()){
                alert("Select Age Group!!");
                return;
            }
            let response = await request(`/api/v1/data/${$('#uploadTestType').val()}/${$("#uploadTestName").val()}`, 'GET', {"ageGroup":$("#uploadAgeGroup").val()})
                .then(data => {
                    if(!tables["#data"].drawn)$("#preview").show();
                    drawDataTable(data);
                }).catch(err => {
                    console.log(err)
                })

        });
    });
})(jQuery);