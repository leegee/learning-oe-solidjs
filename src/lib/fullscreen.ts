export function enterFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) {
        el.requestFullscreen();
    }
}

export function exitFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}
