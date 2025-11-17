import { memo } from 'react';

const FOOTER_LINKS = {
  about: [
    { label: 'Our Story', href: '#' },
    { label: 'Why Choose Us', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  support: [
    { label: 'Contact Us', href: '#' },
    { label: 'Warranty', href: '#' },
    { label: 'Shipping Info', href: '#' },
  ],
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'YouTube', href: '#' },
    { label: 'TikTok', href: '#' },
  ],
} as const;

export const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-20 bg-white border-t border-gray-200 pt-12 pb-8"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-8 text-sm" aria-label="Footer navigation">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">About</h3>
            <ul className="space-y-2 text-gray-600 text-xs">
              {FOOTER_LINKS.about.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-blue-600 transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2 text-gray-600 text-xs">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-blue-600 transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Follow</h3>
            <ul className="space-y-2 text-gray-600 text-xs">
              {FOOTER_LINKS.social.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-blue-600 transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} Dirt Bike Shop - Built with React + TypeScript + Tailwind CSS v4
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Ride hard. Ride fast. Ride free.{' '}
            <span role="img" aria-label="dirt bike">
              🏍️
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
