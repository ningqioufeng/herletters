
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BoardImage, PaperState, Position, ToolType, Size, StickerItem } from './types';
// 导入@zumer/snapdom
import { snapdom } from '@zumer/snapdom';

// --- Assets & Icons ---

const TextIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#25586B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7V4h16v3" />
    <path d="M9 20h6" />
    <path d="M12 4v16" />
  </svg>
);

const PhotoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#25586B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const StickerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#25586B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const BackgroundIcon = () => (
  <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <img 
      src="/bgcolor.png" 
      alt="背景颜色" 
      width="28" 
      height="28" 
      style={{ display: 'block' }}
    />
  </div>
);

const BucketIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#25586B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 11l-8-8-9 9 8 8 5-5 9-9z"/>
    <path d="M22 13l-5 5"/>
    <path d="M2 12l5-5"/>
  </svg>
);

const BulbIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#25586B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
    <path d="M9 21h6"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F0F4F8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const RotateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
  </svg>
);

const MoreIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="19" cy="12" r="1"></circle>
        <circle cx="5" cy="12" r="1"></circle>
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

// --- Styling Constants ---
const COLORS = {
  FRAME: '#25586B',      // Deep Teal Frame
  SIDEBAR: '#9AB9CE',    // Sidebar Background
  BOARD: '#E4DFD3',      // Main Board Background (Warm Beige)
  PAPER: '#EBCFB9',      // Peach Paper
  BTN_GLASS: 'rgba(255, 255, 255, 0.4)',
  BTN_HOVER: 'rgba(255, 255, 255, 0.7)',
  TEXT_DARK: '#2C3E50',
};

const AVAILABLE_FONTS = [
  { name: 'Caveat', label: 'Handwritten (En)' },
  { name: 'Shadows Into Light', label: 'Marker (En)' },
  { name: 'Inter', label: 'Sans Serif' },
  { name: 'Allura', label: 'Elegant Script (En)' },
  { name: 'Dancing Script', label: 'Cursive (En)' },
  { name: 'Ma Shan Zheng', label: '书法 (Ma Shan Zheng)' },
  { name: 'Zhi Mang Xing', label: '行书 (Zhi Mang Xing)' },
  { name: 'Long Cang', label: '草书 (Long Cang)' },
  { name: 'ZCOOL KuaiLe', label: '开心体' },
  { name: 'ZCOOL QingKe HuangYou', label: '黄油体' },
];

// --- Helper Hooks ---
const useDraggable = (
  initialPosition: Position, 
  onDragEnd: (pos: Position) => void,
  zIndex: number,
  onFocus: () => void,
  disabled: boolean = false
) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef<Position>({ x: 0, y: 0 });
  const positionRef = useRef(position);
  
  // 使用useRef缓存position状态
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Update internal state when props change
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.x, initialPosition.y]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    onFocus(); 
    setIsDragging(true);
    offset.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
  }, [disabled, onFocus]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isDragging) return;
    e.stopPropagation();
    e.preventDefault(); // Prevent scrolling while dragging
    onFocus();
    setIsDragging(true);
    const touch = e.touches[0];
    offset.current = {
      x: touch.clientX - positionRef.current.x,
      y: touch.clientY - positionRef.current.y,
    };
  }, [disabled, isDragging, onFocus]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    onDragEnd(positionRef.current);
  }, [onDragEnd]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newPos = {
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      };
      setPosition(newPos);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      const newPos = {
        x: touch.clientX - offset.current.x,
        y: touch.clientY - offset.current.y,
      };
      setPosition(newPos);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragEnd]);

  return { 
    position, 
    handleMouseDown, 
    handleTouchStart,
    isDragging, 
    style: { left: position.x, top: position.y, zIndex }
  };
}

const useResizable = (
  initialSize: Size,
  onResizeEnd: (size: Size) => void
) => {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const startPos = useRef<Position>({ x: 0, y: 0 });
  const startSize = useRef<Size>(initialSize);
  const sizeRef = useRef(size);
  
  // 使用useRef缓存size状态
  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = sizeRef.current;
  }, []);

  // Touch event handler for resizing
  const handleResizeTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startSize.current = sizeRef.current;
  }, []);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    onResizeEnd(sizeRef.current);
  }, [onResizeEnd]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      
      setSize({
        width: Math.max(100, startSize.current.width + deltaX),
        height: Math.max(100, startSize.current.height + deltaY),
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isResizing) return;
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - startPos.current.x;
      const deltaY = touch.clientY - startPos.current.y;
      
      setSize({
        width: Math.max(100, startSize.current.width + deltaX),
        height: Math.max(100, startSize.current.height + deltaY),
      });
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('mouseup', handleResizeEnd);
      window.addEventListener('touchend', handleResizeEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleResizeEnd);
      window.removeEventListener('touchend', handleResizeEnd);
    };
  }, [isResizing, handleResizeEnd]);

  return { size, handleResizeStart, handleResizeTouchStart, isResizing };
};

// Hook for scaling font size (used by Stickers)
const useScalable = (
    initialFontSize: number,
    onScaleEnd: (newFontSize: number) => void
) => {
    const [fontSize, setFontSize] = useState(initialFontSize);
    const [isScaling, setIsScaling] = useState(false);
    const startY = useRef(0);
    const startFontSize = useRef(initialFontSize);

    useEffect(() => {
        setFontSize(initialFontSize);
    }, [initialFontSize]);

    const handleScaleStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsScaling(true);
        startY.current = e.clientY;
        startFontSize.current = fontSize;
    };

    // Touch event handler for scaling
    const handleScaleTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsScaling(true);
        const touch = e.touches[0];
        startY.current = touch.clientY;
        startFontSize.current = fontSize;
    };

    // Support for pinch-to-zoom with two fingers
    const handlePinchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            e.stopPropagation();
            e.preventDefault();
            setIsScaling(true);
            startFontSize.current = fontSize;
        }
    };

    const handlePinchMove = (e: React.TouchEvent) => {
        if (!isScaling || e.touches.length !== 2) return;
        e.preventDefault();
        
        // Calculate distance between two touches
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        // Store initial distance if not already stored
        if (!initialPinchDistance.current) {
            initialPinchDistance.current = distance;
        }
        
        // Calculate scale factor based on pinch distance
        const scaleFactor = distance / initialPinchDistance.current;
        const newSize = Math.max(12, Math.min(200, startFontSize.current * scaleFactor));
        setFontSize(newSize);
    };

    const initialPinchDistance = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isScaling) return;
            // Dragging down increases size, up decreases
            const deltaY = e.clientY - startY.current;
            const scaleFactor = 1 + (deltaY * 0.005);
            const newSize = Math.max(12, Math.min(200, startFontSize.current * scaleFactor));
            setFontSize(newSize);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isScaling || e.touches.length !== 1) return;
            e.preventDefault();
            const touch = e.touches[0];
            const deltaY = touch.clientY - startY.current;
            const scaleFactor = 1 + (deltaY * 0.005);
            const newSize = Math.max(12, Math.min(200, startFontSize.current * scaleFactor));
            setFontSize(newSize);
        };

        const handleMouseUp = () => {
            if (isScaling) {
                setIsScaling(false);
                initialPinchDistance.current = 0;
                onScaleEnd(fontSize);
            }
        };

        const handleTouchEnd = () => {
            if (isScaling) {
                setIsScaling(false);
                initialPinchDistance.current = 0;
                onScaleEnd(fontSize);
            }
        };

        if (isScaling) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchend', handleTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isScaling, fontSize, onScaleEnd]);

    return { 
        fontSize, 
        handleScaleStart, 
        handleScaleTouchStart,
        handlePinchStart,
        handlePinchMove,
        isScaling 
    };
};

const useRotatable = (
  initialRotation: number,
  onRotateEnd: (deg: number) => void
) => {
  const [rotation, setRotation] = useState(initialRotation);
  const [isRotating, setIsRotating] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const startAngleRef = useRef(0);
  const startRotationRef = useRef(0);
  const rotationRef = useRef(rotation);
  
  // 使用useRef缓存rotation状态
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  const handleRotateStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!elementRef.current) return;
    
    setIsRotating(true);
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    startAngleRef.current = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    startRotationRef.current = rotationRef.current;
  }, []);

  // Touch event handler for rotation
  const handleRotateTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!elementRef.current) return;
    
    setIsRotating(true);
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const touch = e.touches[0];
    
    startAngleRef.current = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
    startRotationRef.current = rotationRef.current;
  }, []);

  const handleRotateEnd = useCallback(() => {
    setIsRotating(false);
    onRotateEnd(rotationRef.current);
  }, [onRotateEnd]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isRotating || !elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const angleDelta = currentAngle - startAngleRef.current;
      const degDelta = angleDelta * (180 / Math.PI);
      
      setRotation(startRotationRef.current + degDelta);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isRotating || !elementRef.current) return;
      e.preventDefault();
      
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const touch = e.touches[0];
      
      const currentAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
      const angleDelta = currentAngle - startAngleRef.current;
      const degDelta = angleDelta * (180 / Math.PI);
      
      setRotation(startRotationRef.current + degDelta);
    };

    if (isRotating) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('mouseup', handleRotateEnd);
      window.addEventListener('touchend', handleRotateEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleRotateEnd);
      window.removeEventListener('touchend', handleRotateEnd);
    };
  }, [isRotating, handleRotateEnd]);

  return { 
    rotation, 
    handleRotateStart, 
    handleRotateTouchStart,
    isRotating, 
    elementRef 
  };
};

// --- Components ---

const Sidebar = ({ 
  onAddImage, 
  onAddSticker,
  onExport, 
  onToggleShadow,
  setPaperColor,
  onChangeFont,
  onChangeFontSize,
  activeTool,
  setActiveTool,
  setPaper,
  paperColor,
  currentFont, 
  currentFontSize, 
  setBgColor,
  shadowEnabled,
  onSaveAsDefault,
  sidebarVisible,
  setSidebarVisible
}: any) => {
  // 响应式检测
  const isSmallScreen = window.innerWidth < 768; // 手机尺寸
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024; // iPad尺寸
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onAddImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const quickColors = [
    '#EBCFB9', // Peach
    '#EAD985', // Yellow
    '#EAB9C5', // Pink
    '#B9EAC2'  // Green
  ];

  const extendedColors = [
    '#FFFFFF', // White
    '#D7D7D7', // Grey
    '#C4DEF6', // Blue
    '#E2C4F6', // Purple
    '#F6C4C4', // Reddish
    '#F6EAC4', // Cream
    '#C4F6D3', // Mint
    '#C4F6F2'  // Aqua
  ];

  const bgColors = [
    '#E4DFD3', // Classic Beige
    '#D3E4E2', // Soft Teal
    '#E4D3D3', // Dusty Rose
    '#D3D5E4', // Periwinkle
    '#F0F4F8', // Cool Grey
    '#181E23', // Dark Mode
  ];

  const fonts = [
    { name: 'Caveat', label: 'Handwritten (En)' },
    { name: 'Shadows Into Light', label: 'Marker (En)' },
    { name: 'Inter', label: 'Sans Serif' },
    { name: 'Allura', label: 'Elegant Script (En)' },
    { name: 'Dancing Script', label: 'Cursive (En)' },
    { name: 'Ma Shan Zheng', label: '书法 (Ma Shan Zheng)' },
    { name: 'Zhi Mang Xing', label: '行书 (Zhi Mang Xing)' },
    { name: 'Long Cang', label: '草书 (Long Cang)' },
    { name: 'ZCOOL KuaiLe', label: '开心体' },
    { name: 'ZCOOL QingKe HuangYou', label: '黄油体' },
  ];

  const aestheticEmojis = [
    '🌿', '🍄', '✨', '🌙', '☁️', '🌸', '🌷', '🌻',
    '📌', '📎', '🧸', '🤎', '🥨', '☕️', '📷', '📀',
    '🕯️', '🗝️', '💌', '📮'
  ];

  // 触摸友好的按钮样式 - 确保按钮至少44x44px以符合触屏标准
  const touchFriendlyButton = "min-w-[44px] min-h-[44px] active:scale-95 transition-transform duration-100 touch-manipulation focus:outline-none focus:ring-2 focus:ring-white/50";
  
  return (
    <div 
      className={`h-full w-[110px] sm:w-[90px] md:w-[110px] flex flex-col items-center py-6 gap-6 relative z-[10000] border-r border-white/20 shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative top-0 left-0`}
      style={{ backgroundColor: COLORS.SIDEBAR }}
    >
      {/* Close button for mobile */}
      <button
        className={`md:hidden absolute top-2 right-2 text-gray-700 p-2 rounded-full hover:bg-white/20 ${touchFriendlyButton}`}
        onClick={() => setSidebarVisible(false)}
        aria-label="Close sidebar"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      {/* Top Color Widget (Paper Colors) */}
      <div className="bg-[#F0F4F8] p-1.5 rounded-lg shadow-md w-20 flex flex-col gap-1 relative">
        <div className="grid grid-cols-2 gap-1.5">
          {quickColors.map((c) => (
             <div 
                key={c}
                onClick={() => setPaperColor(c)}
                className="w-full aspect-square rounded-[3px] cursor-pointer hover:opacity-80 transition-opacity border border-black/5 active:scale-90 transform-gpu"
                style={{ backgroundColor: c }}
                role="button"
                tabIndex={0}
             />
          ))}
        </div>
        <div 
            onClick={() => setActiveTool(activeTool === 'PAPER_EXT' ? 'NONE' : 'PAPER_EXT')}
            className={`w-full h-5 bg-[#4A90E2] rounded-[3px] flex items-center justify-center cursor-pointer hover:bg-[#357ABD] transition-colors ${touchFriendlyButton}`}
            role="button"
            tabIndex={0}
        >
            <MoreIcon />
        </div>

        {activeTool === 'PAPER_EXT' && (
             <div className="absolute left-[90px] top-0 bg-white p-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-left-2 z-[60] w-40">
                <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Paper Colors</p>
                <div className="grid grid-cols-4 gap-2">
                    {extendedColors.map(c => (
                        <div 
                 key={c}
                 onClick={() => { setPaperColor(c); setActiveTool('NONE'); }}
                 className={`w-10 h-10 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform active:scale-95 ${touchFriendlyButton}`}
                 style={{ backgroundColor: c }}
                 role="button"
                 tabIndex={0}
             />
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Tools */}
      <div className="flex flex-col gap-4 md:gap-6 w-full items-center mt-4 relative">
        
        {/* Font Settings */}
        <button 
          onClick={() => { 
            setActiveTool(activeTool === 'FONT' ? 'NONE' : 'FONT'); 
            if (isSmallScreen && activeTool !== 'FONT') setSidebarVisible(false);
          }}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm backdrop-blur-sm ${activeTool === 'FONT' ? 'ring-2 ring-[#25586B] scale-110' : ''} ${touchFriendlyButton}`}
          style={{ backgroundColor: COLORS.BTN_GLASS }}
          title="Change Font & Size"
        >
          <TextIcon />
        </button>

        {activeTool === 'FONT' && (
             <div className="absolute left-[100px] top-0 bg-white p-4 rounded-xl shadow-xl animate-in fade-in slide-in-from-left-2 z-[60] w-64">
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Size</span>
                        <span className="text-xs font-medium text-gray-400">{currentFontSize}px</span>
                    </div>
                    <input 
                        type="range" 
                        min="12" 
                        max="120" 
                        value={currentFontSize} 
                        onChange={(e) => onChangeFontSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#25586B]"
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <div className="h-px bg-gray-100 mb-3" />

                <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Font Family</p>
                <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {fonts.map(font => (
                        <button
                            key={font.name}
                            onClick={() => { onChangeFont(font.name); }}
                            className={`text-left px-3 py-3 rounded hover:bg-gray-100 transition-colors text-lg ${currentFont === font.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700'} ${touchFriendlyButton}`}
                            style={{ fontFamily: font.name }}
                        >
                            {font.label}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Image Upload */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm backdrop-blur-sm ${touchFriendlyButton}`}
          style={{ backgroundColor: COLORS.BTN_GLASS }}
          title="Add Photo"
        >
          <PhotoIcon />
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

        {/* Stickers & Text */}
        <button 
          onClick={() => setActiveTool(activeTool === 'STICKER' ? 'NONE' : 'STICKER')}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm backdrop-blur-sm ${activeTool === 'STICKER' ? 'ring-2 ring-[#25586B] scale-110' : ''} ${touchFriendlyButton}`}
          style={{ backgroundColor: COLORS.BTN_GLASS }}
          title="Add Sticker or Text"
        >
          <StickerIcon />
        </button>

         {activeTool === 'STICKER' && (
             <div className="absolute left-[100px] top-[140px] bg-white p-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-left-2 z-[60] w-56">
                <button
                        onClick={() => { onAddSticker('text'); setActiveTool('NONE'); }}
                        className={`w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg mb-4 font-semibold transition-colors ${touchFriendlyButton}`}
                    >
                        <PlusIcon /> Add Text
                    </button>
                
                <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Stickers</p>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                    {aestheticEmojis.map(emoji => (
                        <button
                            key={emoji}
                            onClick={() => { onAddSticker('emoji', emoji); setActiveTool('NONE'); }}
                            className={`text-2xl hover:scale-125 transition-transform p-3 ${touchFriendlyButton}`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>
        )}


        {/* Background Color */}
        <button 
          onClick={() => setActiveTool(activeTool === 'BG' ? 'NONE' : 'BG')}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm backdrop-blur-sm ${activeTool === 'BG' ? 'ring-2 ring-[#25586B] scale-110' : ''} ${touchFriendlyButton}`}
          style={{ backgroundColor: COLORS.BTN_GLASS }}
          title="Change Board Color"
        >
          <BackgroundIcon />
        </button>

        {/* Shadow Toggle */}
        <button 
          onClick={onToggleShadow}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm backdrop-blur-sm ${shadowEnabled ? 'bg-yellow-100/50 ring-2 ring-yellow-400/50' : ''} ${touchFriendlyButton}`}
          style={{ backgroundColor: shadowEnabled ? 'rgba(255, 240, 200, 0.4)' : COLORS.BTN_GLASS }}
          title="Toggle Shadow"
        >
          <BulbIcon />
        </button>

        {activeTool === 'BG' && (
            <div className="absolute left-[100px] top-[240px] bg-white p-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-left-2 z-[60] w-40">
               <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Board Color</p>
               <div className="grid grid-cols-2 gap-3">
                 {bgColors.map(c => (
                   <div 
                     key={c}
                     onClick={() => { setBgColor(c); setActiveTool('NONE'); }} 
                     className={`w-12 h-12 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform shadow-sm ${touchFriendlyButton}`}
                     style={{ backgroundColor: c }}
                   />
                 ))}
               </div>
            </div>
          )}

      </div>

      <div className="flex-1" />

      <button
        onClick={onSaveAsDefault}
        className={`w-16 h-16 rounded-full bg-[#4A6C85] text-white flex items-center justify-center transition-all hover:bg-[#3A5C75] shadow-lg mb-6 hover:scale-105 ${touchFriendlyButton}`}
        title="保存为默认样式"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
      </button>

      {/* Download */}
      <button 
        onClick={onExport}
        className={`w-16 h-16 rounded-full bg-[#4A6C85] text-white flex items-center justify-center transition-all hover:bg-[#3A5C75] shadow-lg mb-6 hover:scale-105 ${touchFriendlyButton}`}
      >
        <DownloadIcon />
      </button>

    </div>
  );
};

interface PaperProps {
    state: PaperState; 
    setState: (s: any) => void;
    zIndex: number;
    onFocus: () => void;
}

const LetterPaper = ({ 
  state, 
  setState, 
  zIndex, 
  onFocus 
}: PaperProps) => {
  const { position, handleMouseDown, style, isDragging } = useDraggable(
    state.position,
    (newPos) => setState({ ...state, position: newPos }),
    zIndex,
    onFocus
  );

  const { size, handleResizeStart } = useResizable(
    state.size,
    (newSize) => setState({ ...state, size: newSize })
  );
  
  // 响应式调整纸张尺寸
  const adjustPaperSize = () => {
    // 获取屏幕宽度
    const screenWidth = window.innerWidth;
    
    // 根据屏幕宽度调整纸张尺寸
    if (screenWidth < 768) { // 手机设备
      return { width: 280, height: 350 };
    } else if (screenWidth < 1024) { // iPad设备
      return { width: 400, height: 500 };
    }
    return size; // 保持原尺寸
  };
  
  const responsiveSize = adjustPaperSize();
  
  // 响应式调整字体大小
  const responsiveFontSize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      return Math.min(state.fontSize || 24, 20);
    } else if (screenWidth < 1024) {
      return Math.min(state.fontSize || 24, 22);
    }
    return state.fontSize || 24;
  };
  
  // 增加双击放大功能（移动端常用）
  const handleDoubleClick = () => {
    const newSize = (state.fontSize || 24) * 1.2;
    setState({ ...state, fontSize: newSize });
  };

  return (
    <div 
      className={`absolute transition-transform duration-200 ease-out ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} group touch-manipulation active:scale-98 transition-transform duration-100`}
      style={{
        ...style,
        width: responsiveSize.width,
        height: responsiveSize.height,
        transform: `rotate(${state.rotation}deg)`,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div 
        className="w-full h-full relative z-10"
        style={{
          backgroundColor: state.color,
          boxShadow: '20px 24px 45px rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.15)', 
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('/cream-paper.png')] pointer-events-none mix-blend-multiply"></div>

        <div className="w-full h-full p-4 sm:p-6 md:p-8 relative z-10">
          <textarea
            className="w-full h-full bg-transparent resize-none outline-none border-none leading-loose text-gray-800 opacity-90"
            style={{ 
                fontFamily: state.font || 'Caveat',
                fontSize: `${responsiveFontSize()}px`
            }}
            value={state.text}
            onChange={(e) => setState({...state, text: e.target.value})}
            placeholder="Write something..."
            spellCheck={false}
            onMouseDown={(e) => { e.stopPropagation(); onFocus(); }} 
            onFocus={onFocus}
            onDoubleClick={handleDoubleClick} 
          />
        </div>

        <div 
          className="absolute bottom-4 right-4 p-2 cursor-nwse-resize opacity-0 group-hover:opacity-100 z-50 transition-opacity"
          onMouseDown={handleResizeStart}
        >
          <div className="w-4 h-4 border-r-2 border-b-2 border-black/20"></div>
        </div>
      </div>
    </div>
  );
};

const PhotoItem: React.FC<{ 
  image: BoardImage;
  updateImage: (id: string, updates: Partial<BoardImage>) => void;
  onRemove: (id: string) => void;
  onFocus: () => void;
  isFocused: boolean;
}> = ({ 
  image, 
  updateImage, 
  onRemove, 
  onFocus,
  isFocused
}) => {
  // 响应式调整图片尺寸
  const getResponsiveImageSize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) { // 手机设备
      return { width: Math.min(image.width, 150), height: Math.min(image.height, 150 * (image.height / image.width)) };
    } else if (screenWidth < 1024) { // iPad设备
      return { width: Math.min(image.width, 200), height: Math.min(image.height, 200 * (image.height / image.width)) };
    }
    return { width: image.width, height: image.height };
  };
  
  const responsiveSize = getResponsiveImageSize();
  const { rotation, handleRotateStart, isRotating, elementRef } = useRotatable(
    image.rotation,
    (deg) => updateImage(image.id, { rotation: deg })
  );

  const { position, handleMouseDown, style, isDragging } = useDraggable(
    image.position,
    (newPos) => updateImage(image.id, { position: newPos }),
    image.zIndex,
    onFocus,
    isRotating
  );

  const { size, handleResizeStart } = useResizable(
    { width: image.width, height: image.height },
    (newSize) => updateImage(image.id, { width: newSize.width, height: newSize.height })
  );

  // 处理触摸事件，增强触屏支持
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleMouseDown(e as unknown as React.MouseEvent);
    onFocus();
  };
  
  // 优化的触摸反馈类
  const touchFeedbackClass = "active:scale-95 transition-transform duration-100 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-300";
  
  return (
    <div
      ref={elementRef}
      className={`absolute group transition-transform duration-75 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none ${touchFeedbackClass}`}
      style={{
        ...style,
        width: 'auto',
        transform: `rotate(${rotation}deg)`,
        zIndex: isDragging || isRotating ? 999 : image.zIndex,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div 
        className={`bg-white p-3 pb-3 shadow-xl hover:shadow-2xl transition-all duration-300 relative ${isFocused ? 'ring-2 ring-blue-400 ring-offset-4 ring-offset-transparent border-blue-400 border-dashed border' : ''}`}
        style={{
            boxShadow: '4px 8px 18px rgba(0,0,0,0.25)',
        }}
      >
        <div 
            className={`absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-ew-resize opacity-0 group-hover:opacity-100 transition-all z-30 text-gray-600 hover:text-blue-500 hover:scale-110 ${touchFeedbackClass}`}
            onMouseDown={handleRotateStart}
        >
            <RotateIcon />
            <div className="absolute top-full left-1/2 w-0.5 h-4 bg-white/80 -translate-x-1/2"></div>
        </div>

        <button 
            className={`absolute -top-4 -right-4 bg-white text-red-500 border border-gray-200 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md z-30 min-w-10 min-h-10 flex items-center justify-center ${touchFeedbackClass}`}
            onClick={(e) => { e.stopPropagation(); onRemove(image.id); }}
        >
            <TrashIcon />
        </button>

        <div 
            className="bg-gray-100 relative overflow-hidden border border-black/5"
            style={{ width: responsiveSize.width, height: responsiveSize.height }}
        >
          <img 
            src={image.src} 
            alt="Memory" 
            className="w-full h-full object-cover pointer-events-none block" 
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>
        </div>

        <div 
            className="pt-3 pb-1"
            style={{ width: size.width }}
        >
             <input 
                type="text" 
                className="w-full text-center text-gray-600 bg-transparent border-none outline-none placeholder:text-gray-300"
                style={{ 
                    fontFamily: image.font || 'Caveat',
                    fontSize: `${image.fontSize || 20}px` 
                }}
                placeholder="Add caption..."
                value={image.caption || ''}
                onChange={(e) => updateImage(image.id, { caption: e.target.value })}
                onMouseDown={(e) => { e.stopPropagation(); onFocus(); }} 
                onFocus={onFocus}
             />
        </div>

        <div 
          className={`absolute bottom-2 right-2 p-3 cursor-nwse-resize opacity-0 group-hover:opacity-100 z-50 transition-all ${touchFeedbackClass}`}
          onMouseDown={handleResizeStart}
        >
          <div className="w-5 h-5 border-r-2 border-b-2 border-gray-500 bg-white/50 rounded-sm"></div>
        </div>

      </div>
    </div>
  );
};

const StickerComponent: React.FC<{
  sticker: StickerItem;
  updateSticker: (id: string, updates: Partial<StickerItem>) => void;
  onRemove: (id: string) => void;
  onFocus: () => void;
  isFocused: boolean;
}> = ({ sticker, updateSticker, onRemove, onFocus, isFocused }) => {
  const touchFeedbackClass = "active:scale-95 transition-transform duration-100 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-300";
  const [showFontMenu, setShowFontMenu] = useState(false);
  
  // 响应式调整贴纸字体大小
  const getResponsiveFontSize = () => {
    const screenWidth = window.innerWidth;
    const baseSize = sticker.fontSize || (sticker.type === 'emoji' ? 64 : 32);
    
    if (screenWidth < 768) { // 手机设备
      return Math.min(baseSize, sticker.type === 'emoji' ? 48 : 24);
    } else if (screenWidth < 1024) { // iPad设备
      return Math.min(baseSize, sticker.type === 'emoji' ? 56 : 28);
    }
    return baseSize;
  };
    
  const { rotation, handleRotateStart, isRotating, elementRef } = useRotatable(
    sticker.rotation,
    (deg) => updateSticker(sticker.id, { rotation: deg })
  );

  const { position, handleMouseDown, style, isDragging } = useDraggable(
    sticker.position,
    (newPos) => updateSticker(sticker.id, { position: newPos }),
    sticker.zIndex,
    onFocus,
    isRotating
  );

  // Use scalable hook to update fontSize when resizing
  const { fontSize: dynamicFontSize, handleScaleStart, isScaling } = useScalable(
      getResponsiveFontSize(),
      (newSize) => updateSticker(sticker.id, { fontSize: newSize })
  );
  
  // 处理触摸事件，增强触屏支持
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleMouseDown(e as unknown as React.MouseEvent);
    onFocus();
  };
  
  // 增加双击放大功能
  const handleDoubleClick = () => {
    const currentSize = sticker.fontSize || (sticker.type === 'emoji' ? 64 : 32);
    updateSticker(sticker.id, { fontSize: currentSize * 1.2 });
  };

  return (
    <div
      ref={elementRef}
      className={`absolute group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none ${touchFeedbackClass}`}
      style={{
        ...style,
        transform: `rotate(${rotation}deg) scale(${sticker.scale})`,
        zIndex: isDragging || isRotating || isScaling ? 999 : sticker.zIndex,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDoubleClick={handleDoubleClick}
    >
        <div className={`relative p-2 ${isFocused ? 'border-2 border-dashed border-[#4A90E2] rounded-lg bg-white/10' : ''}`}>
             <div 
                className={`absolute -top-10 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center cursor-ew-resize opacity-0 group-hover:opacity-100 transition-all z-30 text-gray-600 ${touchFeedbackClass}`}
                onMouseDown={handleRotateStart}
            >
                <RotateIcon />
            </div>
             <button 
                className={`absolute -top-4 -right-4 bg-white text-red-500 border border-gray-200 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all shadow-md z-30 min-w-10 min-h-10 flex items-center justify-center ${touchFeedbackClass}`}
                onClick={(e) => { e.stopPropagation(); onRemove(sticker.id); }}
            >
                <TrashIcon />
            </button>

            {sticker.type === 'text' && (
                <>
                    <button 
                        className={`absolute -top-4 -left-4 bg-white text-gray-700 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md z-30 hover:bg-gray-50 hover:scale-110 ${touchFeedbackClass}`}
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            setShowFontMenu(!showFontMenu);
                        }}
                        title="Change Font"
                    >
                        <span className="font-serif font-bold text-sm">Aa</span>
                    </button>
                    
                    {showFontMenu && (
                        <div className="absolute -top-10 -left-64 bg-white p-2 rounded-lg shadow-xl z-40 w-48 max-h-60 overflow-y-auto border border-gray-200">
                            <div className="text-xs font-bold text-gray-500 px-2 py-1 uppercase tracking-wide">Select Font</div>
                            {AVAILABLE_FONTS.map(font => (
                                <button
                                    key={font.name}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateSticker(sticker.id, { font: font.name });
                                        setShowFontMenu(false);
                                    }}
                                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${sticker.font === font.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} ${touchFeedbackClass}`}
                                    style={{ fontFamily: font.name }}
                                >
                                    {font.label}
                                </button>
                            ))}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-gray-200 border-l rotate-45"></div>
                        </div>
                    )}
                </>
            )}

            {sticker.type === 'emoji' ? (
                <div 
                    className="drop-shadow-md cursor-default select-none"
                    style={{ fontSize: `${isScaling ? dynamicFontSize : (sticker.fontSize || 64)}px` }}
                >
                    {sticker.content}
                </div>
            ) : (
                <div className="min-w-[50px] min-h-[40px]">
                     <textarea
                        className="w-full h-full bg-transparent resize-none outline-none border-none text-gray-800 text-center whitespace-pre-wrap overflow-hidden"
                        style={{ 
                            fontFamily: sticker.font || 'Caveat',
                            fontSize: `${isScaling ? dynamicFontSize : (sticker.fontSize || 32)}px`,
                            lineHeight: '1.2'
                        }}
                        value={sticker.content}
                        onChange={(e) => updateSticker(sticker.id, { content: e.target.value })}
                        placeholder="Type here..."
                        spellCheck={false}
                        onMouseDown={(e) => { e.stopPropagation(); onFocus(); }} 
                        onFocus={onFocus}
                      />
                </div>
            )}

            {/* Resize handle for sticker (scales font size) */}
            <div 
                className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white border border-gray-300 rounded-full shadow cursor-nwse-resize opacity-0 group-hover:opacity-100 z-50 flex items-center justify-center ${touchFeedbackClass}`}
                onMouseDown={handleScaleStart}
            >
                <div className="w-2.5 h-2.5 bg-[#4A90E2] rounded-full"></div>
            </div>
        </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  // 尝试从localStorage加载默认布局，如果没有则使用默认值
  const loadDefaultLayout = () => {
    try {
      const savedLayout = localStorage.getItem('defaultLayout');
      if (savedLayout) {
        return JSON.parse(savedLayout);
      }
    } catch (error) {
      console.error('加载默认布局失败:', error);
    }
    // 返回默认值
    return {
      bgColor: COLORS.BOARD,
      shadowEnabled: true,
      paper: {
        color: COLORS.PAPER,
        text: "August 24th,\n\nThe light hits the kitchen table just like it did in our old house. I made coffee and thought of you.",
        position: { x: 50, y: 40 },
        rotation: 0,
        size: { width: 500, height: 600 },
        font: 'Caveat',
        fontSize: 24
      },
      images: [
        {
            id: '1',
            src: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 
            position: { x: 600, y: 120 },
            rotation: 2,
            width: 240,
            height: 240,
            zIndex: 2,
            caption: '',
            font: 'Caveat',
            fontSize: 20
        },
        {
            id: '2',
            src: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 
            position: { x: 600, y: 450 },
            rotation: -2,
            width: 240,
            height: 180, 
            zIndex: 3,
            caption: 'Work corner ☕️',
            font: 'Caveat',
            fontSize: 20
        },
        {
            id: '3',
            src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 
            position: { x: 1000, y: 430 },
            rotation: 4,
            width: 220,
            height: 220,
            zIndex: 5,
            caption: 'Miso ❤️',
            font: 'Caveat',
            fontSize: 20
        }
      ],
      stickers: [
          {
              id: 's1',
              type: 'emoji',
              content: '🌿',
              position: { x: 900, y: 80 },
              rotation: 15,
              scale: 1,
              zIndex: 6,
              fontSize: 72
          },
          {
              id: 's2',
              type: 'text',
              content: 'memories...',
              position: { x: 450, y: 650 },
              rotation: -5,
              scale: 1,
              zIndex: 6,
              font: 'Caveat',
              fontSize: 32
          }
      ]
    };
  };
  
  const defaultLayout = loadDefaultLayout();
  
  const [activeTool, setActiveTool] = useState<ToolType | 'BG' | 'FONT' | 'PAPER_EXT' | 'STICKER' | 'NONE'>('NONE');
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [shadowEnabled, setShadowEnabled] = useState(defaultLayout.shadowEnabled);
  const [focusedId, setFocusedId] = useState<string>('paper');
  const [bgColor, setBgColor] = useState(defaultLayout.bgColor);
  
  // 保存当前排版为默认样式的函数
  const saveAsDefaultLayout = () => {
    // 保存当前的排版样式到localStorage，刷新页面时将自动应用
    try {
      const defaultLayout = {
        paper: paper,
        images: images,
        stickers: stickers,
        bgColor: bgColor,
        shadowEnabled: shadowEnabled
      };
      localStorage.setItem('defaultLayout', JSON.stringify(defaultLayout));
      console.log('已将当前排版保存为默认样式');
      
      // 提示用户保存成功
      alert('当前排版已保存为默认样式！下次打开应用将自动使用此排版。');
    } catch (error) {
      console.error('保存默认样式失败:', error);
      alert('保存默认样式失败，请稍后重试。');
    }
  };

  const [paper, setPaper] = useState<PaperState>(defaultLayout.paper);

  const [stickers, setStickers] = useState<StickerItem[]>(defaultLayout.stickers);

  const [images, setImages] = useState<BoardImage[]>(defaultLayout.images);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleAddImage = (src: string) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        const aspect = img.width / img.height;
        const initialWidth = 240;
        const initialHeight = initialWidth / aspect;

        const newImage: BoardImage = {
          id: Date.now().toString(),
          src,
          position: { x: 600 + (Math.random() * 50), y: 150 + (Math.random() * 50) },
          rotation: (Math.random() * 6) - 3,
          width: initialWidth,
          height: initialHeight,
          zIndex: maxZIndex + 1,
          font: 'Caveat',
          fontSize: 20
        };
        setMaxZIndex(prev => prev + 1);
        setImages(prev => [...prev, newImage]);
        setFocusedId(newImage.id); 
    };
  };

  const handleAddSticker = (type: 'emoji' | 'text', content: string = '') => {
      const newSticker: StickerItem = {
          id: Date.now().toString(),
          type,
          content: content,
          position: { x: 600 + (Math.random() * 50), y: 300 + (Math.random() * 50) },
          rotation: (Math.random() * 10) - 5,
          scale: 1,
          zIndex: maxZIndex + 1,
          font: 'Caveat', 
          fontSize: type === 'emoji' ? 64 : 32
      };
      setMaxZIndex(prev => prev + 1);
      setStickers(prev => [...prev, newSticker]);
      setFocusedId(newSticker.id); 
  }

  const updateImage = (id: string, updates: Partial<BoardImage>) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, ...updates } : img));
  };

  const updateSticker = (id: string, updates: Partial<StickerItem>) => {
      setStickers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (focusedId === id) setFocusedId('paper');
  };
  
  const removeSticker = (id: string) => {
      setStickers(prev => prev.filter(s => s.id !== id));
      if (focusedId === id) setFocusedId('paper');
  }

  const bringToFront = (id: string | 'paper') => {
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    setFocusedId(id);

    if (id === 'paper') return;

    // Check stickers and update zIndex
    const isSticker = stickers.some(s => s.id === id);
    if (isSticker) {
        setStickers(prev => prev.map(s => s.id === id ? { ...s, zIndex: newZ } : s));
        return;
    }

    // Check images and update zIndex
    const isImage = images.some(img => img.id === id);
    if (isImage) {
        setImages(prev => prev.map(img => img.id === id ? { ...img, zIndex: newZ } : img));
    }
  };

  const handleFontChange = (fontName: string) => {
      if (focusedId === 'paper') {
          setPaper(p => ({ ...p, font: fontName }));
          return;
      }

      const targetSticker = stickers.find(s => s.id === focusedId);
      if (targetSticker) {
          updateSticker(focusedId, { font: fontName });
          return;
      }

      const targetImage = images.find(img => img.id === focusedId);
      if (targetImage) {
          updateImage(focusedId, { font: fontName });
          return;
      }
      
      // Fallback
      setPaper(p => ({ ...p, font: fontName }));
  };

  const handleFontSizeChange = (size: number) => {
      if (focusedId === 'paper') {
          setPaper(p => ({ ...p, fontSize: size }));
          return;
      }

      const targetSticker = stickers.find(s => s.id === focusedId);
      if (targetSticker) {
          updateSticker(focusedId, { fontSize: size });
          return;
      }

      const targetImage = images.find(img => img.id === focusedId);
      if (targetImage) {
          updateImage(focusedId, { fontSize: size });
          return;
      }

       setPaper(p => ({ ...p, fontSize: size }));
  };

  const getCurrentFont = () => {
      if (focusedId === 'paper') return paper.font;
      
      const targetSticker = stickers.find(s => s.id === focusedId);
      if (targetSticker && targetSticker.type === 'text') return targetSticker.font || 'Caveat';
      
      const targetImage = images.find(img => img.id === focusedId);
      if (targetImage) return targetImage.font || 'Caveat';

      return paper.font || 'Caveat'; 
  };

   const getCurrentFontSize = () => {
      if (focusedId === 'paper') return paper.fontSize || 24;
      
      const targetSticker = stickers.find(s => s.id === focusedId);
      if (targetSticker) return targetSticker.fontSize || (targetSticker.type === 'emoji' ? 64 : 32);
      
      const targetImage = images.find(img => img.id === focusedId);
      if (targetImage) return targetImage.fontSize || 20;

      return paper.fontSize || 24; 
  };


  const handleExport = async () => {
    try {
      // 查找主体内容区域，优先使用id为'board'的元素
      const contentElement = document.getElementById('board') || 
                           document.querySelector('main') || 
                           document.querySelector('section') ||
                           document.body;
      
      // 获取内容区域的边界
      const contentRect = contentElement.getBoundingClientRect();
      
      // 截取包含实际内容的区域，通过配置选项排除空白
      const imageElement = await snapdom.toPng(contentElement, {
        scale: 2,
        backgroundColor: 'transparent',
        embedFonts: true,
        // 通过clip配置可以精确裁剪，但这里先使用元素选择来减少空白
      });
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = imageElement.src; // 使用imageElement的src属性
      link.download = `memory-board-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      
      // 清理
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
  };

  // 控制侧边栏在移动设备上的显示状态
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  return (
    <div 
      className="w-screen h-screen overflow-hidden flex flex-col sm:flex-row items-center justify-center p-4"
      style={{ backgroundColor: '#181E23' }} 
    >
      <div 
        className="w-full h-full flex flex-col sm:flex-row relative overflow-hidden shadow-2xl"
        style={{ 
            backgroundColor: COLORS.FRAME,
            border: `8px solid ${COLORS.FRAME}`,
            borderRadius: '8px'
        }}
      >
        {/* 移动端侧边栏切换按钮 */}
        <button 
          className="absolute top-4 right-4 z-50 md:hidden bg-white/80 p-2 rounded-full shadow-lg"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.FRAME} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {sidebarVisible ? (
              <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            ) : (
              <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
            )}
          </svg>
        </button>
        
        <Sidebar 
          activeTool={activeTool} 
          setActiveTool={setActiveTool}
          onAddImage={handleAddImage}
          onAddSticker={handleAddSticker}
          onExport={handleExport}
          onToggleShadow={() => setShadowEnabled(!shadowEnabled)}
          paperColor={paper.color}
          setPaperColor={(c: string) => setPaper(p => ({...p, color: c}))}
          onChangeFont={handleFontChange}
          onChangeFontSize={handleFontSizeChange}
          currentFont={getCurrentFont()}
          currentFontSize={getCurrentFontSize()}
          setBgColor={setBgColor}
          shadowEnabled={shadowEnabled}
          setPaper={setPaper}
          onSaveAsDefault={saveAsDefaultLayout}
        />

        <div 
          ref={boardRef}
          className="flex-1 h-full relative overflow-hidden transition-colors duration-500"
          style={{ 
              backgroundColor: bgColor,
              border: '16px solid #4A6D7C', 
              boxShadow: 'inset 3px 3px 22px 6px rgba(0,0,0,0.6), inset 0 0 50px 10px rgba(0,0,0,0.3)'
          }}
          onClick={() => { setActiveTool('NONE'); setFocusedId('paper'); }}
        >
          {shadowEnabled && (
             <div className="absolute -inset-40 z-[5000] pointer-events-none no-export" 
                  style={{
                      backgroundImage: 'url(/lightshadow1.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'right',
                      opacity: 1,
                      mixBlendMode: 'multiply'
                  }}
             />
          )}

           <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-[4900]"></div>

          <LetterPaper 
            state={paper} 
            setState={setPaper} 
            zIndex={1} 
            onFocus={() => bringToFront('paper')}
          />

          {images.map(img => (
            <PhotoItem 
              key={img.id} 
              image={img} 
              updateImage={updateImage} 
              onRemove={removeImage}
              onFocus={() => bringToFront(img.id)}
              isFocused={focusedId === img.id}
            />
          ))}

          {stickers.map(sticker => (
              <StickerComponent
                key={sticker.id}
                sticker={sticker}
                updateSticker={updateSticker}
                onRemove={removeSticker}
                onFocus={() => bringToFront(sticker.id)}
                isFocused={focusedId === sticker.id}
              />
          ))}

        </div>
      </div>
    </div>
  );
}
