////////////////////////////////////////
// Lag en ControlInput modul som holder tilstand på venstre/høyre.
////////////////////////////////////////
const LEFT = 'a';
const RIGHT = 'd';

export default function controlsInput() {
    const controls = {left: false, right: false};

    document.addEventListener("keydown", (ev: KeyboardEvent) => {
        controls.left = ev.key === LEFT;
        controls.right = ev.key === RIGHT;
    });
    document.addEventListener("keyup", () => {
        controls.left = controls.right = false;
    });
    return controls;
};
