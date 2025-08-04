import { useCallback } from 'react';

// Legacy client logic from old/src/client/client.js
// Refactored for Next.js and TypeScript as needed.

export const DRAG_OVER_COLOR = '#14908E';
export const DRAG_LEAVE_COLOR = 'yellow';

export function setBackGroundColor(ev: Event, color: string) {
    (ev.target as HTMLElement).style.backgroundColor = color;
}

export function setBackGroundColorOpacity(ev: Event, opacity: number) {
    (ev.target as HTMLElement).style.opacity = opacity.toString();
}

export function preventFileToOpen(ev: Event) {
    ev.preventDefault();
}

export function deactivateUploadArea() {
    const dropArea = document.getElementById('drop-zone');
    if (dropArea) {
        dropArea.style.pointerEvents = 'none';
        dropArea.style.opacity = '0.5';
    }
}

export function jumpTo(target: string) {
    const kontaktHeader = document.getElementById(target);
    if (kontaktHeader) {
        kontaktHeader.scrollIntoView({ behavior: 'smooth' });
    }
}

export function useDragAndDrop(onDrop: (files: FileList) => void) {
    const handleDragOver = useCallback((ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        setBackGroundColor(ev.nativeEvent, DRAG_OVER_COLOR);
        setBackGroundColorOpacity(ev.nativeEvent, 0.8);
    }, []);

    const handleDragLeave = useCallback((ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        setBackGroundColor(ev.nativeEvent, DRAG_LEAVE_COLOR);
        setBackGroundColorOpacity(ev.nativeEvent, 1);
    }, []);

    const handleDrop = useCallback((ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        setBackGroundColor(ev.nativeEvent, '');
        setBackGroundColorOpacity(ev.nativeEvent, 1);
        if (ev.dataTransfer?.files && ev.dataTransfer.files.length > 0) {
            onDrop(ev.dataTransfer.files);
        }
    }, [onDrop]);

    return {
        handleDragOver,
        handleDragLeave,
        handleDrop,
    };
}
