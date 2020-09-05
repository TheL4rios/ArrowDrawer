document.addEventListener('DOMContentLoaded', function() {
    recalculateAll();

    function draw(from, to, arrow, color) {
        const fromElement = document.getElementById(from);
        const toElement = document.getElementById(to);
        
        const coords = getMinDistance(fromElement, toElement);
        let angle = getAngle(coords);

        const line = document.getElementById('line-' + arrow.id);
        line.style.width = (coords[0] - 2) + 'px';
        arrow.style.width = (coords[0] - 2) + 'px';

        if (major(fromElement, toElement)) {
            angle += 180;  
        } 

        arrow.style.left = coords[1][0] + 'px';
        arrow.style.top = coords[1][1] + 'px';
        arrow.style.transform = 'rotate(' + angle + 'deg)';
        arrow.style.transformOrigin = '0 0';

        if (color) {
            line.style.borderColor = color;
            document.getElementById('arrow-' + arrow.id).style.borderLeft = '10px solid ' + color;
        }

        // console.log(angle);
        // console.log(coords);
    }

    function recalculateAll() {
        const arrows = document.getElementsByClassName('arrow-container');

        Array.from(arrows).forEach(element => {
            draw(element.dataset.from, element.dataset.to, element, element.dataset.color);
        });
    }

    function major (firstElement, secondElement) {
        const first = firstElement.getBoundingClientRect();
        const second = secondElement.getBoundingClientRect();

        return first.x > second.x;
    }

    function getAngle(coords) {
        const x1 = coords[1][0];
        const y1 = coords[1][1];

        const x2 = coords[2][0];
        const y2 = coords[2][1];

        return Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI;
    }

    function getMinDistance(from, to) {
        const fromElementCoords = from.getBoundingClientRect();
        const toElementCoords = to.getBoundingClientRect();
        
        let minFromFrom = -1;
        let minFromTo = -1;

        const fromWidth = fromElementCoords.right - fromElementCoords.left;
        const fromHeight = fromElementCoords.bottom - fromElementCoords.top;
        const toWidth = fromElementCoords.right - fromElementCoords.left;
        const toHeight = fromElementCoords.bottom - fromElementCoords.top;

        const totalToFrom = (fromWidth * 2) + (fromHeight * 2);
        const totalToTo = (toWidth * 2) + (toHeight * 2);

        let x1 = fromElementCoords.left;
        let y1 = fromElementCoords.top;

        let x2 = toElementCoords.left;
        let y2 = toElementCoords.top;

        let minDistance = 100000000;
        let distance = 0;

        for (let i = 1; i <= totalToFrom; i++) {
            for (let j = 1; j <= totalToTo; j++) {
                distance = getDistance(x1, y1, x2, y2);

                if (distance < minDistance) {
                    minDistance = distance;
                    minFromFrom = [x1, y1];
                    minFromTo = [x2, y2];
                }

                [x2, y2] = getNewCoords(x2, y2, toElementCoords);
            }

            x2 = toElementCoords.left;
            y2 = toElementCoords.top;

            [x1, y1] = getNewCoords(x1, y1, fromElementCoords);
        }

        return [minDistance, minFromFrom, minFromTo];
    }

    function getNewCoords(x, y, element) {
        if (x === element.right) {
            if (y === element.bottom) {
                x--;
            } else {
                y++;
            }
        } else {
            if (y === element.bottom) {
                if (x === element.left) {
                    if (y !== element.top) {
                        y--;
                    }
                } else {
                    x--;
                }
            } else {
                x++;
            }
        }

        return [x, y];
    }

    function getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function createArrow(id, from, to, container, color = 'black') {
        const divContainer = document.createElement('div');
        divContainer.className = 'arrow-container';
        divContainer.id = id;
        divContainer.dataset.from = from;
        divContainer.dataset.to = to;
        divContainer.dataset.color = color;

        const line = document.createElement('div');
        line.id = 'line-' + divContainer.id;
        line.className = 'line';
        const arrow = document.createElement('div');
        arrow.id = 'arrow-' + divContainer.id;
        arrow.className = 'arrow';

        divContainer.appendChild(line);
        divContainer.appendChild(arrow);
        container.appendChild(divContainer);
    }

    /* --- Observer --- */
    const observer = new MutationObserver((mutationList, observer) => { 
        mutationList.forEach((mutation)=> {
            recalculateAll();
        });
    });

    observer.observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true
    });
});