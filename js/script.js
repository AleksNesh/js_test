var q = "";
var offset = 0;
var limit = 10;
var data;
var query;
var liIndex = 0;

window.onload = create()


/* создаем враппер для таблицы*/
var tableWrapper = document.createElement("div");
tableWrapper.className = "table-responsive";
tableWrapper.id = "tableWrapper"
tableWrapper.style.cssText = "max-width: 1200px; margin: 30px auto; padding: 0 20px;"
document.body.appendChild(tableWrapper);
/* создаем кнопку с обработчиком события для показа всех выбраных id*/
var allCheckId = document.createElement("button")
allCheckId.innerHTML = "show id all cheked rows"
allCheckId.style.cssText = " float: right;"
allCheckId.className = "btn btn-primary"
allCheckId.addEventListener("click", function() {
	var allCheckBox = document.getElementById("table").getElementsByTagName("input")
	var checkedId = ""
	for (var i = 0; i < allCheckBox.length; i++) {
		if (document.getElementById(i).checked) {
			checkedId += data.results[i].firstName + " id: " + data.results[i]._id + "\n\r"
		}
	}
	if (checkedId != "") {
		alert(checkedId)
	}

})
tableWrapper.appendChild(allCheckId)

/* создаем поле для поиска*/

var input = document.createElement("input");
tableWrapper.appendChild(input);
input.id = "input"
input.placeholder = "search by email"
input.style.cssText = " float: left;"
document.getElementById("input").addEventListener("keyup", function() {
	offset = 0;
	liIndex = 0;
	q = document.getElementById("input").value;
	create()
});

var select = document.createElement("select");
select.setAttribute("onchange", "changeLimit()")
tableWrapper.appendChild(select);
for (var i = 1; i <= 3; i++) {
	var option = document.createElement("option")
	option.value = i * 10
	option.innerHTML = i * 10
	select.appendChild(option)
}

function changeLimit() {
	var changeOffset = document.getElementsByTagName("option")
	for (var i = 0; i < changeOffset.length; i++) {
		if (changeOffset[i].selected) {
			limit = changeOffset[i].value
		}
	}
	create()
}



/* функция для формирования запроса и вызова функций создания таблицы и пагинации*/
function create() {

	/*если форма поиска по email не пустая то к строку запроса добавляем &q*/
	if (q != "") {
		query = "https://pure-island-2586.herokuapp.com/v1/customers" + "?offset=" + offset + "&limit=" + limit + "&q=" + q;
	}
	/* если пустая то убираем &q*/
	else {
		query = "https://pure-island-2586.herokuapp.com/v1/customers" + "?offset=" + offset + "&limit=" + limit
	}
	var reqest = new XMLHttpRequest();
	reqest.open("GET", query, true);
	reqest.onload = function() {
		data = JSON.parse(reqest.responseText);
		createTable();
		createPages();
	};

	reqest.send(null);

};

/*создаем и заполняем таблицу*/
function createTable() {

	var oldTable = document.getElementById("table");
	if (oldTable) {
		oldTable.remove(oldTable)
	};
	var table = document.createElement("table");
	table.id = "table"
	table.className = "table table-bordered"
	tableWrapper.appendChild(table);


	for (var i = 0; i < data.results.length; i++) {
		var row = document.createElement("tr")
			/*создаем checkbox*/
		var checkbox = document.createElement("input")
		checkbox.type = "checkbox"
		checkbox.id = i
			/*создаем кнопку для показа id*/
		var button = document.createElement("button")
		button.innerHTML = "show id"
		button.name = i
		button.className = "btn btn-info"
		button.style = "float: right;"
		button.onclick = function() {
			alert(data.results[this.name].firstName + " id: " + data.results[this.name]._id)
		}

		/*заполняем строки и ячейки*/
		row.innerHTML = "<td>" + data.results[i].firstName + "</td><td>" + data.results[i].lastName + "</td><td>" + data.results[i].email + "</td><td>" + data.results[i].companyName + "</td><td>" + "</td><td>" + data.results[i].createdDate + "</td>";
		row.appendChild(checkbox)
		row.className = "table-bordered"
		row.appendChild(button)
		table.appendChild(row);
	};


};


/*создаем пагинацию*/
function createPages() {
	/*удаляем предъидущую пагинацию, что бы не весело больше кнопок чем страниц с результатами*/
	var oldPages = document.getElementById("ul");
	if (oldPages) {
		oldPages.remove(oldPages)
	};
	/*определяем кол-во страниц, делением количества записей на лимит показа и округляем в большую сторону*/
	var pages = Math.ceil(data.total / limit);
	var ul = document.createElement("ul");
	ul.id = "ul";
	ul.style.cssText = "text-align: center; padding: 0;"
	tableWrapper.appendChild(ul);
	for (var i = 0; i < pages; i++) {
		var li = document.createElement("li");
		li.className = "btn btn-default" /*вешаем классы bootstrap*/
		li.name = i
		li.innerHTML = i + 1
		li.style = "margin: 5px"
			/*вешаем обработчик события на клик, изменяем offset для отрисовки таблицы с новыми данными*/
		li.onclick = function() {
			offset = limit * this.name
			liIndex = this.name
			create()
		}
		ul.appendChild(li)
	}
	document.getElementsByTagName("li")[liIndex].style.cssText = "color: blue; margin: 5px; background: #d2d2d2"
}