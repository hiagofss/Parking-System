"use strict";
(function () {
    const $ = (query) => document.querySelector(query);
    function park() {
        function calulateTime(time) {
            const minutes = Math.floor(time / 60000);
            const seconds = Math.floor((time % 60000) / 1000);
            return `${minutes}m e ${seconds}s`;
        }
        function view() {
            return localStorage.park ? JSON.parse(localStorage.park) : [];
        }
        function save(vehicles) {
            localStorage.setItem('park', JSON.stringify(vehicles));
        }
        function add(vehicle, saveInStorage) {
            const row = document.createElement('tr');
            row.innerHTML = `
      <td>${vehicle.name}</td>
      <td>${vehicle.plate}</td>
      <td>${vehicle.startDate}</td>
      <td>
      <button class="delete" data-plate="${vehicle.plate}">
      X
      </button>
      </td>
      `;
            row.querySelector('.delete').addEventListener('click', function () {
                remove(this.dataset.plate);
            });
            $('#park').appendChild(row);
            if (saveInStorage)
                save([...view(), vehicle]);
        }
        function remove(plate_car) {
            const { name, plate, startDate } = view().find((vehicle) => vehicle.plate === plate_car);
            const time = calulateTime(new Date().getTime() - new Date(startDate).getTime());
            if (!confirm(`The vehicle ${name}, persist for ${time} time.`))
                return;
            save(view().filter((vehicle) => vehicle.plate !== plate_car));
            render();
        }
        function render() {
            $('#park').innerHTML = '';
            const park = view();
            if (park.length) {
                park.forEach((vehicle) => {
                    add(vehicle);
                });
            }
        }
        return { view, add, remove, save, render };
    }
    park().render();
    $('#register').addEventListener('click', () => {
        const name = $('#name').value;
        const plate = $('#plate').value;
        if (!name || !plate) {
            alert('The name and plate is required!');
            return;
        }
        park().add({ name, plate, startDate: new Date().toISOString() }, true);
    });
})();
