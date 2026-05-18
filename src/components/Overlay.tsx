import React, { useRef, useState } from 'react';

const Overlay = () => {
	const [isDragging, setIsDragging] = useState(false);
	const [selection, setSelection] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
	const startPoint = useRef<{ x: number; y: number } | null>(null);


	const onMouseDown = (e: React.MouseEvent) => {
		startPoint.current = { x: e.clientX, y: e.clientY };
		setSelection({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
		setIsDragging(true);
	};

	const onMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || !startPoint.current) return;

		const x = Math.min(e.clientX, startPoint.current.x);
		const y = Math.min(e.clientY, startPoint.current.y);
		const width = Math.abs(e.clientX - startPoint.current.x);
		const height = Math.abs(e.clientY - startPoint.current.y);

		setSelection({ x, y, width, height });
	};

	const onMouseUp = async () => {
		setIsDragging(false);
		const sel = selection;
		setSelection(null)
		if (sel) {
			await window.electronAPI.setSelectionArea(sel);
		}
	};

	const currentSelection = selection ?? { x: 0, y: 0, width: 0, height: 0 };

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				backgroundColor: 'transparent',
				cursor: 'crosshair',
				userSelect: 'none',
				zIndex: 9999,
			}}
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
		>
			<div
				style={{
					position: 'absolute',
					border: selection ? '1px solid #ffffff' : 'none',
					backgroundColor: 'transparent',
					boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
					left: currentSelection.x,
					top: currentSelection.y,
					width: currentSelection.width,
					height: currentSelection.height,
				}}
			/>
		</div>
	);
};

export default Overlay;