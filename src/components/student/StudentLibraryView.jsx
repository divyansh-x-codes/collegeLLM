import React, { useState, useEffect } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  LIBRARY_BOOKS, 
  LIBRARY_CATEGORIES, 
  RESEARCH_REPOSITORIES 
} from '../../data/libraryBooks.js';
import { 
  BookOpen, 
  Search, 
  Download, 
  BookMarked, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Layers, 
  Sparkles, 
  Star, 
  Bookmark, 
  FileText, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  RotateCcw, 
  Share2, 
  Printer, 
  QrCode, 
  Filter, 
  GraduationCap, 
  Eye, 
  Book, 
  Check, 
  AlertCircle,
  Copy,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Building2,
  HardDriveDownload,
  SlidersHorizontal
} from 'lucide-react';

export const StudentLibraryView = () => {
  const { showToast } = useCollege();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('all'); // 'all' | 'digital' | 'reserves' | 'saved'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [activeMainTab, setActiveMainTab] = useState('catalog'); // 'catalog' | 'loans' | 'research'

  // Saved / Bookmarked books state (persisted)
  const [savedBookIds, setSavedBookIds] = useState(() => {
    try {
      const saved = localStorage.getItem('unity_library_saved_books');
      return saved ? JSON.parse(saved) : ['lib-1', 'lib-3'];
    } catch {
      return ['lib-1', 'lib-3'];
    }
  });

  // Active Loans state
  const [activeLoans, setActiveLoans] = useState([
    {
      loanId: 'LN-2026-9041',
      bookId: 'lib-3',
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      coverGradient: 'from-amber-600 via-stone-900 to-slate-950',
      borrowedDate: 'Oct 04, 2026',
      dueDate: 'Oct 25, 2026',
      daysRemaining: 11,
      pickupDesk: 'Von Neumann Reading Room Desk',
      renewalsLeft: 2,
      barcode: '9781449373320-UC4'
    },
    {
      loanId: 'LN-2026-8819',
      bookId: 'lib-1',
      title: 'Introduction to Algorithms (CLRS)',
      author: 'Cormen, Leiserson, Rivest, Stein',
      coverGradient: 'from-blue-700 via-indigo-900 to-slate-950',
      borrowedDate: 'Oct 11, 2026',
      dueDate: 'Oct 28, 2026',
      daysRemaining: 14,
      pickupDesk: 'Turing Science Wing · Circulation Desk',
      renewalsLeft: 3,
      barcode: '9780262046305-UC1'
    }
  ]);

  // Modal States
  const [readingBook, setReadingBook] = useState(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [readerFontSize, setReaderFontSize] = useState('base'); // 'sm' | 'base' | 'lg'
  const [readerTheme, setReaderTheme] = useState('dark'); // 'dark' | 'obsidian' | 'sepia'

  const [reservingBook, setReservingBook] = useState(null);
  const [pickupDeskChoice, setPickupDeskChoice] = useState('Turing Science Wing Express Locker (24/7 RFID)');
  const [pickupDayChoice, setPickupDayChoice] = useState('Today (Within 2 Hours)');
  const [reservationConfirmed, setReservationConfirmed] = useState(false);
  const [lastReservationCode, setLastReservationCode] = useState('');

  const [quickViewBook, setQuickViewBook] = useState(null);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);

  // Sync saved books with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('unity_library_saved_books', JSON.stringify(savedBookIds));
    } catch {
      // ignore storage error
    }
  }, [savedBookIds]);

  const toggleSaveBook = (bookId, title) => {
    if (savedBookIds.includes(bookId)) {
      setSavedBookIds(savedBookIds.filter(id => id !== bookId));
      showToast(`Removed "${title}" from your saved bookshelf.`, 'info');
    } else {
      setSavedBookIds([...savedBookIds, bookId]);
      showToast(`Saved "${title}" to your academic bookshelf!`, 'success');
    }
  };

  // Filter books
  const filteredBooks = LIBRARY_BOOKS.filter(book => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.courseCode.toLowerCase().includes(term) ||
      book.courseName.toLowerCase().includes(term) ||
      book.isbn.toLowerCase().includes(term) ||
      book.category.toLowerCase().includes(term);

    const matchesCategory = 
      selectedCategory === 'All' || 
      book.category === selectedCategory || 
      book.subCategory === selectedCategory;

    let matchesFormat = true;
    if (selectedFormat === 'digital') matchesFormat = book.isDigital;
    if (selectedFormat === 'reserves') matchesFormat = book.availableCopies > 0;
    if (selectedFormat === 'saved') matchesFormat = savedBookIds.includes(book.id);

    return matchesSearch && matchesCategory && matchesFormat;
  });

  // Handle open reader
  const handleOpenReader = (book) => {
    setReadingBook(book);
    setActiveChapterIndex(0);
    showToast(`Loading digital reserve reader: "${book.title}"...`, 'info');
  };

  // Handle open reservation modal
  const handleOpenReserve = (book) => {
    setReservingBook(book);
    setReservationConfirmed(false);
    setPickupDeskChoice('Turing Science Wing Express Locker (24/7 RFID)');
    setPickupDayChoice('Today (Within 2 Hours)');
  };

  // Confirm Reservation
  const handleConfirmReservation = () => {
    if (!reservingBook) return;
    const resCode = `UC-RES-${Math.floor(1000 + Math.random() * 9000)}-${reservingBook.courseCode.slice(0, 3)}`;
    setLastReservationCode(resCode);
    setReservationConfirmed(true);

    const newLoan = {
      loanId: resCode,
      bookId: reservingBook.id,
      title: reservingBook.title,
      author: reservingBook.author,
      coverGradient: reservingBook.coverGradient,
      borrowedDate: 'Reserved Today',
      dueDate: 'Hold Guaranteed (3 Days)',
      daysRemaining: 3,
      pickupDesk: pickupDeskChoice,
      renewalsLeft: 3,
      barcode: `${reservingBook.isbn}-${resCode}`
    };

    setActiveLoans([newLoan, ...activeLoans]);
    showToast(`Reservation Confirmed! Reference: ${resCode}. Ready for pickup.`, 'success');
  };

  // Renew Loan
  const handleRenewLoan = (loanId, title) => {
    setActiveLoans(activeLoans.map(l => {
      if (l.loanId === loanId) {
        return {
          ...l,
          dueDate: 'Nov 12, 2026 (+14 Days)',
          daysRemaining: l.daysRemaining + 14,
          renewalsLeft: Math.max(0, l.renewalsLeft - 1)
        };
      }
      return l;
    }));
    showToast(`Successfully renewed loan for "${title}". Extended by 14 days.`, 'success');
  };

  // Copy citation
  const copyCitation = (book, format = 'APA') => {
    const citation = format === 'APA'
      ? `${book.author} (${book.year}). ${book.title} (${book.edition}). ${book.publisher}. ISBN: ${book.isbn}.`
      : `[1] ${book.author}, "${book.title}", ${book.edition}, ${book.publisher}, ${book.year}.`;
    
    navigator.clipboard?.writeText(citation);
    showToast(`Copied ${format} academic citation to clipboard!`, 'success');
  };

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-7 text-slate-100 font-sans antialiased">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 pb-6 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Unity College Digital Commons & Reserves
            </span>
            <span>·</span>
            <span className="text-slate-400">Library Card #STU-2026-808</span>
            <span>·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Circulation Desk: Open until 10:00 PM
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-teal-500/20 via-indigo-500/20 to-purple-500/10 border border-teal-500/30">
              <BookMarked className="w-7 h-7 text-teal-400" />
            </div>
            <span>Campus Digital Library & Academic Textbooks</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
            Instant digital access to required collegiate course textbooks, peer-reviewed engineering archives, interactive E-Book reserves, and physical campus stack holds.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveMainTab('loans')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              activeMainTab === 'loans'
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-lg shadow-teal-950/40'
                : 'bg-[#0c1427] text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-teal-400" />
            <span>My Active Loans</span>
            <span className="px-1.5 py-0.2 rounded-full bg-teal-500 text-slate-950 font-bold text-[10px]">
              {activeLoans.length}
            </span>
          </button>

          <button
            onClick={() => setIsResearchModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all shadow-md shadow-indigo-950/40 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>IEEE / ACM Access</span>
          </button>
        </div>
      </div>

      {/* 2. Top Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0c1427] border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Catalog Volumes</p>
            <p className="text-2xl font-bold text-white mt-1">12,480+</p>
            <p className="text-[11px] text-teal-400 mt-0.5 flex items-center gap-1 font-mono">
              <Check className="w-3.5 h-3.5" /> 12 Core Active Course Reserves
            </p>
          </div>
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1427] border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Digital Reserves</p>
            <p className="text-2xl font-bold text-indigo-300 mt-1">100% Online</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Instant Reader with Chapter Excerpts
            </p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <HardDriveDownload className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1427] border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Campus Physical Stacks</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">112 Available</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              RFID Express Locker Pickup
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1427] border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">My Saved Bookshelf</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{savedBookIds.length} Saved</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Pinned for Midterm Prep
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs (Catalog vs Active Loans vs Research) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveMainTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMainTab === 'catalog'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Book className="w-4 h-4" />
          <span>Textbook Catalog ({filteredBooks.length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('loans')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMainTab === 'loans'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Active Loans & Holds ({activeLoans.length})</span>
        </button>

        <button
          onClick={() => setIsResearchModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
        >
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span>Research Archives (IEEE, ACM, arXiv)</span>
        </button>
      </div>

      {/* =========================================================================
          VIEW 1: ACTIVE LOANS & STACK RESERVES TAB
      ========================================================================= */}
      {activeMainTab === 'loans' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-400" />
                <span>Currently Borrowed Volumes & Physical Reservations</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Physical books must be returned to the Turing Science Wing circulation desk or RFID return drop boxes before the due date.
              </p>
            </div>
            <button
              onClick={() => setActiveMainTab('catalog')}
              className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Back to Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeLoans.map(loan => (
              <div 
                key={loan.loanId} 
                className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="flex gap-4">
                  {/* Miniature Book Spine */}
                  <div className={`w-20 h-28 shrink-0 rounded-lg bg-gradient-to-br ${loan.coverGradient} p-2 flex flex-col justify-between shadow-md border border-white/10 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-full blur-md"></div>
                    <div className="text-[8px] font-mono font-bold text-white/70 uppercase tracking-wider">Unity Reserve</div>
                    <div className="text-[10px] font-bold text-white leading-tight line-clamp-3">{loan.title}</div>
                    <div className="text-[8px] text-white/60 font-mono truncate">{loan.author}</div>
                  </div>

                  {/* Loan Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold">
                        {loan.loanId}
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {loan.dueDate}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base leading-snug line-clamp-1">{loan.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{loan.author}</p>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">Pickup / Stack: <strong className="text-slate-200">{loan.pickupDesk}</strong></span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Barcode: {loan.barcode}</span>
                        <span>{loan.renewalsLeft} renewals remaining</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loan Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      const book = LIBRARY_BOOKS.find(b => b.id === loan.bookId) || LIBRARY_BOOKS[0];
                      handleOpenReader(book);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-[#080d1b] border border-slate-800 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                    <span>Open E-Book Version</span>
                  </button>

                  <button
                    onClick={() => handleRenewLoan(loan.loanId, loan.title)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Renew Loan (+14 Days)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: FULL TEXTBOOK CATALOG (Search, Filters, Grid of Proper Books)
      ========================================================================= */}
      {activeMainTab === 'catalog' && (
        <div className="space-y-6">
          
          {/* Controls Bar: Search & Category Chips */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search 12,000+ textbooks by title, author, course code (e.g. CS-301), ISBN, or topic..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0c1427] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors shadow-inner"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-3 text-slate-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Format Filter Badges */}
              <div className="flex items-center gap-1.5 bg-[#0c1427] p-1 rounded-xl border border-slate-800 shrink-0 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setSelectedFormat('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedFormat === 'all'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Books ({LIBRARY_BOOKS.length})
                </button>
                <button
                  onClick={() => setSelectedFormat('digital')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedFormat === 'digital'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Digital E-Books
                </button>
                <button
                  onClick={() => setSelectedFormat('reserves')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedFormat === 'reserves'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Physical Stack
                </button>
                <button
                  onClick={() => setSelectedFormat('saved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    selectedFormat === 'saved'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-amber-400/80 hover:text-amber-300'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  <span>My Shelf ({savedBookIds.length})</span>
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1 pl-1 shrink-0">
                <Filter className="w-3 h-3 text-slate-400" />
                Category:
              </span>
              {LIBRARY_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                      : 'bg-[#0c1427] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count Banner */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white">{filteredBooks.length}</strong> textbooks 
              {selectedCategory !== 'All' && <span> in <strong className="text-teal-400">{selectedCategory}</strong></span>}
              {searchTerm && <span> matching "<strong className="text-white">{searchTerm}</strong>"</span>}
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              Institutional Catalog Ver 2026.4 · All Textbooks Peer-Verified
            </span>
          </div>

          {/* 4. THE PROPER BOOKS GRID */}
          {filteredBooks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0c1427] border border-slate-800 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No textbooks found matching your criteria</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try searching for broader keywords like "algorithms", "systems", "database", or clear your filter filters.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedFormat('all'); }}
                className="px-4 py-2 text-xs font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/30 rounded-xl hover:bg-teal-500/20 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredBooks.map(book => {
                const isSaved = savedBookIds.includes(book.id);

                return (
                  <div
                    key={book.id}
                    className="group rounded-2xl bg-[#0c1427] border border-slate-800 hover:border-slate-700/80 transition-all duration-200 shadow-xl flex flex-col justify-between overflow-hidden relative"
                  >
                    {/* Top Shelf / Cover & Details Split */}
                    <div className="p-5 flex gap-4">
                      {/* Realistic Collegiate 3D Book Cover */}
                      <div className="shrink-0 relative">
                        <div 
                          className={`w-28 sm:w-32 h-44 rounded-xl bg-gradient-to-br ${book.coverGradient} p-3 flex flex-col justify-between shadow-xl border border-white/15 relative overflow-hidden group-hover:scale-[1.02] transition-transform`}
                        >
                          {/* Book spine line & gloss reflection */}
                          <div className="absolute top-0 left-0 w-2 h-full bg-black/30 border-r border-white/10"></div>
                          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

                          {/* Cover Header */}
                          <div className="pl-1">
                            <span className="text-[7.5px] font-mono uppercase tracking-widest text-teal-300/90 font-bold block">
                              Unity College
                            </span>
                            <span className="text-[7px] font-mono text-white/50 block">
                              Academic Press
                            </span>
                          </div>

                          {/* Cover Center Title */}
                          <div className="pl-1 my-auto">
                            <h4 className="text-[11px] font-extrabold text-white leading-tight drop-shadow-md line-clamp-3">
                              {book.title}
                            </h4>
                            <p className="text-[8px] text-white/70 font-mono mt-1 line-clamp-1">
                              {book.author.split(',')[0]}
                            </p>
                          </div>

                          {/* Cover Footer / Edition */}
                          <div className="pl-1 pt-1 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[7.5px] font-mono text-teal-200 font-bold truncate">
                              {book.courseCode}
                            </span>
                            <span className="text-[7.5px] font-mono text-white/60">
                              {book.year}
                            </span>
                          </div>
                        </div>

                        {/* Floating Cover Badge */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%] text-center">
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900/95 text-teal-300 border border-teal-500/30 shadow-md block truncate">
                            {book.coverBadge}
                          </span>
                        </div>
                      </div>

                      {/* Right Side Book Metadata */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          {/* Course code & Availability pill */}
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold truncate">
                              {book.courseCode}
                            </span>

                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                              book.available
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${book.available ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                              {book.available ? `${book.availableCopies} in Stacks` : 'Checked Out'}
                            </span>
                          </div>

                          {/* Book Title */}
                          <h3 className="font-bold text-white text-base leading-snug line-clamp-2 group-hover:text-teal-300 transition-colors">
                            {book.title}
                          </h3>

                          {/* Edition & Authors */}
                          <p className="text-[11px] text-teal-400/90 font-mono mt-0.5">{book.edition}</p>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{book.author}</p>

                          {/* Ratings & Pages */}
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                            <span className="flex items-center gap-1 text-amber-400 font-bold">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {book.rating}
                            </span>
                            <span>·</span>
                            <span>{book.pages} Pages</span>
                            <span>·</span>
                            <span className="text-slate-500 truncate">{book.publisher.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Shelf Location Pin */}
                        <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate">{book.shelf}</span>
                        </div>
                      </div>
                    </div>

                    {/* Book Synopsis Snippet */}
                    <div className="px-5 pb-3">
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 bg-[#090f1d] p-2.5 rounded-xl border border-slate-800/60 font-sans">
                        {book.description}
                      </p>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 pt-3 border-t border-slate-800/80 bg-slate-900/30 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {/* Bookmark button */}
                        <button
                          onClick={() => toggleSaveBook(book.id, book.title)}
                          title={isSaved ? "Remove from my bookshelf" : "Save to my bookshelf"}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            isSaved
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-[#080d1b] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>

                        {/* Quick View Modal trigger */}
                        <button
                          onClick={() => setQuickViewBook(book)}
                          title="View Syllabus & Citation Info"
                          className="p-2 rounded-xl bg-[#080d1b] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* E-Book Reader Button */}
                        <button
                          onClick={() => handleOpenReader(book)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#080d1b] border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl transition-all cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                          <span>Read E-Book</span>
                        </button>

                        {/* Reserve Physical Copy Button */}
                        <button
                          onClick={() => handleOpenReserve(book)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl transition-all cursor-pointer ${
                            book.available
                              ? 'bg-teal-600 hover:bg-teal-500 shadow-md shadow-teal-950/40'
                              : 'bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-950/40'
                          }`}
                        >
                          <span>{book.available ? 'Reserve Copy' : 'Join Waitlist'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: INTERACTIVE DIGITAL E-BOOK READER
      ========================================================================= */}
      {readingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl bg-[#0a1122] border border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
            
            {/* Reader Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0c1427] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-12 rounded bg-gradient-to-br ${readingBook.coverGradient} shrink-0 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white`}>
                  {readingBook.courseCode}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold">
                      Digital Reserve Reader
                    </span>
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {readingBook.edition}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base truncate mt-0.5">
                    {readingBook.title}
                  </h3>
                </div>
              </div>

              {/* Reader Controls */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Font Size Selector */}
                <div className="hidden sm:flex items-center gap-1 bg-[#080d1b] p-1 rounded-xl border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setReaderFontSize('sm')}
                    className={`px-2 py-0.5 rounded ${readerFontSize === 'sm' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setReaderFontSize('base')}
                    className={`px-2 py-0.5 rounded ${readerFontSize === 'base' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setReaderFontSize('lg')}
                    className={`px-2 py-0.5 rounded ${readerFontSize === 'lg' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
                  >
                    A+
                  </button>
                </div>

                {/* Copy Citation */}
                <button
                  onClick={() => copyCitation(readingBook, 'APA')}
                  title="Copy APA Citation"
                  className="p-2 rounded-xl bg-[#080d1b] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {/* Download PDF button */}
                <button
                  onClick={() => showToast(`Initiating offline encrypted textbook bundle for "${readingBook.title}"...`, 'success')}
                  title="Download encrypted PDF for offline study"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600/20 text-teal-300 border border-teal-500/30 text-xs font-semibold hover:bg-teal-600/30 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>

                {/* Close Reader */}
                <button
                  onClick={() => setReadingBook(null)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reader Body: Sidebar + Main Content */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Sidebar: Table of Contents */}
              <div className="w-64 sm:w-72 border-r border-slate-800 bg-[#080e1c] p-4 overflow-y-auto hidden md:block space-y-3 shrink-0">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 font-bold text-teal-300">
                    <Layers className="w-3.5 h-3.5" />
                    Table of Contents
                  </span>
                  <span>{readingBook.chapters.length} Ch</span>
                </div>

                <div className="space-y-1.5">
                  {readingBook.chapters.map((ch, idx) => (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChapterIndex(idx)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer flex flex-col ${
                        activeChapterIndex === idx
                          ? 'bg-teal-500/20 text-teal-200 border border-teal-500/40 font-semibold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="leading-snug">{ch.title}</span>
                      <span className="text-[10px] font-mono text-slate-500 mt-1">Page {ch.pageStart}</span>
                    </button>
                  ))}
                </div>

                {/* Book Details Info Box */}
                <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1.5">
                  <div>Publisher: <span className="text-slate-300">{readingBook.publisher}</span></div>
                  <div>ISBN: <span className="text-slate-300">{readingBook.isbn}</span></div>
                  <div>Pages: <span className="text-slate-300">{readingBook.pages}</span></div>
                  <div>Syllabus: <span className="text-teal-400">{readingBook.courseCode}</span></div>
                </div>
              </div>

              {/* Main Reading Canvas */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#0a1122]">
                
                {/* Chapter Breadcrumb */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="text-teal-400 font-bold">{readingBook.courseCode}</span>
                    <span>/</span>
                    <span>Chapter {activeChapterIndex + 1} of {readingBook.chapters.length}</span>
                  </div>

                  <span className="text-xs font-mono text-slate-400">
                    Page {readingBook.chapters[activeChapterIndex].pageStart} of {readingBook.pages}
                  </span>
                </div>

                {/* Chapter Heading */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {readingBook.chapters[activeChapterIndex].title}
                  </h2>
                  <p className="text-xs text-teal-400 font-mono mt-1">
                    From {readingBook.title} ({readingBook.edition})
                  </p>
                </div>

                {/* Collegiate Excerpt Text */}
                <div className={`space-y-4 text-slate-200 leading-relaxed font-serif ${
                  readerFontSize === 'sm' ? 'text-sm' : readerFontSize === 'lg' ? 'text-lg' : 'text-base'
                }`}>
                  <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-teal-400 first-letter:mr-2 first-letter:float-left">
                    {readingBook.chapters[activeChapterIndex].excerpt}
                  </p>

                  <p>
                    In collegiate computer science curricula at Unity College, mastery of this chapter forms the mathematical bedrock for runtime optimization, algorithmic invariants, and system reliability guarantees. Students are encouraged to test implementations against the interactive test harness provided in the Unity College Virtual Lab.
                  </p>

                  {/* Academic Lemma / Theorem Callout Box */}
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 font-sans text-xs space-y-1">
                    <div className="font-bold font-mono text-indigo-300 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-400" />
                      Academic Theorem / Design Guarantee
                    </div>
                    <p className="text-slate-300 leading-normal">
                      Every sound implementation of the principles described in this chapter ensures asymptotic bounds within <em>O(n log n)</em> for average-case execution paths.
                    </p>
                  </div>

                  <p>
                    For continuous assessment, problem sets corresponding to this chapter are hosted under your Unity College Student Portal Assignments tab for <strong className="text-white font-sans">{readingBook.courseCode} ({readingBook.courseName})</strong>.
                  </p>
                </div>

                {/* Next / Previous Chapter Navigation */}
                <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4 font-sans">
                  <button
                    disabled={activeChapterIndex === 0}
                    onClick={() => setActiveChapterIndex(Math.max(0, activeChapterIndex - 1))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0c1427] border border-slate-800 hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Chapter</span>
                  </button>

                  <button
                    disabled={activeChapterIndex === readingBook.chapters.length - 1}
                    onClick={() => setActiveChapterIndex(Math.min(readingBook.chapters.length - 1, activeChapterIndex + 1))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Next Chapter</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: PHYSICAL STACK RESERVATION & CIRCULATION PASS
      ========================================================================= */}
      {reservingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0c1427] border border-slate-700 shadow-2xl p-6 sm:p-7 text-slate-100 font-sans space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Physical Stack Reservation</h3>
                  <p className="text-xs text-slate-400 font-mono">Turing Science Wing & Campus Circulation</p>
                </div>
              </div>

              <button
                onClick={() => setReservingBook(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!reservationConfirmed ? (
              /* Step 1: Confirmation Form */
              <div className="space-y-4">
                {/* Book Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex gap-3.5">
                  <div className={`w-14 h-20 rounded bg-gradient-to-br ${reservingBook.coverGradient} shrink-0 border border-white/20 p-1.5 flex flex-col justify-between`}>
                    <span className="text-[7px] font-mono text-teal-200 font-bold">{reservingBook.courseCode}</span>
                    <span className="text-[9px] font-bold text-white leading-tight line-clamp-2">{reservingBook.title}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {reservingBook.courseCode}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{reservingBook.title}</h4>
                    <p className="text-xs text-slate-400">{reservingBook.edition} · {reservingBook.author}</p>
                    <p className="text-xs text-teal-400 font-mono mt-1">Location: {reservingBook.shelf}</p>
                  </div>
                </div>

                {/* Pickup Location Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Select Campus Pickup Location:
                  </label>
                  <select
                    value={pickupDeskChoice}
                    onChange={(e) => setPickupDeskChoice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Turing Science Wing Express Locker (24/7 RFID)">Turing Science Wing Express Locker (24/7 RFID Pickup)</option>
                    <option value="Campus Main Circulation Desk (Level 1 Library Commons)">Campus Main Circulation Desk (Level 1 Library Commons)</option>
                    <option value="Von Neumann Reading Room Reserve Counter">Von Neumann Reading Room Reserve Counter</option>
                  </select>
                </div>

                {/* Pickup Window */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Hold Guarantee Window:
                  </label>
                  <select
                    value={pickupDayChoice}
                    onChange={(e) => setPickupDayChoice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Today (Within 2 Hours)">Today (Express Shelf Pull · Ready in 2 Hours)</option>
                    <option value="Tomorrow Morning (Before 10:00 AM)">Tomorrow Morning (Before 10:00 AM)</option>
                    <option value="Hold for 72 Hours">Hold for 72 Hours (Guaranteed Reservation)</option>
                  </select>
                </div>

                {/* Student Loan Agreement */}
                <div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/20 text-[11px] text-teal-300/90 leading-relaxed">
                  ✓ Standard collegiate loan duration is <strong>14 Days</strong>. Renewals can be made directly in this portal up to 3 times with zero late penalties for good standing students.
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setReservingBook(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReservation}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-950/40 transition-all cursor-pointer"
                  >
                    Confirm Stack Hold
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Confirmed Reservation Pass */
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-xl font-extrabold text-white">Stack Reservation Confirmed!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Your physical textbook copy has been placed on hold at the circulation desk.
                  </p>
                </div>

                {/* Realistic Pass Ticket */}
                <div className="p-5 rounded-2xl bg-[#080d1b] border border-teal-500/40 text-left space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[10px] text-slate-400">HOLD TOKEN</span>
                    <span className="text-xs font-bold text-teal-300">{lastReservationCode}</span>
                  </div>

                  <div className="text-xs text-white">
                    <strong>{reservingBook.title}</strong>
                    <div className="text-[11px] text-slate-400">{reservingBook.edition}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                    <div>
                      <span className="block text-slate-500">PICKUP LOCATION</span>
                      <span className="text-slate-200">{pickupDeskChoice.split('(')[0]}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">PICKUP BY</span>
                      <span className="text-emerald-400 font-bold">Within 72 Hours</span>
                    </div>
                  </div>

                  {/* Visual Barcode */}
                  <div className="pt-2 text-center border-t border-slate-800/80">
                    <div className="h-9 bg-slate-900 rounded border border-slate-800 flex items-center justify-center tracking-widest text-[11px] text-slate-400 font-mono">
                      ||| | | |||| || | || ||||| | ||| || |||
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 block">Scan at 24/7 RFID Locker or Circulation Desk</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setReservingBook(null);
                      setActiveMainTab('loans');
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md cursor-pointer"
                  >
                    View in My Active Loans
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: IEEE & ACM RESEARCH ARCHIVES ACCESS
      ========================================================================= */}
      {isResearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#0c1427] border border-slate-700 shadow-2xl p-6 sm:p-7 text-slate-100 font-sans space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Collegiate Research & Journal Archives</h3>
                  <p className="text-xs text-slate-400 font-mono">Institutional Federated SSO · Shibboleth Active</p>
                </div>
              </div>

              <button
                onClick={() => setIsResearchModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Institutional Credentials Banner */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold">
                  Active Institutional Pass
                </span>
                <p className="text-xs text-white font-semibold">Unity College Institute of Science & Technology</p>
                <p className="text-[11px] text-slate-400">Tier-1 Unlimited University Library Proxy Access</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 shrink-0">
                SSO Connected
              </span>
            </div>

            {/* Repositories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RESEARCH_REPOSITORIES.map(repo => (
                <div
                  key={repo.name}
                  className="p-4 rounded-2xl bg-[#080d1b] border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold">
                        {repo.tag}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {repo.badge}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{repo.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{repo.description}</p>
                  </div>

                  <a
                    href={repo.accessUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold bg-indigo-600/20 text-indigo-200 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <span>Launch Institutional Gateway</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsResearchModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Close Archives
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: BOOK QUICK DETAILS & SYLLABUS OVERVIEW
      ========================================================================= */}
      {quickViewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0c1427] border border-slate-700 shadow-2xl p-6 sm:p-7 text-slate-100 font-sans space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold">
                  {quickViewBook.courseCode}
                </span>
                <span className="text-xs font-mono text-slate-400">Syllabus Text Reference</span>
              </div>
              <button onClick={() => setQuickViewBook(null)} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="font-bold text-white text-xl leading-snug">{quickViewBook.title}</h3>
              <p className="text-xs text-teal-400 font-mono mt-0.5">{quickViewBook.edition}</p>
              <p className="text-xs text-slate-400 mt-1">Author(s): {quickViewBook.author}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#080d1b] p-3.5 rounded-2xl border border-slate-800">
              {quickViewBook.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">CAMPUS LOCATION</span>
                <span className="text-slate-200 mt-0.5 block">{quickViewBook.shelf}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ISBN-13</span>
                <span className="text-slate-200 mt-0.5 block">{quickViewBook.isbn}</span>
              </div>
            </div>

            {/* Citation Copy Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs">
              <span className="text-slate-300 font-mono text-[11px]">Academic Reference Citation</span>
              <button
                onClick={() => copyCitation(quickViewBook, 'APA')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy APA</span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  const b = quickViewBook;
                  setQuickViewBook(null);
                  handleOpenReader(b);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 cursor-pointer"
              >
                Open Reader
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
