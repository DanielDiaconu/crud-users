let newUser = {};
let isEditing = false;
let editedUser = {};

async function getData() {
  let response = await fetch("http://localhost:3000/users");
  let data = await response.json();
  for (let user of data) {
    buildUsers(user);
  }
}

getData();

function buildUsers(user) {
  const parent = document.querySelector("tbody");
  const mainDiv = document.createElement("tr");
  mainDiv.classList.add("odd");
  mainDiv.setAttribute("id", `user-${user.id}`);
  const td = document.createElement("td");
  mainDiv.appendChild(td);
  const tdDiv = document.createElement("div");
  tdDiv.classList.add("form-check");
  tdDiv.classList.add("form-check-sm");
  tdDiv.classList.add("form-check-custom");
  tdDiv.classList.add("form-check-solid");
  td.appendChild(tdDiv);
  const input = document.createElement("input");
  input.classList.add("form-check-input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("value", "1");
  tdDiv.appendChild(input);
  const secondaryTd = document.createElement("td");
  secondaryTd.classList.add("d-flex", "align-items-center");
  mainDiv.appendChild(secondaryTd);
  const secondaryTdDiv = document.createElement("div");
  secondaryTdDiv.setAttribute("id", "populated");
  secondaryTdDiv.classList.add("d-flex", "flex-column");
  secondaryTd.appendChild(secondaryTdDiv);
  const name = document.createElement("span");
  name.setAttribute("id", "nameEdit");
  name.classList.add("text-gray-800");
  name.classList.add("text-hover-primary");
  name.classList.add("mb-1");
  name.innerText = user.name;
  secondaryTdDiv.appendChild(name);
  const email = document.createElement("span");
  email.innerText = user.email;
  secondaryTdDiv.appendChild(email);
  const thirdTd = document.createElement("td");
  thirdTd.setAttribute("id", `role-${user.id}`);
  thirdTd.innerText = user.role;
  mainDiv.appendChild(thirdTd);
  const dateTd = document.createElement("td");
  dateTd.innerText = user.date;
  mainDiv.appendChild(dateTd);
  const finalTd = document.createElement("td");
  mainDiv.appendChild(finalTd);
  const edit = document.createElement("span");
  edit.classList.add("me-5");
  edit.innerText = "Edit";
  edit.setAttribute("data-bs-toggle", "modal");
  edit.setAttribute("data-bs-target", "#kt_modal_add_user");
  finalTd.appendChild(edit);
  const del = document.createElement("span");
  del.classList.add("ms-5");
  del.innerText = "Delete";
  del.setAttribute("id", user.id);
  del.classList.add("delete-btn");
  finalTd.appendChild(del);
  parent.appendChild(mainDiv);

  del.addEventListener("click", deleteData);
  edit.addEventListener("click", () => editInfo(user));
}

async function editInfo(user) {
  isEditing = true;
  let response = await fetch(`http://localhost:3000/users/${user.id}`);
  let data = await response.json();

  const nameValue = document.getElementById("name_input");
  const emailValue = document.getElementById("email_input");
  const roleValue = document.querySelector(
    `.form-check-input.me-3[value = "${data.role}"]`
  );
  roleValue.setAttribute("checked", "checked");
  emailValue.value = data.email;
  nameValue.value = data.name;
  editedUser = { ...data };
}

function openAddUserModal() {
  isEditing = false;
  const roles = document.querySelectorAll(`.form-check-input.me-3`);
  roles.forEach((input) => input.removeAttribute("checked"));
  const form = document.getElementById("kt_modal_add_user_form");
  // const roleValue = document.querySelector(`.form-check-input.me-3`);
  // roleValue.setAttribute("checked", "checked");
  form.reset();
}

async function createUser(e) {
  e.preventDefault();

  if (!isEditing) {
    let response = await fetch("http://localhost:3000/users", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    let data = await response.json();
    newUser.id = data.id;
    buildUsers(newUser);
    const inputs = document.querySelectorAll(".form-control");
    for (let key of inputs) {
      key.value = "";
    }
  } else {
    const nameValue = document.getElementById("name_input");
    const emailValue = document.getElementById("email_input");
    const roleValue = newUser.role;

    editedUser.name = nameValue.value;
    editedUser.email = emailValue.value;
    editedUser.role = roleValue;
    const { id } = editedUser;
    await fetch(`http://localhost:3000/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(editedUser),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const userRow = document.getElementById(`user-${id}`);
    userRow.querySelector("#nameEdit").innerText = editedUser.name;
    userRow.querySelector("span:not(#nameEdit)").innerText = editedUser.email;
    userRow.querySelector(`#role-${id}`).innerText = editedUser.role;
    console.log(newUser);
  }
}

function onUserDataChange(e) {
  newUser[e.target.name] = e.target.value;
  console.log(newUser);
}

async function deleteData(event) {
  const id = event.target.id;
  await fetch(`http://localhost:3000/users/${id}`, {
    method: "DELETE",
  });
  event.target.parentElement.parentElement.remove();
}
