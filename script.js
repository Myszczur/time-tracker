const apikey = 'afcbca76-8032-41fc-9d41-3aae0da8254c';
const apihost = 'https://todo-api.coderslab.pl';

document.addEventListener('DOMContentLoaded', function () {

    apiListTasks().then(
        function (response) {
            response.data.forEach(
                function (task) { renderTask(task.id, task.title, task.description, task.status); }
            );
        }
    );

    function apiListOperationsForTask(taskId) {
        return fetch(
            apihost + `/api/tasks/${taskId}/operations`,
            {
                headers: { Authorization: apikey }
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    };

    function apiListTasks() {
        return fetch(
            apihost + '/api/tasks',
            {
                headers: { Authorization: apikey }
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    };

    function apiCreateTask(title, description) {
        return fetch(
            apihost + '/api/tasks',
            {
                headers: { Authorization: apikey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title, description: description, status: `open` }),
                method: `POST`
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    };

    function apiCreateOperationForTask(taskId, description) {
        return fetch(
            apihost + `/api/tasks/${taskId}/operations`,
            {
                headers: { Authorization: apikey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: description, timeSpent: 0 }),
                method: `POST`
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    };

    function apiUpdateOperation(operationId, description, timeSpent) {
        return fetch(
            apihost + `/api/operations/${operationId}`,
            {
                headers: { Authorization: apikey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: description, timeSpent: timeSpent }),
                method: `PUT`
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    };

    function apiUpdateTask(taskId, title, description, status) {
        return fetch(
            apihost + `/api/tasks/${taskId}`,
            {
                headers: { Authorization: apikey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title, description: description, status: status }),
                method: `PUT`
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    };

    function apiDeleteTask(taskId) {
        return fetch(
            apihost + `/api/tasks/${taskId}`,
            {
                headers: { Authorization: apikey },
                method: `DELETE`
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    };

    function apiDeleteOperation(operationId) {
        return fetch(
            apihost + `/api/operations/${operationId}`,
            {
                headers: { Authorization: apikey },
                method: `DELETE`
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    };

    let formSubmit = document.querySelector("form.js-task-adding-form");
    formSubmit.addEventListener("submit", function (e) {
        e.preventDefault();

        let titleValue = document.querySelector(`input[name="title"]`).value;
        document.querySelector(`input[name="title"]`).value = "";
        let descriptionValue = document.querySelector(`input[name="description"]`).value;
        document.querySelector(`input[name="description"]`).value = "";

        if (descriptionValue != "" && titleValue != "") {
            apiCreateTask(titleValue, descriptionValue).then(function (response) {
                renderTask(response.data.id, response.data.title, response.data.description, response.data.status);
            });
        }
    });

    function renderOperation(operationList, status, operationId, operationDescription, timeSpent) {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        operationList.appendChild(li);

        let descriptionDiv = document.createElement("div");
        descriptionDiv.innerText = operationDescription;
        li.appendChild(descriptionDiv);

        let time = document.createElement("span");
        time.className = "badge badge-success badge-pill ml-2";
        time.innerText = renderTime(timeSpent);
        descriptionDiv.appendChild(time);

        if (status == "open") {
            let divForBtnModification = document.createElement("div");
            divForBtnModification.className = "js-task-open-only";
            li.appendChild(divForBtnModification);

            let add15mBtn = document.createElement("button");
            add15mBtn.className = "btn btn-outline-success btn-sm mr-2";
            add15mBtn.innerText = "+15m"
            divForBtnModification.appendChild(add15mBtn);
            add15mBtn.addEventListener("click", function () {
                apiUpdateOperation(operationId, operationDescription, timeSpent + 15).then(
                    function (response) {
                        time.innerText = renderTime(response.data.timeSpent);
                        timeSpent = response.data.timeSpent;
                    }
                );
            }
            )
            let add1hBtn = document.createElement("button");
            add1hBtn.className = "btn btn-outline-success btn-sm mr-2";
            add1hBtn.innerText = "+1h"
            divForBtnModification.appendChild(add1hBtn);
            add1hBtn.addEventListener("click", function () {
                apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then(
                    function (response) {
                        time.innerText = renderTime(response.data.timeSpent);
                        timeSpent = response.data.timeSpent;
                    }
                );
            }
            )

            let deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-outline-danger btn-sm";
            deleteBtn.innerText = "Delete"
            divForBtnModification.appendChild(deleteBtn);
            deleteBtn.addEventListener("click", function () {
                apiDeleteOperation(operationId).then(
                    li.remove()
                )
            })
        };
    };

    function renderTask(taskId, title, description, status) {

        let section = document.createElement(`section`);
        section.className = `card mt-5 shadow-sm`;
        document.querySelector(`main`).appendChild(section);

        let headerDiv = document.createElement("div");
        headerDiv.className = "card-header d-flex justify-content-between align-items-center";
        section.appendChild(headerDiv);

        let headerLeftDiv = document.createElement("div");
        headerDiv.appendChild(headerLeftDiv);

        let h5 = document.createElement("h5");
        h5.innerText = title;
        headerLeftDiv.appendChild(h5);

        let h6 = document.createElement("h6");
        h6.className = "card-subtitle text-muted";
        h6.innerText = description;
        headerLeftDiv.appendChild(h6);

        let headerRightDiv = document.createElement("div");
        headerDiv.appendChild(headerRightDiv);

        if (status == "open") {
            let finishBtn = document.createElement("button");
            finishBtn.className = "btn btn-dark btn-sm js-task-open-only";
            finishBtn.innerText = "Finish";
            headerRightDiv.appendChild(finishBtn);
            finishBtn.addEventListener("click", function () {
                apiUpdateTask(taskId, title, description, `closed`);
                let sectionToFinish = section.querySelectorAll(".js-task-open-only");
                for (const iterator of sectionToFinish) {
                    iterator.parentElement.removeChild(iterator);
                }
            });
        }

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-outline-danger btn-sm ml-2";
        deleteBtn.innerText = "Delete";
        headerRightDiv.appendChild(deleteBtn);
        deleteBtn.addEventListener("click", function () {
            apiDeleteTask(taskId).then(
                section.remove()
            )
        });

        let ulList = document.createElement("ul");
        ulList.className = "list-group list-group-flush";
        section.appendChild(ulList);

        apiListOperationsForTask(taskId).then(
            function (response) {
                response.data.forEach(
                    function (operation) {
                        renderOperation(ulList, status, operation.id, operation.description, operation.timeSpent);
                    }
                );
            }
        )

        if (status == "open") {
            let formDiv = document.createElement("div");
            formDiv.className = "card-body js-task-open-only";
            section.appendChild(formDiv);

            let formInDiv = document.createElement("form");
            formDiv.appendChild(formInDiv);

            let inputGroupDiv = document.createElement("div");
            inputGroupDiv.className = "input-group";
            formInDiv.appendChild(inputGroupDiv);

            let inputText = document.createElement("input");
            inputText.type = "text";
            inputText.placeholder = "Operation description";
            inputText.minlength = "5";
            inputText.className = "form-control";
            inputGroupDiv.appendChild(inputText);

            let inputDivForBtn = document.createElement("div");
            inputDivForBtn.className = "input-group-append";
            inputGroupDiv.appendChild(inputDivForBtn);

            let inputBtn = document.createElement("button");
            inputBtn.className = "btn btn-info";
            inputBtn.innerText = "Add";
            inputDivForBtn.appendChild(inputBtn);

            formDiv.addEventListener("submit", function (e) {
                e.preventDefault();
                let descriptionValue = inputText.value;
                inputText.value = "";
                if (descriptionValue != "") {
                    apiCreateOperationForTask(taskId, descriptionValue).then(
                        function (response) {
                            renderOperation(ulList, status, response.data.id, response.data.description, response.data.timeSpent);
                        });
                }
            });
        }
    };

    function renderTime(numberofTime) {
        if (numberofTime >= 60) {
            let hours = Math.floor(numberofTime / 60);
            let minutes = numberofTime % 60;
            let hoursString = hours.toString();
            let minutesString = minutes.toString();
            return `${hoursString}h ${minutesString}m`;
        } else {
            let minutes = numberofTime % 60;
            let minutesString = minutes.toString();
            return `${minutesString}m`;
        }
    };
});
