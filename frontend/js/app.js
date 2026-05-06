const fileInput = document.getElementById("csvFile");
const uploadBtn = document.getElementById("uploadBtn");

let uploadedData = [];
let originalData = [];
let currentFileId = null;
let selectedColumns = [];

function triggerFileInput() {
    fileInput.click();
}

uploadBtn.addEventListener("click", uploadCSV);

async function uploadCSV() {

    const file = fileInput.files[0];

    if (!file) {
        alert("Please select CSV file");
        return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

        const response = await fetch(
            "https://csv-filter-platform.onrender.com/api/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        uploadedData = data.preview;
        originalData = data.preview;

        currentFileId = data.file_id;

        selectedColumns = [...data.columns];

        displayFileInfo(data);

        displayColumns(data.columns);

        displayTable(uploadedData);

        alert("Upload Successful!");

    } catch (error) {

        console.error("UPLOAD ERROR:", error);

        alert("Upload failed");
    }
}

function displayFileInfo(data) {

    document.getElementById("filename").textContent =
        data.filename;

    document.getElementById("totalRows").textContent =
        data.total_rows;
}

function displayColumns(columns) {

    const container =
        document.getElementById("columnsContainer");

    container.innerHTML = "";

    // FILTER DROPDOWNS
    const filterSelects =
        document.querySelectorAll(".columnSelect");

    filterSelects.forEach(select => {

        select.innerHTML =
            '<option value="">Select Column</option>';

        columns.forEach(column => {

            const option =
                document.createElement("option");

            option.value = column;

            option.textContent = column;

            select.appendChild(option);
        });
    });

    // SORT DROPDOWN
    const sortSelect =
        document.getElementById("sortColumn");

    if (sortSelect) {

        sortSelect.innerHTML =
            '<option value="">Select Column</option>';

        columns.forEach(column => {

            const option =
                document.createElement("option");

            option.value = column;

            option.textContent = column;

            sortSelect.appendChild(option);
        });
    }

    // COLUMN CHECKBOXES
    columns.forEach(column => {

        const wrapper =
            document.createElement("label");

        wrapper.className = "column-chip";

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.value = column;

        checkbox.className = "column-checkbox";

        checkbox.checked = true;

        wrapper.appendChild(checkbox);

        wrapper.append(" " + column);

        container.appendChild(wrapper);
    });
}

function displayTable(rows) {

    const table =
        document.getElementById("dataTable");

    table.innerHTML = "";

    if (!rows.length) return;

    // Header
    const headerRow = document.createElement("tr");

    Object.keys(rows[0]).forEach(key => {

        const th = document.createElement("th");

        th.textContent = key;

        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    // Rows
    rows.forEach(row => {

        const tr = document.createElement("tr");

        Object.values(row).forEach(value => {

            const td = document.createElement("td");

            td.textContent = value;

            tr.appendChild(td);
        });

        table.appendChild(tr);
    });
}

// SEARCH
document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const search =
            this.value.toLowerCase();

        const filtered =
            uploadedData.filter(row =>
                Object.values(row)
                    .join(" ")
                    .toLowerCase()
                    .includes(search)
            );

        displayTable(filtered);
    });


// APPLY FILTER
document
    .getElementById("applyFilterBtn")
    .addEventListener("click", applyFilter);

    async function applyFilter() {

        const columnSelects =
            document.querySelectorAll(".columnSelect");
    
        const operatorSelects =
            document.querySelectorAll(".operatorSelect");
    
        const valueInputs =
            document.querySelectorAll(".filterValue");
    
        const filters = [];
    
        for (let i = 0; i < columnSelects.length; i++) {
    
            const column = columnSelects[i].value;
            const operator = operatorSelects[i].value;
            const value = valueInputs[i].value;
    
            if (column && value) {
    
                filters.push({
                    column,
                    operator,
                    value
                });
            }
        }
    
        if (!filters.length) {
            alert("Add at least one filter");
            return;
        }
    
        try {
    
            const response = await fetch(
                "https://csv-filter-platform.onrender.com/api/filter",
                {
                    method: "POST",
    
                    headers: {
                        "Content-Type": "application/json"
                    },
    
                    body: JSON.stringify({
                        file_id: currentFileId,
                        filters
                    })
                }
            );
    
            const data = await response.json();
    
            if (data.error) {
                alert(data.error);
                return;
            }
    
            let filteredRows = data.filtered_data;
    
            if (selectedColumns.length) {
    
                filteredRows = filteredRows.map(row => {
    
                    const filteredRow = {};
    
                    selectedColumns.forEach(column => {
                        filteredRow[column] = row[column];
                    });
    
                    return filteredRow;
                });
            }
    
            uploadedData = filteredRows;
    
            document.getElementById("totalRows")
                .textContent = data.total_rows;
    
            displayTable(filteredRows);
    
        } catch (error) {
    
            console.error(error);
    
            alert("Filtering failed");
        }
    }


// COLUMN PREVIEW
document
    .getElementById("applyColumnsBtn")
    .addEventListener("click", previewSelectedColumns);

async function previewSelectedColumns() {

    const checkboxes =
        document.querySelectorAll(".column-checkbox");

    selectedColumns = [];

    checkboxes.forEach(checkbox => {

        if (checkbox.checked) {
            selectedColumns.push(checkbox.value);
        }
    });

    if (!selectedColumns.length) {
        alert("Select at least one column");
        return;
    }

    try {

        const response = await fetch(
            "https://csv-filter-platform.onrender.com/api/select-columns",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    file_id: currentFileId,
                    columns: selectedColumns
                })
            }
        );

        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        uploadedData = data.preview;

        document.getElementById("totalRows")
            .textContent = data.total_rows;

        displayTable(uploadedData);

    } catch (error) {

        console.error(error);

        alert("Column preview failed");
    }
}


// DOWNLOAD CSV
document
    .getElementById("downloadBtn")
    .addEventListener("click", downloadCSV);

async function downloadCSV() {

    if (!uploadedData.length) {
        alert("No data available");
        return;
    }

    try {

        const response = await fetch(
            "https://csv-filter-platform.onrender.com/api/download",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    rows: uploadedData
                })
            }
        );

        if (!response.ok) {
            throw new Error("Download failed");
        }

        const blob = await response.blob();

        const url =
            window.URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download = "filtered_data.csv";

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

    } catch (error) {

        console.error(error);

        alert("Download failed");
    }
}
// ADD NEW FILTER
document
    .getElementById("addFilterBtn")
    .addEventListener("click", addFilterRow);

function addFilterRow() {

    const container =
        document.getElementById("filtersContainer");

    const filterRow =
        document.createElement("div");

    filterRow.className = "filter-controls";

    filterRow.innerHTML = `
        <select class="columnSelect">
            <option value="">Select Column</option>
        </select>

        <select class="operatorSelect">
            <option value="==">Equals</option>
            <option value="!=">Not Equals</option>
            <option value=">">Greater Than</option>
            <option value="<">Less Than</option>
            <option value="contains">Contains</option>
        </select>

        <input
            type="text"
            class="filterValue"
            placeholder="Enter value"
        >
    `;

    container.appendChild(filterRow);

    populateFilterDropdowns();
}

function populateFilterDropdowns() {

    const filterSelects =
        document.querySelectorAll(".columnSelect");

    filterSelects.forEach(select => {

        const currentValue = select.value;

        select.innerHTML =
            '<option value="">Select Column</option>';

        selectedColumns.forEach(column => {

            const option =
                document.createElement("option");

            option.value = column;

            option.textContent = column;

            select.appendChild(option);
        });

        select.value = currentValue;
    });
}

// SORTING
document
    .getElementById("sortBtn")
    .addEventListener("click", sortData);

function sortData() {

    const column =
        document.getElementById("sortColumn").value;

    const order =
        document.getElementById("sortOrder").value;

    if (!column) {
        alert("Select sort column");
        return;
    }

    uploadedData.sort((a, b) => {

        if (a[column] < b[column]) {
            return order === "asc" ? -1 : 1;
        }

        if (a[column] > b[column]) {
            return order === "asc" ? 1 : -1;
        }

        return 0;
    });

    displayTable(uploadedData);
}


