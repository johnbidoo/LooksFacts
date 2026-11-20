import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import CurrencySelect from '../ui/CurrencySelect'
import Icon from '../ui/Icon'
import Logo from '../ui/Logo'
import SearchOverlay from './SearchOverlay'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/skinfacts', label: 'SkinFacts' },
  { to: '/routine', label: 'Routine Builder' },
  { to: '/budget', label: 'Budget Finder' },
]

function useDismiss(open, setOpen, ref) {
  useEffect(() => {
    if (!open) return
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, setOpen, ref])
}

function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useDismiss(open, setOpen, ref)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account"
        className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-sand"
      >
        <Icon name="user" size={22} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute top-12 right-0 z-50 w-72 animate-slide-down rounded-xl border border-line bg-white p-2 shadow-xl shadow-black/5"
        >
          <div className="px-3 pt-2 pb-3">
            <p className="text-sm font-semibold text-ink">Accounts are coming soon</p>
            <p className="mt-1 text-[0.8rem] leading-relaxed text-ink-soft">
              Your routines are saved privately in this browser for now.
            </p>
          </div>
          <div className="border-t border-line pt-1">
            {[
              { to: '/routine', label: 'My routine' },
              { to: '/budget', label: 'Budget Finder' },
            ].map((l) => (
              <Link
                key={l.to}
                role="menuitem"
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-ink hover:bg-sand"
              >
                {l.label} <Icon name="chevronRight" size={16} className="text-ink-soft" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/** Desktop search "field" — opens the search overlay with live results. */
function SearchTrigger({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="hidden h-11 w-full max-w-md items-center gap-3 rounded-full border border-transparent bg-sand px-4 text-left text-sm text-ink-soft transition-colors hover:border-line-strong lg:flex"
    >
      <Icon name="search" size={18} />
      <span className="flex-1">Search products, brands, ingredients</span>
      <kbd className="rounded border border-line-strong px-1.5 font-sans text-[0.7rem]">/</kbd>
    </button>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { pathname } = useLocation()
  const [lastPath, setLastPath] = useState(pathname)

  // Close menus on navigation (adjust state during render — no effect needed)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setMenuOpen(false)
    setSearchOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // "/" opens search
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink text-white">
        <div className="container-page flex h-9 items-center justify-center text-center text-xs font-medium sm:justify-between">
          <p>Independent skincare information · Prices are indicative RRPs in AUD</p>
          <Link to="/budget" className="hidden underline-offset-2 hover:underline sm:block">
            Find cheaper alternatives →
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="container-page flex h-16 items-center gap-4 lg:h-[4.5rem] lg:gap-8">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="-ml-2 grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-sand lg:hidden"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
          </button>

          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      `rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors ${
                        isActive ? 'bg-sand text-ink' : 'text-ink-muted hover:text-ink'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex flex-1 items-center justify-end gap-1">
            <SearchTrigger onOpen={() => setSearchOpen(true)} />
            <div className="hidden md:block">
              <CurrencySelect />
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-sand lg:hidden"
            >
              <Icon name="search" size={22} />
            </button>
            <ProfileMenu />
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 animate-fade-in cursor-default bg-black/30"
          />
          <div className="relative flex h-full w-[min(86vw,360px)] animate-fade-in flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-sand"
              >
                <Icon name="close" size={22} />
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto p-2">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-lg px-3 py-3.5 text-base font-medium ${
                        isActive ? 'bg-sand text-ink' : 'text-ink-muted'
                      }`
                    }
                  >
                    {l.label}
                    <Icon name="chevronRight" size={18} className="text-ink-soft" />
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-line px-5 py-4 text-sm text-ink-muted">
              <span>Currency</span>
              <CurrencySelect />
            </div>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
