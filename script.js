const on = document.querySelector("#on");

on.addEventListener("click", () => {
    const screen = document.querySelector("#Screen");
    screen.classList.toggle("On", true);
});