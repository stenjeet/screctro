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
			await window.electronAPI.setSelectionArea(selection);
		}
	};

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				backgroundColor: 'rgba(0,0,0,0.1)',
				cursor: 'crosshair',
				userSelect: 'none',
				zIndex: 9999,
			}}
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
		>
			{selection && (
				<div
					style={{
						position: 'absolute',
						border: '1px solid #ffffff',
						left: selection.x,
						top: selection.y,
						width: selection.width,
						height: selection.height,
					}}
				/>
			)}
		</div>
	);
};

export default Overlay;
