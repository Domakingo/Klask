document.addEventListener('DOMContentLoaded', () => {
    const playerOne = document.getElementById('playerOne');
    const playerTwo = document.getElementById('playerTwo');
    const board = document.querySelector('.board');
    const boardHeight = board.offsetHeight;
    const boardWidth = board.offsetWidth;
    const centerLineY = boardHeight / 2;
    const goalTop = document.querySelector('.goal.top');
    const goalBottom = document.querySelector('.goal.bottom');

    const activeTouches = {};

    function getEventClientX(event) {
        return event.clientX || (event.changedTouches && event.changedTouches[0].clientX);
    }

    function getEventClientY(event) {
        return event.clientY || (event.changedTouches && event.changedTouches[0].clientY);
    }

    function onPointerDown(event) {
        const target = event.target;
        if (target.classList.contains('player')) {
            const touchId = event.pointerId || (event.changedTouches && event.changedTouches[0].identifier);
            activeTouches[touchId] = {
                player: target,
                offsetX: getEventClientX(event) - target.offsetLeft,
                offsetY: getEventClientY(event) - target.offsetTop
            };
        }
    }

    let isMoving = false;

    function onPointerMove(event) {
        if (!isMoving) {
            isMoving = true;
            requestAnimationFrame(() => {
                const touchId = event.pointerId || (event.changedTouches && event.changedTouches[0].identifier);
                const touchData = activeTouches[touchId];
    
                if (touchData) {
                    const { player, offsetX, offsetY } = touchData;
                    let newX = getEventClientX(event) - offsetX;
                    let newY = getEventClientY(event) - offsetY;
                    const playerHeight = player.offsetHeight;
                    const playerWidth = player.offsetWidth;
    
                    // Collision detection
                    if (player.id === 'p1') {
                        newX = Math.max(25, Math.min(newX, (boardWidth - 10) - (playerWidth / 2)));
                        newY = Math.max(25, Math.min(newY, (centerLineY - 10) - (playerHeight / 2)));
                        if (newY < goalTop.offsetHeight && newX + (playerWidth / 2) > goalTop.offsetLeft && newX < goalTop.offsetLeft + goalTop.offsetWidth) {
                            newY = goalTop.offsetHeight;
                        }
                    } else if (player.id === 'p2') {
                        newX = Math.max(0, Math.min(newX, (boardWidth - 10) - (playerWidth / 2)));
                        newY = Math.max(centerLineY, Math.min(newY, (boardHeight - 10) - (playerHeight / 2)));
                        if (newY + (playerHeight / 2) > (boardHeight - 10) - goalBottom.offsetHeight && newX + (playerWidth / 2) > goalBottom.offsetLeft && newX < goalBottom.offsetLeft + goalBottom.offsetWidth) {
                            newY = (boardHeight - 10) - goalBottom.offsetHeight - (playerHeight / 2);
                        }
                    }
    
                    player.style.left = `${newX}px`;
                    player.style.top = `${newY}px`;
                }
                isMoving = false;
            });
        }
    }    

    function onPointerUp(event) {
        const touchId = event.pointerId || (event.changedTouches && event.changedTouches[0].identifier);
        delete activeTouches[touchId];
    }

    board.addEventListener('mousedown', onPointerDown);
    board.addEventListener('touchstart', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('touchmove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchend', onPointerUp);
});
