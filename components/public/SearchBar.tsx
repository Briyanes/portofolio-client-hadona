'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { debounce } from '@/lib/debounce';

export function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set('search', value);
      } else {
        params.delete('search');
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300),
    [searchParams, router, pathname]
  );

  // Update URL when query changes
  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  // Update input when URL search param changes (e.g., browser back)
  useEffect(() => {
    const searchParam = searchParams.get('search') || '';
    if (searchParam !== query) {
      setQuery(searchParam);
    }
  }, [searchParams]);

  const handleClear = () => {
    setQuery('');
    setIsFocused(false);
  };

  return (
    <div className={`transition-all duration-300 ${
      isFocused ? 'scale-[1.01]' : 'scale-100'
    }`}>
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <i className={`bi bi-search text-xl transition-colors duration-200 ${
            isFocused ? 'text-hadona-primary' : 'text-gray-400 group-hover:text-gray-500'
          }`}></i>
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Cari studi kasus..."
          aria-label="Cari studi kasus"
          className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 transition-all duration-300 outline-none
            ${isFocused
              ? 'border-hadona-primary ring-4 ring-hadona-primary/10 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 shadow-md'
            }
            bg-white text-gray-900 placeholder-gray-400
            focus:placeholder-gray-500`}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                       text-gray-400 hover:text-gray-600
                       transition-colors duration-200
                       p-1 rounded-full hover:bg-gray-100"
          >
            <i className="bi bi-x-circle text-xl"></i>
          </button>
        )}

        {/* Focus Ring Animation */}
        <div className={`absolute inset-0 rounded-2xl transition-all duration-300 -z-10
          ${isFocused ? 'bg-hadona-primary/5 scale-105' : 'bg-transparent scale-100'}
        `}></div>
      </div>

      {/* Search Hint */}
      {query && (
        <div className="absolute top-full left-0 mt-2 text-sm text-gray-500 animate-fade-in">
          <i className="bi bi-lightbulb text-hadona-yellow mr-1"></i>
          Menampilkan hasil untuk "{query}"
        </div>
      )}
    </div>
  );
}
