function getCars() {
    let list = document.getElementById("car-list");
    list.innerHTML = "";
    jQuery.get("http://localhost:3000/api/car", function(data) {
        data.data.forEach((car) => {
            var newElement = document.createElement("li");
            let edit = `<a href='#' data-carid='${car.id}' data-carmake='${car.make}' data-carmodel='${car.model}' onclick='editCar(event)'>edit</a>`;
            let del = `<a href='#' data-carid='${car.id}' onclick='delCar(event)'>delete</a>`;
            newElement.innerHTML = `${car.id} Make: ${car.make} Model: ${car.model} ${edit} | ${del}`;
            list.appendChild(newElement);
        });
    });
}

function addCar(e) {
    e.preventDefault();
    let make = $("#make");
    let model = $("#model");
    let carid = $("#carid");

    let makeVal = make.val();
    let modelVal = model.val();

    if(makeVal == "" || modelVal == "") {
        alert('Make and Model cannot be blank');
        return;
    }

    if (+carid.val() === 0) {
        jQuery.post("http://localhost:3000/api/car", { make: makeVal, model: modelVal }, function(data) {
            getCars();
        });
    } else {
        $.ajax({
                method: "PUT",
                url: "http://localhost:3000/api/car/" + carid.val(),
                data: { make: make.val(), model: model.val() }
            })
            .done(function(msg) {
                getCars();
            });
    }

    carid.val(0);
    $("#car-submit").val('Add Car');
    model.val("");
    make.val("");
}

function editCar(e) {
    e.preventDefault();
    let el = $(e.srcElement);
    let make = $("#make");
    let model = $("#model");
    let id = $("#carid");
    

    let makeVal = el.data("carmake");
    let modelVal = el.data("carmodel");
    let idVal = el.data("carid");

    $("#car-submit").val(`Edit Car #${idVal}`);
    make.val(makeVal);
    model.val(modelVal);
    id.val(idVal);
}

function delCar(e) {
    e.preventDefault();
    
    let el = $(e.srcElement);
    let carid = el.data("carid");
    if(confirm(`Are you sure you want to delete car #${carid}`)) {
        $.ajax({
                method: "DELETE",
                url: "http://localhost:3000/api/car/" + carid
            })
            .done(function(msg) {
                getCars();
            });
    }
}


// run getCars on 
$(function() {
    getCars();
    $("#add-car").on('submit', addCar);
});