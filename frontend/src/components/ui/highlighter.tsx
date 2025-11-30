"use client";
import React, { useState, useEffect, useRef, JSX } from 'react';
import { Highlighter, StickyNote, X } from 'lucide-react';
import {Button} from "@/components/ui/button";
import { Textarea } from './textarea';
interface Highlight {
  id: string;
  text: string;
  color: string;
  range: { start: number; end: number };
  note?: string;
}

interface TextHighlighterProps {
  content: string;
  passageId: string;
}

const TextHighlighter: React.FC<TextHighlighterProps> = ({ content, passageId }) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [pendingHighlight, setPendingHighlight] = useState<Highlight | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load highlights từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`highlights-${passageId}`);
    if (saved) {
      setHighlights(JSON.parse(saved));
    }
  }, [passageId]);

  // Save highlights vào localStorage
  useEffect(() => {
    if (highlights.length > 0) {
      localStorage.setItem(`highlights-${passageId}`, JSON.stringify(highlights));
    }
  }, [highlights, passageId]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length === 0) {
      setShowMenu(false);
      return;
    }

    // Lấy vị trí của text được chọn
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Tính toán vị trí của menu
    const menuX = rect.left + rect.width / 2;
    const menuY = rect.top - 60;

    setSelectedText(selectedText);
    setMenuPosition({ x: menuX, y: menuY });
    setShowMenu(true);

    // Lưu range để dùng sau
    if (contentRef.current) {
      const textContent = contentRef.current.textContent || '';
      const start = textContent.indexOf(selectedText);
      const end = start + selectedText.length;
      setSelectedRange({ start, end });
    }
  };

  const addHighlight = (color: string) => {
    if (!selectedText || !selectedRange) return;

    const newHighlight: Highlight = {
      id: Date.now().toString(),
      text: selectedText,
      color: color,
      range: selectedRange,
    };

    setHighlights([...highlights, newHighlight]);
    setShowMenu(false);
    window.getSelection()?.removeAllRanges();
  };

  const addHighlightWithNote = (color: string) => {
    if (!selectedText || !selectedRange) return;

    const newHighlight: Highlight = {
      id: Date.now().toString(),
      text: selectedText,
      color: color,
      range: selectedRange,
    };

    setPendingHighlight(newHighlight);
    setShowNoteModal(true);
    setShowMenu(false);
  };

  const saveNote = () => {
    if (pendingHighlight && currentNote.trim()) {
      setHighlights([...highlights, { ...pendingHighlight, note: currentNote }]);
    } else if (pendingHighlight) {
      setHighlights([...highlights, pendingHighlight]);
    }
    
    setShowNoteModal(false);
    setCurrentNote('');
    setPendingHighlight(null);
    window.getSelection()?.removeAllRanges();
  };

  const removeHighlight = (id: string) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const clearAllHighlights = () => {
    setHighlights([]);
    localStorage.removeItem(`highlights-${passageId}`);
  };

  // Render text với highlights
  const renderHighlightedText = () => {
    if (highlights.length === 0) {
      return <div>{content}</div>;
    }

    // Sắp xếp highlights theo vị trí
    const sortedHighlights = [...highlights].sort((a, b) => a.range.start - b.range.start);
    
    let lastIndex = 0;
    const elements: JSX.Element[] = [];

    sortedHighlights.forEach((highlight, idx) => {
      // Text trước highlight
      if (lastIndex < highlight.range.start) {
        elements.push(
          <span key={`text-${idx}`}>
            {content.substring(lastIndex, highlight.range.start)}
          </span>
        );
      }

      // Highlighted text
      elements.push(
        <span
          key={highlight.id}
          className="relative cursor-pointer group"
          style={{ backgroundColor: highlight.color }}
        >
          {content.substring(highlight.range.start, highlight.range.end)}
          
          {/* Tooltip hiển thị note */}
          {highlight.note && (
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {highlight.note}
            </span>
          )}
          
          {/* Nút xóa highlight */}
          <button
            onClick={() => removeHighlight(highlight.id)}
            className="absolute -top-2 -right-2  group-hover:block bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
          >
            ×
          </button>
        </span>
      );

      lastIndex = highlight.range.end;
    });

    // Text còn lại
    if (lastIndex < content.length) {
      elements.push(
        <span key="text-end">{content.substring(lastIndex)}</span>
      );
    }

    return <div>{elements}</div>;
  };

  return (
    <div className="relative">
      {/* Floating Menu */}
      {showMenu && (
        <div
          className="fixed z-50 bg-white shadow-lg rounded-lg p-2 flex items-center gap-2 border border-gray-200"
          style={{
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <button
            onClick={() => addHighlight('#fef08a')}
            className="flex items-center gap-1 px-3 py-2 hover:bg-yellow-100 rounded transition-colors"
            title="Highlight Yellow"
          >
            <Highlighter className="w-4 h-4 text-yellow-600" />
            <span className="text-sm">Yellow</span>
          </button>
          
          <button
            onClick={() => addHighlight('#bbf7d0')}
            className="flex items-center gap-1 px-3 py-2 hover:bg-green-100 rounded transition-colors"
            title="Highlight Green"
          >
            <Highlighter className="w-4 h-4 text-green-600" />
            <span className="text-sm">Green</span>
          </button>
          
          <button
            onClick={() => addHighlight('#fecaca')}
            className="flex items-center gap-1 px-3 py-2 hover:bg-red-100 rounded transition-colors"
            title="Highlight Red"
          >
            <Highlighter className="w-4 h-4 text-red-600" />
            <span className="text-sm">Red</span>
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          <button
            onClick={() => addHighlightWithNote('#fef08a')}
            className="flex items-center gap-1 px-3 py-2 hover:bg-blue-100 rounded transition-colors"
            title="Add Note"
          >
            <StickyNote className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Note</span>
          </button>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div data-aos = "fade" data-aos-duration="300" className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-3xl p-6 w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Note</h3>
              <Button
                onClick={() => {
                  setShowNoteModal(false);
                  setCurrentNote('');
                  setPendingHighlight(null);
                }}
                className="text-gray-500 hover:text-gray-700 hover:bg-white hover:shadow-2xl bg-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Selected text:</p>
              <p className="text-sm bg-yellow-100 p-2 rounded">
                &quot;{pendingHighlight?.text}&quot;
              </p>
            </div>

            <Textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Enter your note..."
              className="w-full h-24 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => {
                  setShowNoteModal(false);
                  setCurrentNote('');
                  setPendingHighlight(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl bg-white shadow-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={saveNote}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Button */}
      {highlights.length > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={clearAllHighlights}
            className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All Highlights
          </button>
        </div>
      )}

      {/* Content với text selection handler */}
      <div
        ref={contentRef}
        onMouseUp={handleTextSelection}
        className="select-text leading-relaxed text-gray-800 whitespace-pre-wrap"
      >
        {renderHighlightedText()}
      </div>

      {/* Highlights Summary (Optional) */}
      {highlights.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-2 text-sm text-gray-700">
            Your Highlights ({highlights.length})
          </h4>
          <div className="space-y-2">
            {highlights.map((highlight) => (
              <div
                key={highlight.id}
                className="text-sm p-2 rounded border border-gray-200"
                style={{ backgroundColor: `${highlight.color}40` }}
              >
                <p className="font-medium">&quot;{highlight.text}&quot;</p>
                {highlight.note && (
                  <p className="text-gray-600 text-xs mt-1 italic">
                    Note: {highlight.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Demo Component
// const HighlighterDemo = () => {
//   const sampleText = `A
// Conservationists have put the final touches to a giant artificial reef they have been assembling at the world-renowned Zoological Society of London (London Zoo). Samples of the planet's most spectacular corals – vivid green branching coral, yellow scroll, blue ridge and many more species – have been added to the giant tank along with fish that thrive in their presence: blue tang, clownfish and many others. The reef is in the zoo's new gallery, Tiny Giants, which is dedicated to the minuscule invertebrate creatures that sustain life across the planet.

// B
// Corals are composed of tiny animals, known as polyps, with tentacles for capturing small marine creatures in the sea water. These polyps are transparent but get their brilliant tones of pink, orange, blue, green, etc. from algae that live within them, which in turn get protection, while their photosynthesizing of the sun's rays provides nutrients for the polyps.

// C
// As a result, coral reefs are often described as the 'rainforests of the sea', though the comparison is dismissed by some naturalists, including David Attenborough. 'People say you cannot beat the rainforest,' Attenborough has stated. 'But that is simply not true. You go there and the first thing you think is: where are the birds? Where are the animals? They are hiding in the trees, of course. No, if you want beauty and wildlife, you want a coral reef.'`;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">IELTS Reading - Text Highlighter</h1>
      
//       <div className="bg-gray-50 p-4 rounded-lg mb-4">
//         <p className="text-sm text-gray-600">
//           📌 Instructions: Select any text to highlight it with different colors or add notes
//         </p>
//       </div>

//       <div className="bg-white rounded-lg shadow-lg p-6">
//         <TextHighlighter 
//           content={sampleText}
//           passageId="passage-1"
//         />
//       </div>
//     </div>
//   );
// };

export default TextHighlighter;