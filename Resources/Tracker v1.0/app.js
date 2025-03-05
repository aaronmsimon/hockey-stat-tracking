document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('dataForm');

    const dataRows = document.getElementById('dataRows');

    const exportButton = document.getElementById('exportButton');

    const column1 = document.getElementById('column1');

    const column2 = document.getElementById('column2');

    const column3 = document.getElementById('column3');

    const editIndex = document.getElementById('editIndex');

    const cancelButton = document.getElementById('cancelButton');

 

    // Load and display existing data

    function loadData() {

        const data = JSON.parse(localStorage.getItem('data')) || [];

        dataRows.innerHTML = '';

        data.forEach((item, index) => {

            const row = document.createElement('tr');

            row.innerHTML = `

                <td>${item.column1}</td>

                <td>${item.column2}</td>

                <td>${item.column3}</td>

                <td>

                    <button id="row_${index}" class="editButton"><i class="fas fa-pencil-alt"></i></button>

                    <button class="deleteButton"><i class="fas fa-trash-alt"></i></button>

                </td>

            `;

            const editButton = row.querySelector('.editButton');

            const deleteButton = row.querySelector('.deleteButton');

            editButton.addEventListener('click', () => editItem(item, index));

            deleteButton.addEventListener('click', () => deleteItem(index));

            dataRows.appendChild(row);

        });

    }

 

    // Handle form submission

    form.addEventListener('submit', (e) => {

        e.preventDefault();

        const data = JSON.parse(localStorage.getItem('data')) || [];

        const index = parseInt(editIndex.value);

 

        if (index === -1) {

            // Add new item

            data.push({ column1: column1.value, column2: column2.value, column3: column3.value });

        } else {

            // Edit existing item

            data[index] = { column1: column1.value, column2: column2.value, column3: column3.value };

            editIndex.value = -1; // Reset edit index

            cancelButton.style.display = 'none';

        }

 

        localStorage.setItem('data', JSON.stringify(data));

        form.reset();

        loadData();

    });

 

    // Edit item

    function editItem(item, index) {

        column1.value = item.column1;

        column2.value = item.column2;

        column3.value = item.column3;

                                if (editIndex.value != -1) {

                                                document.getElementById('row_' + editIndex.value).classList.remove('hidden');

                                }

        editIndex.value = index;

        cancelButton.style.display = 'inline-block';

                                document.getElementById('row_' + index).classList.add('hidden');

    }

 

    // Cancel editing

    cancelButton.addEventListener('click', () => {

        form.reset();

                                document.getElementById('row_' + editIndex.value).classList.remove('hidden');

        editIndex.value = -1;

        cancelButton.style.display = 'none';

    });

 

    // Delete item

    function deleteItem(index) {

        const data = JSON.parse(localStorage.getItem('data')) || [];

        data.splice(index, 1);

        localStorage.setItem('data', JSON.stringify(data));

        loadData();

    }

 

    // Export data

    exportButton.addEventListener('click', () => {

        const data = JSON.parse(localStorage.getItem('data')) || [];

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.href = url;

        a.download = 'data.json';

        a.click();

        URL.revokeObjectURL(url);

    });

 

    // Initial data load

    loadData();

});