document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-game');
    
    // Start game on button click
    startButton.addEventListener('click', startGame);
    
    // Start game on Enter key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            startGame();
        }
    });
    
    
    function startGame() {
        // Optional: Play sound
        // startSound.play();
        
        // Add fade-out animation
        document.querySelector('.start-screen').style.animation = 'fadeOut 1s forwards';
        
        // Redirect to game page
        setTimeout(() => {
            window.location.href = '/game';
        }, 1000);
    }
});

// Optional: Add dramatic lighting effect
function createSpotlights() {
    const lights = document.querySelectorAll('.light');
    lights.forEach((light, index) => {
        light.style.left = `${Math.random() * 100}%`;
        light.style.animationDelay = `${Math.random() * 4}s`;
    });
}

createSpotlights();