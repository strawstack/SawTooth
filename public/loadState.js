export function loadState({ menuName, downloadFileNameExt, save, load}) {

    if (menuName === undefined) menuName = "loadState";
    if (downloadFileNameExt === undefined) downloadFileNameExt = "save.json";

    if (save === undefined) save = () => "example save data";
    if (load === undefined) load = (data) => console.log(`Loaded: ${data}`);

    addHTML();

    const qs = s => document.querySelector(s);

    const summary = qs(".loadState>summary");
    summary.innerHTML = menuName;

    const input = qs(".loadState>.btns>#file");
    input.addEventListener("change", e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            load(readerEvent.target.result);
        };
    });

    function download(filename, text) {
        var link = document.createElement('a');
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        link.setAttribute('download', filename);
        link.click();
    }

    const saveBtn = qs(".loadState>.btns>.save");
    saveBtn.addEventListener("click", e => {
        const data = save();
        download(downloadFileNameExt, data);
    });

    function addHTML() {
        const { body } = document;
        body.appendChild(getHTML());
    }

    function getHTML() {
        const div = document.createElement("div");
        div.innerHTML = getHTMLString();
        return div.querySelector(".loadState");
    }

    function getHTMLString() {
        return `
<details class="loadState">
    <summary>loadState</summary>
    <div class="btns">
        <div class="save">Save</div>
        <label class="load" for="file">Load</label>
        <input id="file" name="file" type="file" style="display: none;"></input>
    </div>
    <style>
        .loadState {
            font-family: Arial, Helvetica, sans-serif;
            padding: 10px;
            background: lightgrey;
            color: #777;
            font-size: 1.2rem;
            width: 120px;
            z-index: 1000;
            position: absolute;
            top: 20px;
            right: 20px;
            user-select: none;

            .btns {
                display: grid;
                grid-template-rows: repeat(2, 1fr);

                .save, .load {
                    margin-top: 10px;
                    background: #777;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 40px;
                    transition: background 0.2s;

                    &:hover {
                        background: #222;
                    }
                }
            }
        }
    </style>
</details>`;
    }
}
