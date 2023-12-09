document.addEventListener('DOMContentLoaded', function() {
    const paragraphs = document.querySelectorAll('.fade-in div');

    paragraphs.forEach((paragraph, index) => {
        setTimeout(() => {
            paragraph.classList.add('active');
        }, (index + 1) * 2000); // Adjust the transition duration (1s) and delay (1000ms) as needed
    });
});
