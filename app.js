import * as THREE from './js/three.module.js';


let scene, camera, renderer;
let gameStarted = false;

document.addEventListener('DOMContentLoaded', function() {
    const soundEffect = document.getElementById('sound-effect');
    setTimeout(function() {
      const titleImage = document.getElementById('title-image');
      titleImage.style.visibility = 'visible';  // Make it visible first
      titleImage.style.opacity = '1';  // Then change opacity to 1 for the fade-in effect
      soundEffect.play().catch(error => {
        console.log('Sound autoplay blocked by the browser, playing sound after interaction:', error);
      });
    }, 500); // 0.5 second delay before showing the image

    setTimeout(function() {
        const buttons = document.querySelectorAll('#button-container button');
        buttons.forEach(button => {
          button.style.visibility = 'visible';
          button.style.opacity = '1';
        });
      }, 1000);
  });

document.getElementById('start-game').addEventListener('click', startGame);

document.getElementById('exit-button').addEventListener('click', function() {
    // Hide main menu
    document.getElementById('main-menu').style.display = 'none';

    // Show exit message
    document.getElementById('exit-container').style.display = 'block';
});


function startGame() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    initThreeJS();
    gameStarted = true;
}

function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();

    // Placeholder background color
    scene.background = new THREE.Color(0x87CEEB); // Light blue color for testing

    // Load background texture
    const loader = new THREE.TextureLoader();
    loader.load(
        'images/background.jpeg',  // Ensure the correct image path and extension
        function (texture) {
            console.log('Background image loaded successfully');
            scene.background = texture;  // Set background texture
        },
        undefined,
        function (err) {
            console.error('Error loading background image', err);
        }
    );

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Create the Jenga tower (a stack of cubes)
    const geometry = new THREE.BoxGeometry(1, 0.3, 0.3);
    const material = new THREE.MeshBasicMaterial({ color: 0x8B4513 });

    let yPosition = 0;
    for (let i = 0; i < 18; i++) {
        const block = new THREE.Mesh(geometry, material);
        block.position.set(0, yPosition, 0);
        scene.add(block);
        yPosition += 0.31;  // Adjust for spacing
    }

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

// Raycaster for block selection
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('pointermove', onPointerMove);

function checkBlockSelection() {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const selectedBlock = intersects[0].object;
        selectedBlock.material.color.set(0xff0000); // Highlight block when selected
    }
}

function animate() {
    requestAnimationFrame(animate);
    checkBlockSelection();
    renderer.render(scene, camera);
}

document.getElementById('settings').addEventListener('click', () => {
    alert('Settings menu coming soon!');
});

document.getElementById('tutorial').addEventListener('click', () => {
    alert('Tutorial coming soon!');
});

// Ensure the animate function is called correctly
animate();
