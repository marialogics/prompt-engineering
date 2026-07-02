
// Wait until DOM loads
document.addEventListener("DOMContentLoaded", () => {
    console.log("Website loaded");

    const button = document.getElementById("btnClick");

    button.addEventListener("click", () => {
        alert("Button clicked!");
    });
});
