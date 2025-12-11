const BASE_URL = "http://localhost:3000/students";

const tableBody = document.querySelector("#students-table tbody");
const getBtn = document.getElementById("get-students-btn");
const form = document.getElementById("add-student-form");


async function getStudents() {
    try {
        const res = await fetch(BASE_URL);
        const students = await res.json();
        renderStudents(students);
    } catch (err) {
        console.error("Помилка GET:", err);
    }
}


function renderStudents(students) {
    tableBody.innerHTML = students
        .map(
            s => `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.age}</td>
                <td>${s.course}</td>
                <td>${s.skills.join(", ")}</td>
                <td>${s.email}</td>
                <td>${s.isEnrolled ? "Так" : "Ні"}</td>

                <td>
                    <button onclick="updateStudent(${s.id})">Оновити</button>
                    <button onclick="deleteStudent(${s.id})">Видалити</button>
                </td>
            </tr>
        `
        )
        .join("");
}


async function addStudent(e) {
    e.preventDefault();

    const newStudent = {
        name: document.getElementById("name").value,
        age: Number(document.getElementById("age").value),
        course: document.getElementById("course").value,
        skills: document.getElementById("skills").value.split(",").map(s => s.trim()),
        email: document.getElementById("email").value,
        isEnrolled: document.getElementById("isEnrolled").checked,
    };

    try {
        await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newStudent),
        });

        getStudents();
        form.reset();
    } catch (err) {
        console.error("Помилка POST:", err);
    }
}


async function updateStudent(id) {
    const newName = prompt("Введіть нове ім'я:");

    if (!newName) return;

    try {
        await fetch(`${BASE_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName }),
        });

        getStudents();
    } catch (err) {
        console.error("Помилка PATCH:", err);
    }
}


async function deleteStudent(id) {
    if (!confirm("Видалити студента?")) return;

    try {
        await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
        });

        getStudents();
    } catch (err) {
        console.error("Помилка DELETE:", err);
    }
}


getBtn.addEventListener("click", getStudents);
form.addEventListener("submit", addStudent);
