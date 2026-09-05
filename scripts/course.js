const courses = [
    {
        subject: "CSE",
        number: 110,
        title: "Introduction to Programming",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 111,
        title: "Programming with Functions",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 210,
        title: "Programming with Classes",
        credits: 2,
        completed: false
    },
    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 231,
        title: "Web Frontend Development I",
        credits: 2,
        completed: false
    }
];


const courseCards = document.querySelector("#course-cards");
const totalCredits = document.querySelector("#total-credits");

const allButton = document.querySelector("#all");
const cseButton = document.querySelector("#cse");
const wddButton = document.querySelector("#wdd");


function displayCourses(courseList) {

    courseCards.innerHTML = "";

    courseList.forEach(course => {

        const card = document.createElement("div");

        card.classList.add("course-card");

        if (course.completed) {
            card.classList.add("completed");
        }

        card.innerHTML = `
            <h3>${course.subject} ${course.number}</h3>
            <p>${course.title}</p>
        `;

        courseCards.appendChild(card);
    });


    const credits = courseList.reduce(
        (total, course) => total + course.credits,
        0
    );

    totalCredits.textContent = credits;
}


function selectButton(button) {

    allButton.classList.remove("selected");
    cseButton.classList.remove("selected");
    wddButton.classList.remove("selected");

    button.classList.add("selected");
}


allButton.addEventListener("click", () => {

    displayCourses(courses);
    selectButton(allButton);

});


cseButton.addEventListener("click", () => {

    const cseCourses = courses.filter(
        course => course.subject === "CSE"
    );

    displayCourses(cseCourses);
    selectButton(cseButton);

});


wddButton.addEventListener("click", () => {

    const wddCourses = courses.filter(
        course => course.subject === "WDD"
    );

    displayCourses(wddCourses);
    selectButton(wddButton);

});


displayCourses(courses);