var ajax_doctors;
$(document).ready(function () {

    $.ajax({
        type: 'GET',
        url: 'get_doctors/',

        success: function (json) {
            ajax_doctors = JSON.parse(json.doctors);
        },

        error: function () {
            dialog.alert({
                message: "Error! Doctors could not be fetched!",
                animation: "fade",
            });
        }
    })
});

var speciality = '';
// Adding doctors when speciality changes
$(document).ready(function () {
    $("#speciality-select").change(function (event) {
        $("#def-val-spec").remove();    // removes default --- option from drop down list
        $('.row').not(':first').remove(); // Remove all table rows except the row headings
        event.preventDefault();          // prevent default action when button changes 
        speciality = $("#speciality-select option:selected").text(); // get the selected speciality
        add_doctors(ajax_doctors, speciality);
    });
});

// Adds doctors of selected speciality to the table
var doctorsArr = [];
function add_doctors(doctors, spec) {
    for (let i = 0; i < doctors.length; ++i) {
        let doc_name = doctors[i].fields.doctor_name;

        if (doctors[i].fields.doctor_speciality == spec) {
            insert_doctor_row(doc_name);
        }
        if (doctorsArr.length == doctors.length) {
            continue;
        }
        if (!doctorsArr.includes(doc_name)) {
            doctorsArr.push({ 'name':doc_name, 'spec':doctors[i].fields.doctor_speciality});
        }
    }
}
// Inserts a row in the table containing doctor name and check boxes

// When clinic selected, table is redrawn
var clinics = [];
var clinic_list_index = 1;
$(document).ready(function () {
        $("#clinic-select-name").change(function(event) {
        
            $("#def-val-clinic").remove();
            var selected_clinic = $("#clinic-select-name option:selected").text();
            
            let cList = ""; 
            for(let i = 0; i < clinics.length; ++i) {
                cList += (clinics[i] + ",");
            }

            if (clinics.includes(selected_clinic)) 
                return;
        
            clinics.push(selected_clinic);

            
            cList = ""; 
            for(let i = 0; i < clinics.length; ++i) {
                cList += (clinics[i] + ",");
            }

    
            $("#heading").append(
                '<div class="cell"' + 
                'id="clinic-col-' + clinic_list_index.toString() + 
                '" data-id="' + clinic_list_index.toString() + '">' +
                '<div style="display:flex; flex-direction: row; justify-content: center; align-items: center">' +
                '<input class="clinic-chbox" type="checkbox" checked>' +
                '<label style="padding-left: 8px; padding-top:9px;">' +
                selected_clinic +
                '</label>' +
                '</div>' +
                '</div>'
            )

            $(".clinic-chbox").off();            
            $(".clinic-chbox").on("change", function() {
                if (!$(this).is(":checked")) {  // if radio box is unchecked
                    let clinicName = $(this).next().text();
                    var li_id = $(this).parent().parent().attr('data-id');
                    clinics.splice(clinics.indexOf(clinicName), 1); // removing clinic from clinics array
                    $("#clinic-col-" + li_id.toString()).remove();  // removing clinic heading from table
                    $('.' + clinicName.replace(/\s+|[,\/]/g, "-")).remove();

                    cList = ""; 
                    for(let i = 0; i < clinics.length; ++i) {
                        cList += (clinics[i] + ",");
                    }
                }
            });

            clinic_list_index++;
            redraw_table(doctorsArr);  
        });
});

function redraw_table(doctors) {
    $('.row').not(':first').remove();
    
    for (let i = 0; i < doctorsArr.length; ++i) {
        if (doctorsArr[i]['spec'] != speciality)
            continue;
            
        insert_doctor_row(doctorsArr[i]['name']);
    }
}

var times = ["9:30-10:30", "10:30-11:30", "12:30-1:30", "1:30-2:30", "3:30-4:30", "5:30-6:30"];
function insert_doctor_row(doctor_name) {
    let checkbox_str = '';

    for(let i = 0; i < clinics.length; ++i) {

        let class_attr = clinics[i].replace(/\s+|[,\/]/g, "-");

        checkbox_str += '<div class="cell ' +
        class_attr + '" ' +
        'data-clinic-name="' + clinics[i] + '">' +
        '<div style="display:flex; flex-direction: row; justify-content: center; align-items: center">' +
        times[Math.floor(Math.random()*times.length)] +    //gets random item from times array
        '</div>' +
        '</div>'
    }
    
    $(".table").append(
        '<div class="row ' + doctor_name.replace(/\s+|[,\/]/g, "-") + '">' +
        '<div class="cell" style="padding-bottom:0px;">' +
        '<div style="display:flex; flex-direction: row; justify-content: left; align-items: left">' +
        '<input class="doc-chbox" type="checkbox" checked>' +
        '<label style="padding-left: 8px;">' +
        doctor_name +
        '</label>' +
        "</div>" +
        "</div>" +
        checkbox_str
    )
    $(".doc-chbox").on("change", function() {
        if (!$(this).is(":checked")) {  // if radio box is unchecked
            let doctorName = $(this).next().text();
            $('.' + doctorName.replace(/\s+|[,\/]/g, "-")).remove();
        }
    });        

}

// $(document).ready(function () {
//     $("#assign-docs").click(function(e) {
        
//         let docs_selected = false;
//         $(".cell input:checked").each(function() {
//             let clinic = $(this).parent().attr('data-clinic-name');
//             let doc = $(this).parent().parent().first().text();
//             docs_selected = true;

//             $.ajax({
//                 type: 'POST',
//                 url: 'assign_doctor/',
//                 data: {
//                     name: doc,
//                     clinic: clinic,
//                 }
//             });
//         });

//         $('input[type=checkbox]').prop('checked', false);   // un-check all check boxes in the table
        
//         if (docs_selected) {
//             dialog.alert({
//                 message: "Assignments performed successfully",
//                 animation: "fade",
//             });
//         }
//         else {
//             dialog.alert({
//                 message: "You did not select any doctors!",
//                 animation: "fade",
//             });
//         }
//     });
// });


// When a cell is clicked.
var savedCells = [];
$(".wrap-table100").on('click', '.cell', function(e){
    
    // If the cell contains a doctor-name or is in the heading row (row header class) then don't trigger the modal.
    // All cells in the heading row contain a data-id attribute which is used to perform the second check in the if statement.
    if ($(this).is(':first-child') || $(this).attr('data-id')) 
        return;
        
    // If copy has been selected from context-menu, change cell background and save the cell
    if (isCopied) {
        $(this).css('background-color','#c4c9f2');
        savedCells.push($(this));
    }
    else {
        $('.tableModal').modal({
            show: true
        })
    }
});

// Display dotted black background around cells when mouse is moved over
$(".wrap-table100").on('mouseover', '.cell', function(e){
    if ($(this).is(':first-child') || $(this).attr('data-id')) 
        return;

    $(this).css('border', '1px dotted black');
});

// Make dotted background transparent
$(".wrap-table100").on('mouseleave', '.cell', function(e){
    if ($(this).is(':first-child') || $(this).attr('data-id')) 
        return;

    $(this).css('border', '1px dotted transparent');
});

var copiedElem;
var copiedTime = "";
var isCopied = false;
$(function() {
    $.contextMenu({
        // :not(:first-child) -> Since the cell containing a doctors name is the first cell in a row i.e first child of class row.
        // :not([data-id]) -> Since the cells in the heading row all have the data-id attribute.

        selector: '.cell:not(:first-child):not([data-id])', 
        items: {
            copy: { 
                name: "Copy", 
                icon: "copy",
                callback: function(item, opt) {
                    copiedElem = opt.$trigger.children(":first");
                    copiedTime = copiedElem.text();
                    copiedElem.parent().css('background-color','#c4c9f2');
                    isCopied = true;
                }
            },
            "paste": {
                name: "Paste", 
                icon: "paste",
                callback: function(item, opt) {
                    if (isCopied) {
                        if (savedCells.length == 0) {
                            opt.$trigger.children(":first").text(copiedTime);
                        }
                        else {
                            for (let i = 0; i < savedCells.length; ++i) {
                                savedCells[i].children(":first").text(copiedTime); 
                                savedCells[i].removeAttr('style');
                            }
                        }
                        copiedElem.parent().removeAttr('style');
                        isCopied = false;
                        savedCells = [];
                    }
                }
            },
            "delete": {
                name: "Delete", 
                icon: "delete"
            },
        },
    });
});